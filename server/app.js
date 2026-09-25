const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/exercises", require("./routes/exerciseRoutes"));
app.use("/api/workouts", require("./routes/workoutRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

