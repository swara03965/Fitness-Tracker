const http = require("http");

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<h1>FitTrack Node HTTP Server</h1><p>Log your workouts at /workouts</p>");
}).listen(3001, () => console.log("HTTP server at http://localhost:3001"));