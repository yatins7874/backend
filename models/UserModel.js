const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/,  // Ensures that the phone number is 10 digits long
    unique: true
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "client", "farmer"],
    default: "client"
  },
  // Fields to handle password reset
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date }
});

module.exports = mongoose.model("User", userSchema);
