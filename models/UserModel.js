// models/UserModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "client", "farmer"],
    default: "client"
  }
});

module.exports = mongoose.model("User", userSchema);
