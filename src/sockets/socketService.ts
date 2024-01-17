// src/sockets/socketHandler.ts
import WebSocket, { WebSocketServer } from "ws";
import { IncomingMessage } from "http";

const wss = new WebSocketServer({ noServer: true });
const openConnections: Set<WebSocket> = new Set();

wss.on("connection", (ws, _req: IncomingMessage) => {
  if (openConnections.has(ws)) {
    console.log("WebSocket connection is already open for this client.");
    ws.send("Error: WebSocket connection is already open.");
    ws.close();
    return;
  }

  console.log("WebSocket connection established.");

  openConnections.add(ws);
  ws.on("close", (code, reason) => {
    console.log(
      `WebSocket connection closed with code ${code} and reason ${reason}`
    );
    openConnections.delete(ws);
  });

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.send("Welcome to the WebSocket server!");
});

export default wss;
