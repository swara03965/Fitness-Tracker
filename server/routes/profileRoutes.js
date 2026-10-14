const router = require("express").Router();

let profile = {
  name: "Swara",
  goal: "Muscle Gain",
  weightKg: 58,
  weeklyTarget: 2000
};

router.get("/", (req, res) => {
  res.status(200).json(profile);
});

router.put("/", (req, res) => {
  Object.assign(profile, req.body);
  res.status(200).json(profile);
});

module.exports = router;