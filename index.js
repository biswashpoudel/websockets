// Run: npm install ws
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
let clients = [];

wss.on("connection", (socket) => {
  clients.push(socket);
  console.log("New client connected");

  socket.on("message", (msg) => {
    clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  socket.on("close", () => {
    clients = clients.filter((c) => c !== socket);
  });
});

console.log("WebSocket signaling server running on ws://localhost:8080");
