import Queue from "bull";
import { WsTimer } from "../websocket-types";
import { WebSocket } from "ws";

const timerQueue = new Queue("timerQueue", {
  redis: { host: "database", port: 6379 },
});

type TimerJob = (ws: WebSocket, data: WsTimer) => void;

export const timerJobs: Record<WsTimer["action"], TimerJob> = {
  /**
   * Sets a timer. Sends back initial data extended with jobId and currentDelay.
   * If data is invalid, sends back object with error message.
   */
  set: async (ws, data) => {
    if (!data.commands || !data.commands.length || !data.initDelay) {
      ws.send(JSON.stringify({type: "error", message: "Commands were not provided and/or initDelay is invalid"}));
      return;
    }
    const job = await timerQueue.add({ commands: data.commands }, { delay: data.initDelay * 1000 });
    data.jobId = job.id;
    data.currentDelay = job.opts.delay;
    ws.send(JSON.stringify(data));
  },
  /**
   * Extends provided data with commands, initDelay and currentDelay.
   * If data is invalid, sends back object with error message.
   */
  get: async (ws, data) => {
    if (!data.jobId) {
      ws.send(JSON.stringify({type: "error", message: "JobId was not provided"}));
      return;
    }
    const job = await timerQueue.getJob(data.jobId);
    const commands: WsTimer["commands"] = job?.data;
    const now = Date.now();

    data.commands = commands;
    data.initDelay = job?.opts.delay;
    data.currentDelay = Math.max((job?.timestamp || 0) + (job?.opts.delay || 0) - now, 0)*0.001;
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