const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust path if needed

// ✅ Fetch all trainers
router.get("/trainers", async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" }); // Ensure 'role' exists in DB
    res.json(trainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a new trainer
router.post("/trainers", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newTrainer = new User({
      name,
      email,
      password, // You might want to hash this before saving
      role: "trainer",
      status: "approved",
    });

    await newTrainer.save();
    res.status(201).json({ message: "Trainer added successfully", trainer: newTrainer });
  } catch (error) {
    res.status(500).json({ message: "Error adding trainer" });
  }
});

router.delete("/trainers/:id", async (req, res) => {
  try {
    const trainerId = req.params.id;

    // Validate MongoDB ObjectId format
    if (!trainerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Ensure we're searching in the 'users' collection
    const deletedTrainer = await User.findOneAndDelete({ _id: trainerId, role: "trainer" });

    if (!deletedTrainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    res.json({ message: "Trainer deleted successfully" });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
