const fs = require("fs");

const line = "2026-09-23 | Push-ups | 120 kcal\n";

fs.appendFile("workouts.txt", line, (err) => {
  if (err) throw err;

  fs.readFile("workouts.txt", "utf8", (e, data) => {
    console.log("Workout log:\n" + data);
  });
});