const router = require("express").Router();
const store = require("../data/store.cjs");

router.get("/", (req, res) => {
  res.status(200).json(store.workouts);
});

router.post("/", (req, res) => {
  const { exerciseId, date, calories } = req.body;

  if (!exerciseId || !date || !calories) {
    return res.status(400).json({
      error: "Missing required workout fields"
    });
  }

  const workout = {
    id: Date.now(),
    exerciseId,
    date,
    calories,
    status: "logged"
  };

  store.workouts.push(workout);

  res.status(201).json(workout);
});

router.put("/:id", (req, res) => {
  const item = store.workouts.find(
    (w) => w.id === +req.params.id
  );

  if (!item) {
    return res.status(404).json({
      error: "Workout not found"
    });
  }

  Object.assign(item, req.body);

  res.status(200).json(item);
});

router.delete("/:id", (req, res) => {
  const idx = store.workouts.findIndex(
    (w) => w.id === +req.params.id
  );

  if (idx === -1) {
    return res.status(404).json({
      error: "Workout not found"
    });
  }

  const [deleted] = store.workouts.splice(idx, 1);

  res.status(200).json(deleted);
});

module.exports = router;