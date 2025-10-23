// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading index.html");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

// WebSocket server on same port
const wss = new WebSocket.Server({ server });
let clients = [];

wss.on("connection", (socket) => {
  console.log("Client connected");
  clients.push(socket);

  socket.on("message", (msg) => {
    // broadcast to everyone else
    clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  socket.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter((c) => c !== socket);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
