const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true }, // Link to session
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Trainer creating the session
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User in the session
    sessionType: { type: String, required: true }, // Example: "Workout", "Consultation"
    date: { type: Date, required: true }, // Date of session
    duration: { type: Number, required: true }, // Duration in minutes
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
