// index.js
// Simple Express + WebSocket server that serves index.html and relays signaling/chat messages.
// Run: npm init -y && npm install express ws
const express = require("express");
const http = require("http");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve index.html from same folder
app.use(express.static(path.join(__dirname)));

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    // All messages are JSON strings — broadcast to all other clients
    let msg;
    try {
      msg = JSON.parse(message.toString());
    } catch (e) {
      console.warn("Non-JSON message received:", message.toString());
      return;
    }

    // Broadcast to everyone except sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
