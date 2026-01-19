import http from "http";

// Create server
const server = http.createServer((req, res) => {
  // Enable CORS so React frontend can access this backend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Login route
  if (req.url === "/login" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk.toString());
    req.on("end", () => {
      console.log("Login data received:", body); // show in console
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Login successful", data: JSON.parse(body) }));
    });
  }
  // Register route
  else if (req.url === "/register" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk.toString());
    req.on("end", () => {
      console.log("Register data received:", body); // show in console
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Registration successful", data: JSON.parse(body) }));
    });
  }
  else {
    res.writeHead(404);
    res.end("Route not found");
  }
});

server.listen(5000, () => console.log("Server running on http://localhost:5000"));
