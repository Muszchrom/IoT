import Queue from "bull";
import { WsTimer } from "../websocket-types";
import { WebSocket } from "ws";
import Redis from "ioredis";

const timerQueue = new Queue("timerQueue", {
  redis: { host: "database", port: 6379 },
});

type TimerJob = (ws: WebSocket, data: WsTimer, redisClient: Redis) => void;

export const timerJobs: Record<WsTimer["action"], TimerJob> = {
  /**
   * Sets a timer. Sends back initial data extended with jobId and currentDelay.
   * If data is invalid, sends back object with error message.
   */
  set: async (ws, data, redisClient) => {
    if (!data.commands || !data.commands.length || !data.initDelay) {
      ws.send(JSON.stringify({type: "error", message: "Commands were not provided and/or initDelay is invalid"}));
      return;
    }
    const job = await timerQueue.add({ commands: data.commands }, { delay: data.initDelay * 1000 });
    // this basically removes old hset for client, timer kill switch handles invalid jobs (in get below)
    // where time delta is negative.
    redisClient.hset(`client`, "timer.jobId", job.id);
    data.jobId = job.id;
    data.currentDelay = job.opts.delay;
    ws.send(JSON.stringify(data));
  },
  /**
   * Extends provided data with commands, initDelay and currentDelay.
   * If data is invalid, sends back object with error message.
   */
  get: async (ws, data, redisClient) => {
    const id = await redisClient.hget(`client`, "timer.jobId");
    if (!id) {
      ws.send(JSON.stringify({type: "error", message: "JobId was not provided"}));
      return;
    }
    const job = await timerQueue.getJob(id);
    const commands: WsTimer["commands"] = job?.data;
    // const now = Date.now();
    data.jobId = id;
    data.commands = commands;
    data.initDelay = job?.opts.delay ? job?.opts.delay * 0.001 : 0;
    data.currentDelay = job?.timestamp || 0;
    ws.send(JSON.stringify(data));
  },
  /**
   * Deletes the timer, based on it's jobId. Sends back data with currentDelay set to -404.
   * If data is invalid, sends back object with error message.
   */
  del: async (ws, data) => {
    if (!data.jobId) {
      ws.send(JSON.stringify({type: "error", message: "JobId was not provided"}));
      return;
    }
    const job = await timerQueue.getJob(data.jobId);
    if (!job) {
      ws.send(JSON.stringify({type: "error", message: "Invalid jobId or timer doesn't exist anymore"}));
      return;
    }
    await job.remove();
    data.currentDelay = -404;
    ws.send(JSON.stringify(data));
  }
}