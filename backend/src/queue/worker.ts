import Queue from "bull";
import { WsCommand, WsSchedule, WsTimer } from "../websocket-types";
import Redis from "ioredis";

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) throw new Error("No REDIS_HOST and REDIS_PORT in env vars");
const redis = new Redis(parseInt(process.env.REDIS_PORT), process.env.REDIS_HOST);

const timerQueue = new Queue("timerQueue", {
  redis: { host: "database", port: 6379 },
});

const scheduleQueue = new Queue("timerQueue", {
  redis: { host: "database", port: 6379 },
});

timerQueue.process(async (job) => {
  const data: WsTimer = job.data;
  if (!data.commands?.length) {
    throw Error("Commands array turned out to be empty while executing timer task");
  }

  
  const commands: WsCommand[] = data.commands;
  commands.forEach(async (command) => {
    const serverPid = await redis.hget("activeConnections", command.payload.deviceId);
    if (!serverPid) {
      console.log(`Client ${command.payload.deviceId} not found in active connections`);
      return;
    }
    await redis.publish("ws-messages", JSON.stringify(command));
  });
});


scheduleQueue.process(async (job) => {
  const data: WsSchedule = job.data
})