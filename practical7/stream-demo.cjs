const fs = require("fs");

const stream = fs.createReadStream("workouts.txt", "utf8");

stream.on("data", (chunk) => console.log("Stream chunk:\n" + chunk));

stream.on("end", () => console.log("Stream finished"));