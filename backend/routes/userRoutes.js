const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Booking = require("../models/Booking"); // Create a Booking model if not already created

// GET all approved trainers
router.get("/trainers", async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer", status: "approved" }).select("name email");
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
    // Create a new booking with additional details
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
    res.status(500).json({ message: "Error processing request" });
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

    if (existingBooking) {
      return res.json({ pending: true });
    } else {
      return res.json({ pending: false });
    }
  } catch (error) {
    console.error("Error checking booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
