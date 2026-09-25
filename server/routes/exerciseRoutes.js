const router = require("express").Router();
const store = require("../data/store");
router.get("/", (req, res) => res.status(200).json(store.exercises));
router.get("/:id", (req, res) => {
  const item = store.exercises.find((e) => e.id === +req.params.id);
  if (!item) return res.status(404).json({ error: "Exercise not found" });
  res.status(200).json(item);
});
router.post("/", (req, res) => {
  const created = { id: Date.now(), ...req.body };
  store.exercises.push(created);
  res.status(201).json(created);
});
router.put("/:id", (req, res) => {
  const item = store.exercises.find((e) => e.id === +req.params.id);
  if (!item) return res.status(404).json({ error: "Exercise not found" });
  Object.assign(item, req.body);
  res.status(200).json(item);
});
router.delete("/:id", (req, res) => {
  const idx = store.exercises.findIndex((e) => e.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Exercise not found" });
  const [deleted] = store.exercises.splice(idx, 1);
  res.status(200).json(deleted);
});
module.exports = router;

// ---- routes/workoutRoutes.js (POST with validation) ----
router.post("/", (req, res) => {
  const { exerciseId, date, calories } = req.body;
  if (!exerciseId || !date || !calories) {
    return res.status(400).json({ error: "Missing required workout fields" });
  }
  const workout = { id: Date.now(), exerciseId, date, calories, status: "logged" };
  workouts.push(workout);
  res.status(201).json(workout);
});