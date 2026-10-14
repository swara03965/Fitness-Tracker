const router = require("express").Router();
const Workout = require("../models/Workout");
const requireAuth = require("../middleware/auth");

// Every route below only ever touches the logged-in user's own workouts.
router.use(requireAuth);

// GET /api/workouts
router.get("/", async (req, res) => {
  const list = await Workout.find({ userId: req.userId }).sort({ date: -1, createdAt: -1 });
  res.json(list);
});

// POST /api/workouts
router.post("/", async (req, res) => {
  const { name, calories, minutes, sets, reps, date } = req.body || {};
  const kcal = Number(calories);

  if (!name?.trim() || !Number.isFinite(kcal) || kcal < 0)
    return res.status(400).json({ error: "Exercise name and calories are required." });

  const workout = await Workout.create({
    userId: req.userId,
    name,
    calories: kcal,
    minutes: Number(minutes) || 0,
    sets: Number(sets) || 3,
    reps: Number(reps) || 10,
    ...(date ? { date } : {}),
  });

  res.status(201).json(workout);
});

// PUT /api/workouts/:id
router.put("/:id", async (req, res) => {
  const allowed = ["name", "calories", "minutes", "sets", "reps", "date"];
  const update = Object.fromEntries(allowed.filter((k) => k in req.body).map((k) => [k, req.body[k]]));

  const updated = await Workout.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    update,
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ error: "Workout not found" });
  res.json(updated);
});

// DELETE /api/workouts/:id
router.delete("/:id", async (req, res) => {
  const deleted = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!deleted) return res.status(404).json({ error: "Workout not found" });
  res.json(deleted);
});

module.exports = router;
