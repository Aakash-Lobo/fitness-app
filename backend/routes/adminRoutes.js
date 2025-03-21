const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust path if needed
const Gym = require("../models/Gym");


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

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, status },
      { new: true }
    );
    
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

// DELETE user
router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

router.get("/trainers", async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" });
    res.json(trainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Fetch all gyms with trainers
router.get("/gyms", async (req, res) => {
  try {
    const gyms = await Gym.find().populate("trainers", "name email");
    res.json(gyms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gyms", error });
  }
});

// ✅ Add a new gym with trainers
router.post("/gyms", async (req, res) => {
  try {
    const { name, address, latitude, longitude, facilities, trainers } = req.body;
    const newGym = new Gym({ name, address, latitude, longitude, facilities, trainers });
    await newGym.save();
    res.status(201).json({ message: "Gym added successfully", gym: newGym });
  } catch (error) {
    res.status(500).json({ message: "Error adding gym", error });
  }
});

// ✅ Update gym trainers
router.put("/gyms/:id/trainers", async (req, res) => {
  try {
    const { trainers } = req.body;
    const updatedGym = await Gym.findByIdAndUpdate(
      req.params.id,
      { trainers },
      { new: true }
    ).populate("trainers", "name email");

    if (!updatedGym) return res.status(404).json({ message: "Gym not found" });

    res.json(updatedGym);
  } catch (error) {
    res.status(500).json({ message: "Error updating gym trainers", error });
  }
});

// ✅ Delete a gym
router.delete("/gyms/:id", async (req, res) => {
  try {
    const deletedGym = await Gym.findByIdAndDelete(req.params.id);
    if (!deletedGym) return res.status(404).json({ message: "Gym not found" });
    res.json({ message: "Gym deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting gym", error });
  }
});


module.exports = router;
