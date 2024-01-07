// src/sockets/socketHandler.ts
import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";

// Define a WebSocket server
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket connections
wss.on("connection", (ws, _req: IncomingMessage) => {
  console.log("WebSocket connection established.");

  // Handle connection closing
  ws.on("close", (code, reason) => {
    console.log(
      `WebSocket connection closed with code ${code} and reason ${reason}`
    );
  });

  // Handle incoming messages
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  // Send a welcome message to the connected client
  ws.send("Welcome to the WebSocket server!");
});

export default wss;
