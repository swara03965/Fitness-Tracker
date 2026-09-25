const fs = require("fs");

console.log("1 sync start");

setTimeout(() => console.log("3 timeout"), 0);

setImmediate(() => console.log("4 immediate"));

fs.readFile("workouts.txt", () => console.log("5 file I/O callback"));

console.log("2 sync end");