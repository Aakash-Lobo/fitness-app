const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  notes: { type: String },
  status: { type: String, enum: ["Scheduled" , "Completed", "Cancelled"],default: "Scheduled" },
  createdByTrainer: { type: Boolean, default: false },
});

module.exports = mongoose.model("Session", sessionSchema);
