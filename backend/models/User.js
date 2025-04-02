const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  dob: { type: String },  // Date of Birth
  address: { type: String }, // Address field
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ["user", "admin", "trainer"], default: "user" },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
  verified: { type: Boolean, default: false },
  verificationToken: String,  // Store unique token
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
