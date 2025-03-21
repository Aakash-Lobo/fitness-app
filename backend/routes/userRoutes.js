const express = require("express");
const router = express.Router();
const User = require("../models/User");// Ensure Trainer model exists
const Booking = require("../models/Booking"); 
const Session = require("../models/Session");

// GET all approved trainers
router.get("/trainers", async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer", status: "approved" })
      .select("name email specialization");

    res.json(trainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle trainer request (booking)
router.post("/request-trainer", async (req, res) => {
  const { userEmail, trainerId, fitnessGoal, experienceLevel, preferredTime } = req.body;

  if (!userEmail || !trainerId || !fitnessGoal || !experienceLevel || !preferredTime) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if there is an existing pending booking
    const existingBooking = await Booking.findOne({ userEmail, trainerId, status: "pending" });

    if (existingBooking) {
      return res.status(400).json({ message: "You already have a pending request with this trainer." });
    }

    // Create a new booking
    const newBooking = new Booking({
      userEmail,
      trainerId,
      fitnessGoal,
      experienceLevel,
      preferredTime,
      status: "pending",
    });

    await newBooking.save();
    res.status(201).json({ message: "Request sent successfully", booking: newBooking });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Check if a user already has a pending booking with a trainer
router.get("/check-booking", async (req, res) => {
  const { userEmail, trainerId } = req.query;

  if (!userEmail || !trainerId) {
    return res.status(400).json({ message: "Missing userEmail or trainerId" });
  }

  try {
    const existingBooking = await Booking.findOne({ userEmail, trainerId, status: "pending" });

    res.json({ pending: !!existingBooking });
  } catch (error) {
    console.error("Error checking booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET all accepted trainers for a user
router.get("/acceptedTrainers", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Find all approved bookings for this user
    const approvedBookings = await Booking.find({ userEmail: email, status: "approved" });

    if (approvedBookings.length === 0) {
      return res.json([]); // No accepted trainers
    }

    // Extract trainer IDs from approved bookings
    const trainerIds = approvedBookings.map((booking) => booking.trainerId);

    // Find trainer details from User collection
    const trainers = await User.find({ _id: { $in: trainerIds } }).select("name email specialization");

    res.json(trainers);
  } catch (error) {
    console.error("Error fetching accepted trainers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/cancelTrainer/:trainerId", async (req, res) => {
  try {
    const { trainerId } = req.params;
    const { email } = req.query;

    if (!trainerId || !email) {
      return res.status(400).json({ error: "Trainer ID and email are required." });
    }

    if (!trainerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid trainer ID format." });
    }

    // Find and update the booking status
    const updatedBooking = await Booking.findOneAndUpdate(
      { userEmail: email, trainerId, status: "approved" },
      { status: "cancelled" },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "No active booking found for this trainer." });
    }

    res.json({ message: "Trainer subscription cancelled successfully.", booking: updatedBooking });
  } catch (error) {
    console.error("Error cancelling trainer:", error);
    res.status(500).json({ error: "Server error while cancelling trainer." });
  }
});

router.post("/bookSession", async (req, res) => {
  try {
    const { userEmail, trainerId, date, time, duration, notes } = req.body;
    if (!userEmail || !trainerId || !date || !time || !duration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newSession = new Session({ userEmail, trainerId, date, time, duration, notes });
    await newSession.save();
    res.json({ message: "Session booked successfully", session: newSession });
  } catch (error) {
    console.error("Error booking session:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/upcomingSessions", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required." });

    // Fetch sessions where the user is scheduled
    const sessions = await Session.find({ userEmail: email, status: "Scheduled" })
      .populate("trainerId", "name"); // Fetch only the trainer's name

    res.json(sessions);
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/completedSessions", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "User email is required" });

    // Fetch completed sessions for the user
    let sessions = await Session.find({ userEmail: email, status: "Completed" });

    // Extract unique trainer IDs from the sessions
    const trainerIds = [...new Set(sessions.map(session => session.trainerId))];

    // Fetch trainer names based on IDs
    const trainers = await User.find({ _id: { $in: trainerIds } });

    // Create a mapping of trainerId -> trainer name
    const trainerMap = {};
    trainers.forEach(trainer => {
      trainerMap[trainer._id] = trainer.name;
    });

    // Attach trainerName to each session
    sessions = sessions.map(session => ({
      ...session.toObject(),
      trainerName: trainerMap[session.trainerId] || "Unknown",
    }));

    res.json(sessions);
  } catch (error) {
    console.error("Error fetching user session history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/sessions", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Fetch past sessions (completed & canceled)
    const sessions = await Session.find({
      userEmail: email,
      status: { $in: ["Completed", "Canceled"] },
    });

    // Fetch trainer details
    const trainerIds = [...new Set(sessions.map(session => session.trainerId))];
    const trainers = await User.find({ _id: { $in: trainerIds } }, "name _id");
    const trainerMap = Object.fromEntries(trainers.map(trainer => [trainer._id, trainer.name]));

    // Aggregate stats
    const totalHours = sessions.reduce((sum, s) => sum + s.duration / 60, 0).toFixed(1);
    const completedSessions = sessions.filter(s => s.status === "Completed").length;
    const canceledSessions = sessions.filter(s => s.status === "Canceled").length;

    // Attach trainer names to sessions
    const enrichedSessions = sessions.map(session => ({
      ...session.toObject(),
      trainerName: trainerMap[session.trainerId] || "Unknown",
    }));

    res.json({
      sessions: enrichedSessions,
      stats: { totalHours, completedSessions, canceledSessions },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

const formatDate = (date) => date.toISOString().split("T")[0];

// Get the first day of the week (Monday)
const getStartOfWeek = () => {
  const date = new Date();
  const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = day === 0 ? 6 : day - 1; // Adjust if Sunday
  date.setDate(date.getDate() - diff);
  return formatDate(date);
};

// Get first day of the current and previous month
const getStartOfMonth = (monthsAgo = 0) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo, 1);
  return formatDate(date);
};

// Get first day of the year
const getStartOfYear = () => {
  const date = new Date();
  date.setMonth(0, 1);
  return formatDate(date);
};

router.get("/progress", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "User email is required" });
    }

    const startOfWeek = getStartOfWeek();
    const startOfMonth = getStartOfMonth();
    const startOfLastMonth = getStartOfMonth(1);
    const startOfYear = getStartOfYear();

    // Number of visits
    const visitsThisWeek = await Session.countDocuments({ userEmail: email, date: { $gte: startOfWeek } });
    const visitsPrevMonth = await Session.countDocuments({ userEmail: email, date: { $gte: startOfLastMonth, $lt: startOfMonth } });
    const visitsThisMonth = await Session.countDocuments({ userEmail: email, date: { $gte: startOfMonth } });

    // Total duration of sessions
    const getTotalDuration = async (startDate, endDate = null) => {
      const matchQuery = { userEmail: email, date: { $gte: startDate } };
      if (endDate) matchQuery.date.$lt = endDate;

      const result = await Session.aggregate([
        { $match: matchQuery },
        { $group: { _id: null, totalDuration: { $sum: "$duration" } } }
      ]);

      return result[0]?.totalDuration || 0;
    };

    const durationPrevMonth = await getTotalDuration(startOfLastMonth, startOfMonth);
    const durationThisMonth = await getTotalDuration(startOfMonth);

    // Yearly session stats
    const yearlySessions = await Session.aggregate([
      { $match: { userEmail: email, date: { $gte: startOfYear } } },
      { $group: { _id: { $substr: ["$date", 5, 2] }, count: { $sum: 1 } } }, // Extracts month
      { $sort: { _id: 1 } }
    ]);

    // Get all session dates for calendar
    const sessionDates = await Session.find({ userEmail: email }, "date");

    res.json({
      visitsThisWeek,
      visitsPrevMonth,
      visitsThisMonth,
      durationPrevMonth,
      durationThisMonth,
      yearlySessions,
      sessionDates: sessionDates.map((s) => s.date),
    });

  } catch (error) {
    res.status(500).json({ error: "Error fetching progress data" });
  }
});


module.exports = router;
