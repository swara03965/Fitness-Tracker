const router = require("express").Router();
const store = require("../data/store.cjs");

router.get("/", (req, res) => {
  res.status(200).json(store.profile);
});

router.put("/", (req, res) => {
  Object.assign(store.profile, req.body);
  res.status(200).json(store.profile);
});

module.exports = router;