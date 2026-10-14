const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    profile: {
      age: String,
      height: String,
      weight: String,
      goal: { type: String, default: "Weight Loss" },
      level: { type: String, default: "Beginner" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
