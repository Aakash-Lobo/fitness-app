const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
  fitnessGoal: String,
  experienceLevel: String,
  preferredTime: String,
  status: {
    type: String,
    enum: ["pending", "declined", "accepted", "suggested"],
    default: "pending",
  },
  suggestedTrainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", default: null }
});

module.exports = mongoose.model("Booking", bookingSchema);
