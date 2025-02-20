const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  dob: { type: String },
  address: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
