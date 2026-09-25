const mongoose = require("mongoose");
module.exports = mongoose.model("User", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  goal: String
}));