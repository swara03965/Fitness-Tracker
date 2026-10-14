const router = require("express").Router();

let goals = [
  {
    id: 1,
    title: "Hit 2000 kcal this week",
    done: false
  }
];

router.get("/", (req, res) => {
  res.status(200).json(goals);
});

router.post("/", (req, res) => {
  const created = {
    id: Date.now(),
    ...req.body
  };

  goals.push(created);

  res.status(201).json(created);
});

router.delete("/:id", (req, res) => {
  const index = goals.findIndex(
    (g) => g.id === +req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Goal not found"
    });
  }

  const [deleted] = goals.splice(index, 1);

  res.status(200).json(deleted);
});

module.exports = router;