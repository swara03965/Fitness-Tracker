require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Workout = require("./models/Workout");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected for FitTrack"))
  .catch((err) => console.error("MongoDB error:", err));

app.post("/api/users", async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

app.get("/api/users", async (req, res) => {
  res.json(await User.find());
});

app.post("/api/workouts", async (req, res) => {
  const workout = await Workout.create(req.body);
  res.status(201).json(workout);
});

app.get("/api/workouts", async (req, res) => {
  res.json(await Workout.find());
});

app.put("/api/workouts/:id", async (req, res) => {
  const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "Workout not found" });
  res.json(updated);
});

app.delete("/api/workouts/:id", async (req, res) => {
  const deleted = await Workout.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Workout not found" });
  res.json(deleted);
});

app.get('/', (req, res) => {
  res.send('FitTrack API is running 🚀');
});

app.listen(5000, () => console.log("FitTrack API running at http://localhost:5000"));

