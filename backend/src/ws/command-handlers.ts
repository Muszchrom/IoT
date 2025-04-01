import { WebSocket } from "ws";
import { WsCommand } from "../websocket-types";
import { activeConnections } from "../ws-server";

type CommandHandler = (ws: WebSocket, data: WsCommand["payload"]) => void;

export const commandHandlers: Record<WsCommand["payload"]["action"], CommandHandler> = {
  turnOnOff: async (ws, data) => {
    const wsDevice = activeConnections.get("device")
    if (!wsDevice) return;
    wsDevice.send(JSON.stringify(data));
  },
  setBrightness: async (ws, data) => {
    const wsDevice = activeConnections.get("device")
    if (!wsDevice) return;
    wsDevice.send(JSON.stringify(data));
  },
  balancedBrightness: async () => {
  
  }
}