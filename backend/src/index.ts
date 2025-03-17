import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";

const app = express();
const PORT = 8080;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log("New WebSocket connection");

  ws.on("message", (message: Buffer) => {
    const jsonString = message.toString("utf-8");
    try {
      const data = JSON.parse(jsonString);
      console.log("Received:",data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }

    // send data to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => console.log("WebSocket connection closed"));
});

server.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
