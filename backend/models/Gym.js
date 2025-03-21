const mongoose = require("mongoose");

const GymSchema = new mongoose.Schema({
  name: String,
  address: String,
  latitude: Number,
  longitude: Number,
  facilities: [String],
  trainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // New field
});

module.exports = mongoose.model("Gym", GymSchema);
