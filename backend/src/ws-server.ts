import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { WsCommand, WsError, WsMessage, WsStatus } from './websocket-schema';

export default function createWSServer(httpServer: Server) {
  const wss = new WebSocketServer({server: httpServer});

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      try {
        const parsed: WsMessage = JSON.parse(message.toString());
  
        if (!parsed.type) {
          throw new Error('Invalid message format');
        }
  
        switch (parsed.type) {
          case 'COMMAND':
            return commandHandler(parsed, (message) => ws.send(JSON.stringify(message)))
          default:
            console.log('Unhandled message type:', parsed.type);
        }
      } catch (err) {
        console.error('WS Error:', err);
        const message: WsError = {
          type: "ERROR",
          message: err instanceof Error ? err.message : "Unidentified error"
        };
        ws.send(JSON.stringify(message));
      }
    });
  });

  const commandHandler = (command: WsCommand, cb: (status: WsStatus | WsError) => void) => {
    const deviceStatus: WsStatus = {
      type: "STATUS",
      status: {
        deviceId: "HelloFromExpress",
        isOn: false,
        brightnessLevel: 0,
        balancedBrightness: false
      }
    };

    switch (command.payload.action) {
      case "turnOnOff":
        deviceStatus.status.balancedBrightness = false;
        deviceStatus.status.brightnessLevel = 100;
        deviceStatus.status.isOn = !!command.payload.value;
        return cb(deviceStatus);
      case "setBrightness":
        deviceStatus.status.balancedBrightness = false;
        deviceStatus.status.brightnessLevel = command.payload.value;
        deviceStatus.status.isOn = !!command.payload.value;
        return cb(deviceStatus);
      case "balacedBrightness":
        deviceStatus.status.balancedBrightness = !!command.payload.value;
        deviceStatus.status.brightnessLevel = 79;
        deviceStatus.status.isOn = !!command.payload.value;
        return cb(deviceStatus);
      default:
        const err: WsError = {
          type: "ERROR",
          message: "Unsupported action"
        };
        return cb(err);
    }
  }

  return wss;
}



