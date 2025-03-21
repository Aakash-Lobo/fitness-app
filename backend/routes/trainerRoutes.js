const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User"); // If trainers are stored here
const Session = require("../models/Session");

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


module.exports = router;
