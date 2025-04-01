import { WebSocket } from "ws";
import { WsError } from "../websocket-types";

type ErrorHandler = (ws: WebSocket, message: WsError["message"]) => void;

export const errorHandlers: Record<"default", ErrorHandler> = {
  default: (ws, message) => {
    ws.send(JSON.stringify({message}))
  }
}