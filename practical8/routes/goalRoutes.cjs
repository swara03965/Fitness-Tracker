const router = require("express").Router();
const store = require("../data/store.cjs");

router.get("/", (req, res) => {
  res.status(200).json(store.goals);
});

router.post("/", (req, res) => {
  const created = {
    id: Date.now(),
    ...req.body
  };

  store.goals.push(created);

  res.status(201).json(created);
});

router.delete("/:id", (req, res) => {
  const idx = store.goals.findIndex(
    (g) => g.id === +req.params.id
  );

  if (idx === -1) {
    return res.status(404).json({
      error: "Goal not found"
    });
  }

  const [deleted] = store.goals.splice(idx, 1);

  res.status(200).json(deleted);
});

module.exports = router;