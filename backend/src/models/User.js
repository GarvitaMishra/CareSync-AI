const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  // ✅ Updated role system (multi-role platform)
  role: {
    type: String,
    enum: ["user", "hospital"],
    default: "user"
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);