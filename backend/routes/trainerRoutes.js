const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User"); // If trainers are stored here

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

module.exports = router;
