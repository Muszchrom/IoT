import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { WsCommand, WsError, WsStatus } from './websocket-types';
import { parse } from 'url';
import { messageHandlers } from './ws/message-handlers';

export const activeConnections = new Map<"device" | "client", WebSocket>()

export default function createWSServer(httpServer: Server) {
  const wss = new WebSocketServer({server: httpServer});

  wss.on('connection', (ws, req) => {
    console.log(`${req.socket.remoteAddress} ${req.socket.remotePort} connected`)
    // verify user/device webtokens here
    // jwt would have user/device id
    const query = parse(req.url || "", true).query;
    const token = query.token as string;
    if (token === "client") {
      activeConnections.set("client", ws);
      // send initial device status
    } else if (token === "device") {
      activeConnections.set("device", ws);
    } else {
      ws.close(1008, "Invalid token");
    }

    ws.on('message', (message) => {
      try {
        const parsed: WsCommand | WsStatus | WsError = JSON.parse(message.toString());
        // console.log(parsed)
        if (!parsed.type) throw new Error('Invalid message format');

        if (parsed.type === "command") {
          const handler = messageHandlers.command;
          handler(ws, parsed);
        } else if (parsed.type === "status") {
          const handler = messageHandlers.status;
          handler(ws, parsed);
        } else if (parsed.type === "error") {
          const handler = messageHandlers.error;
          handler(ws, parsed)
        } else {
          console.warn("Unsupported message type:", parsed);
        }
      } catch (err) {
        console.error('WS Error:', err);
        ws.send(JSON.stringify({message: "An error occured", err: err}));
      }
    });
  });
  return wss;
}



