const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User"); // If trainers are stored here
const Session = require("../models/Session");
const Notification = require("../models/Notification");

// Fetch booking requests for a specific trainer
router.get("/requests/:trainerId", async (req, res) => {
  try {
    const requests = await Booking.find({ trainerId: req.params.trainerId });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// Update request status (Accept/Decline)
router.put("/update-request/:requestId", async (req, res) => {
  const { status } = req.body;
  try {
    const updatedRequest = await Booking.findByIdAndUpdate(
      req.params.requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) return res.status(404).json({ error: "Request not found" });

    res.json({ message: "Request updated", request: updatedRequest });
  } catch (error) {
    res.status(500).json({ error: "Failed to update request" });
  }
});

// Suggest a different trainer
router.put("/suggest-trainer/:requestId", async (req, res) => {
  const { newTrainerId } = req.body;

  try {
    const updatedRequest = await Booking.findByIdAndUpdate(
      req.params.requestId,
      { trainerId: newTrainerId, status: "suggested" },
      { new: true }
    );

    if (!updatedRequest) return res.status(404).json({ error: "Request not found" });

    res.json({ message: "Trainer suggested", request: updatedRequest });
  } catch (error) {
    res.status(500).json({ error: "Failed to suggest trainer" });
  }
});

// Fetch all trainers (if stored in User collection)
router.get("/user/trainers", async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" }, "name _id");
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trainers" });
  }
});

router.get("/scheduledSessions", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required." });

    // Find trainer by email
    const trainer = await User.findOne({ email, role: "trainer" });
    if (!trainer) return res.status(404).json({ message: "Trainer not found." });

    // Find sessions assigned to this trainer
    const sessions = await Session.find({ trainerId: trainer._id, status: "Scheduled" });

    // Fetch user names based on email
    const userEmails = sessions.map(session => session.userEmail);
    const users = await User.find({ email: { $in: userEmails } });

    // Map user names to sessions
    const sessionsWithUserNames = sessions.map(session => {
      const user = users.find(user => user.email === session.userEmail);
      return {
        ...session.toObject(),
        userName: user ? user.name : "Unknown User", // Default if user not found
      };
    });

    res.json(sessionsWithUserNames);
  } catch (error) {
    console.error("Error fetching trainer's scheduled sessions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.put("/update-session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { time, duration, notes, status } = req.body;

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { time, duration, notes, status },
      { new: true }
    );

    if (!updatedSession) return res.status(404).json({ message: "Session not found" });

    res.json(updatedSession);
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/cancelSession/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const deletedSession = await Session.findByIdAndDelete(sessionId);

    if (!deletedSession) return res.status(404).json({ message: "Session not found." });

    res.json({ message: "Session canceled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel session." });
  }
});

router.get("/completedSessions", async (req, res) => {
  try {
    const { trainerId } = req.query;
    if (!trainerId) return res.status(400).json({ error: "Trainer ID is required" });

    // Fetch sessions where status is "Completed" and trainerId matches
    let sessions = await Session.find({ trainerId, status: "Completed" });

    // Extract unique user emails from the sessions
    const userEmails = [...new Set(sessions.map(session => session.userEmail))];

    // Fetch users' names based on emails
    const users = await User.find({ email: { $in: userEmails } });

    // Create a mapping of email -> name
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user.name;
    });

    // Attach userName to each session
    sessions = sessions.map(session => ({
      ...session.toObject(),
      userName: userMap[session.userEmail] || "Unknown",
    }));

    res.json(sessions);
  } catch (error) {
    console.error("Error fetching completed sessions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/bookings",  async (req, res) => {
  try {
      const trainerId = req.query.trainerId;
      if (!trainerId) return res.status(400).json({ message: "Trainer ID is required" });

      const bookings = await Booking.find({ trainerId, status: "accepted" });
      
      // Fetch user details
      const users = await User.find({ email: { $in: bookings.map(b => b.userEmail) } });
      const userMap = users.reduce((acc, user) => {
          acc[user.email] = user.name;
          return acc;
      }, {});

      const bookingsWithNames = bookings.map(booking => ({
          ...booking.toObject(),
          userName: userMap[booking.userEmail] || "Unknown"
      }));

      res.json(bookingsWithNames);
  } catch (error) {
      console.error("Error fetching trainer bookings:", error);
      res.status(500).json({ message: "Server error" });
  }
});



// Cancel a booking
router.post("/cancel-booking", async (req, res) => {
  try {
      const { bookingId } = req.body;
      if (!bookingId) return res.status(400).json({ error: "Booking ID is required" });

      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ error: "Booking not found" });

      if (booking.status === "cancelled") {
          return res.status(400).json({ error: "Booking is already cancelled" });
      }

      booking.status = "cancelled";
      await booking.save();

      res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/progress", async (req, res) => {
  try {
    const { trainerId, user } = req.query;

    if (!trainerId) {
      return res.status(400).json({ message: "Trainer ID is required." });
    }

    // Find completed sessions linked to the trainer
    let progressQuery = { trainerId, sessionCompleted: true };
    if (user !== "all") {
      progressQuery.userEmail = user;
    }

    const progressData = await Session.find(progressQuery);

    // Extract unique user emails from completed sessions
    const userEmails = [...new Set(progressData.map((p) => p.userEmail))];

    // Fetch user details from Users collection
    const users = await User.find({ email: { $in: userEmails } }, "email name");

    // Prepare stats
    const stats = {
      visitsThisWeek: progressData.reduce((sum, p) => sum + (p.visitsThisWeek || 0), 0),
      visitsPrevMonth: progressData.reduce((sum, p) => sum + (p.visitsPrevMonth || 0), 0),
      visitsThisMonth: progressData.reduce((sum, p) => sum + (p.visitsThisMonth || 0), 0),
      durationPrevMonth: progressData.reduce((sum, p) => sum + (p.durationPrevMonth || 0), 0),
      durationThisMonth: progressData.reduce((sum, p) => sum + (p.durationThisMonth || 0), 0),
      yearlySessions: progressData.flatMap((p) => p.yearlySessions) || [],
    };

    res.json({ progress: progressData, users, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/bookSession", async (req, res) => {
  try {
    console.log("🔍 Incoming request body:", req.body);

    const { userEmail, trainerId, date, time, duration, notes, sessionType } = req.body;

    if (!userEmail || !trainerId || !date || !time || !duration) {
      console.error("❌ Missing required fields:", req.body);
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.error("❌ User not found:", userEmail);
      return res.status(404).json({ error: "User not found" });
    }

    // Create session
    const newSession = new Session({ userEmail, trainerId, date, time, duration, notes, createdByTrainer: true });

    console.log("✅ Saving session:", newSession);
    await newSession.save();

    // Create notification
    const newNotification = new Notification({
      sessionId: newSession._id,
      trainerId,
      userId: user._id,
      date,
      time,
      duration,
      notes,
      message: `Trainer booked a session with ${userEmail}`,
      sessionType: sessionType || "general", // Use a default value if missing
    });
    

    console.log("✅ Saving notification:", newNotification);
    await newNotification.save();

    res.json({ message: "Session booked successfully", session: newSession });

  } catch (error) {
    console.error("🚨 Error booking session:", error);
    res.status(500).json({ error: "Server error" });
  }
});





router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});




module.exports = router;
