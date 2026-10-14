const express = require("express");
const cors = require("cors");

// Builds the Express app (no DB connection / listen here, so it is easy to test).
module.exports = function createApp() {
  const app = express();

  // CLIENT_URL = your Netlify site, e.g. https://fitnessracker.netlify.app
  // (comma-separate several). If unset, any origin is allowed (dev only).
  const origins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);

  app.use(cors({ origin: origins.length ? origins : true }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/", (_req, res) => res.send("FitTrack API is running 🚀"));
  app.get("/health", (_req, res) => {
    const c = require("mongoose").connection;
    res.json({ ok: true, database: c.name || null, dbConnected: c.readyState === 1 });
  });

  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/workouts", require("./routes/myWorkoutRoutes"));

  app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

  // Central error handler (Express 5 forwards async errors here)
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err.name === "CastError") return res.status(404).json({ error: "Not found" });
    if (err.name === "ValidationError") return res.status(400).json({ error: err.message });
    if (err.code === 11000) return res.status(409).json({ error: "Already exists." });
    console.error(err);
    res.status(500).json({ error: "Something went wrong on the server." });
  });

  return app;
};
