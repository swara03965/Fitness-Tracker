const mongoose = require("mongoose");
module.exports = mongoose.model("Workout", new mongoose.Schema({
  name: { type: String, required: true },
  sets: Number,
  reps: Number,
  calories: Number,
  user: String,
  date: { type: String, default: () => new Date().toISOString().slice(0, 10) }
}));