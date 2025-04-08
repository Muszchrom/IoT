import { WebSocket } from "ws";
import { WsCommand, WsError, WsStatus } from "../websocket-types";
import { commandHandlers } from "./command-handlers";
import { statusHandlers } from "./status-handlers";
import { errorHandlers } from "./error-handlers";

export const messageHandlers = {
  command: (ws: WebSocket, data: WsCommand) => {
    const handler = commandHandlers[data.payload.action];
    if (handler) handler(data.payload);
    else throw new Error(`Unsupported handler for action: ${data.payload.action}`);
  },
  status: (ws: WebSocket, data: WsStatus) => {
    const handler = statusHandlers["default"];
    handler(ws, data); // no checking, key hardcoded
  },
  error: (ws: WebSocket, data: WsError) => {
    const handler = errorHandlers["default"];
    handler(ws, data.message);
  }
}