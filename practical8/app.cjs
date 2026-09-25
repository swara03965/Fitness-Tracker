const express = require("express");

const app = express();

app.use(express.json());

app.use(express.static("public"));

app.use("/api/profile", require("./routes/profileRoutes.cjs"));
app.use("/api/exercises", require("./routes/exerciseRoutes.cjs"));
app.use("/api/workouts", require("./routes/workoutRoutes.cjs"));
app.use("/api/goals", require("./routes/goalRoutes.cjs"));

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});