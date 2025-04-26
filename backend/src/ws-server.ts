import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { WsCommand, WsMessage } from './websocket-types';
import { parse } from 'url';
import { messageHandlers } from './ws/message-handlers';
import { timerJobs } from './queue/timer-jobs';
import { Redis } from "ioredis";
import { commandHandlers } from './ws/command-handlers';
import { v4 } from 'uuid';

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) throw new Error("No REDIS_HOST and REDIS_PORT in env vars");
const redisSubscriber = new Redis(parseInt(process.env.REDIS_PORT), process.env.REDIS_HOST);
const redisClient = new Redis(parseInt(process.env.REDIS_PORT), process.env.REDIS_HOST);
export const activeConnections = new Map<string, WebSocket>();

redisSubscriber.subscribe("ws-messages");
redisSubscriber.on("message", (channel, message) => {
  if (channel === "ws-messages") {
    const command: WsCommand = JSON.parse(message);
    commandHandlers[command.payload.action](command.payload);
  }
})

export default function createWSServer(httpServer: Server) {
  const wss = new WebSocketServer({server: httpServer});

  wss.on('connection', async (ws, req) => {
    console.log(`${req.socket.remoteAddress} ${req.socket.remotePort} connected`)
    // verify user/device webtokens here
    // jwt would have user/device id
    const query = parse(req.url || "", true).query;
    const token = query.token as string;
    if (token !== "client" && token !== "device") return ws.close(1008, "Invalid token");
    activeConnections.set(token, ws);
    redisClient.hset("activeConnections", token, process.pid.toString());

    ws.on('message', async (message) => {
      try {
        const parsed: WsMessage = JSON.parse(message.toString());
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
        } else if (parsed.type === "timer") {
          timerJobs[parsed.action](ws, parsed, redisClient);
        } else {
          console.warn("Unsupported message type:", parsed);
        }
      } catch (err) {
        console.error('WS Error:', err);
        ws.send(JSON.stringify({message: "An error occured", err: err}));
      }
    });

    ws.on('close', async () => {
      activeConnections.delete(token);
      redisClient.hdel("activeConnections", token);
    })
  });
  return wss;
}



