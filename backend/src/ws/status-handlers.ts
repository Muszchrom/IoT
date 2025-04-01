import { WebSocket } from "ws";
import { WsStatus } from "../websocket-types";
import { activeConnections } from "../ws-server";

type StatusHandler = (ws: WebSocket, status: WsStatus["status"]) => void;

export const statusHandlers: Record<"default", StatusHandler> = {
  default: (ws, status) => {
    if (status.deviceId === "device") {
      const wsClient = activeConnections.get("client");
      if (!wsClient) return;
      wsClient.send(JSON.stringify(status));
    }
  }
}