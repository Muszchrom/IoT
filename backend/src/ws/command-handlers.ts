import { WebSocket } from "ws";
import { WsCommand } from "../websocket-types";
import { activeConnections } from "../ws-server";

type CommandHandler = (data: WsCommand["payload"]) => void;

export const commandHandlers: Record<WsCommand["payload"]["action"], CommandHandler> = {
  turnOnOff: async (data) => {
    const wsDevice = activeConnections.get(data.deviceId);
    if (!wsDevice) return;
    wsDevice.send(JSON.stringify(data));
  },
  setBrightness: async (data) => {
    const wsDevice = activeConnections.get(data.deviceId);
    if (!wsDevice) return;
    wsDevice.send(JSON.stringify(data));
  },
  balancedBrightness: async () => {
  
  }
}