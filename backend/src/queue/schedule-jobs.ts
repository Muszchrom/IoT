import Queue from "bull";
import { WsSchedule } from "../websocket-types";
import { WebSocket } from "ws";
import Redis from "ioredis";

const scheduleQueue = new Queue("timerQueue", {
  redis: { host: "database", port: 6379 },
});
const cronDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
type ScheduleJob = (ws: WebSocket, data: WsSchedule, redisClient: Redis) => void;

const sendAllData = async (ws: WebSocket, redisClient: Redis) => {
  const ids = await redisClient.hgetall(`client`);
  if (!ids) {
    ws.send(JSON.stringify({type: "error", message: "JobId was not provided"}));
    return;
  }

  const newData = [];
  // no promise.all() 13h - sleep time left cant google that
  for (let [key, jobId] of Object.entries(ids)) {
    const re = /^schedule\.jobId\./;
    if (!key.match(re)) continue;
    const job = await scheduleQueue.getJob(jobId);
    if (!job) throw new Error("Redis had jobId of job that doesnt exist");
    job.data.data.jobId = jobId
    job.data.data.action = "get"
    newData.push(job.data.data);
  }

  ws.send(JSON.stringify({type: "schedule", action: "get", data: newData}));
}

export const scheduleJobs: Record<WsSchedule["action"], ScheduleJob> = {
  set: async (ws, data, redisClient) => {
    const hours = Math.floor(data.execTimeInMinutes / 60);
    const minutes = data.execTimeInMinutes - hours * 60;
    const days = (() => {
      if (data.repeatAtDays.length != 7) throw new Error("Invalid days array for set schedule");
      return cronDays.filter((day, idx) => data.repeatAtDays[idx] && day).join();
    })()
    const job = await scheduleQueue.add({commands: data.commands, data: data}, {
      repeat: {cron: `${minutes} ${hours} * * ${days}`}
    });
    redisClient.hset(`client`, `schedule.jobId.${job.id}`, job.id);
    data.jobId = job.id;
    await sendAllData(ws, redisClient); 
    // ws.send(JSON.stringify(data));    
  },


  get: async (ws, data, redisClient) => {
    await sendAllData(ws, redisClient);
  },


  del: async (ws, data, redisClient) => {
    if (!data.jobId) {
      ws.send(JSON.stringify({type: "error", message: "JobId was not provided"}));
      return;
    }
    const job = await scheduleQueue.getJob(data.jobId);
    if (!job) {
      ws.send(JSON.stringify({type: "error", message: "Invalid jobId or timer doesn't exist anymore"}));
      return;
    }
    await job.remove();
    redisClient.hdel(`client`, `schedule.jobId.${job.id}`);
    await sendAllData(ws, redisClient);
    // ws.send(JSON.stringify(data));
  },
  edit: async (ws, data, redisClient) => {
    if (!data.jobId) {
      ws.send(JSON.stringify({type: "error", message: "JobId was not provided"}));
      return;
    }
    const job = await scheduleQueue.getJob(data.jobId);
    if (!job) throw new Error("Redis had jobId of job that doesnt exist");
    await job.update({commands: data.commands, data: data});
    await sendAllData(ws, redisClient); 
  }
}

