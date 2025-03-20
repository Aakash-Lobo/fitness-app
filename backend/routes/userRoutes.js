const express = require("express");
const router = express.Router();
const User = require("../models/User");// Ensure Trainer model exists
const Booking = require("../models/Booking"); 

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


module.exports = router;
