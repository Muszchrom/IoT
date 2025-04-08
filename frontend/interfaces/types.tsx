type WsMessage = WsCommand | WsError | WsStatus

type WsCommand = {
  type: "command",
  payload: {
    deviceId: string,
    action: "turnOnOff" | "setBrightness" | "balacedBrightness",
    value: number
  }
}

type WsError = {
  type: 'error',
  message: string
}

type WsStatus = {
  type: 'status',
  status: {
    deviceId: string,
    isOn: boolean,
    brightnessLevel: number,
    balancedBrightness: boolean
  }
}

type WsTimer = {
  type: "timer",
  action: "set" | "get" | "del",
  initDelay?: number, // in seconds
  currentDelay?: number, // current status of timer, if < 0 then its deleted
  jobId?: string | number,
  commands?: WsCommand[] // commands that will be performed
}

export type {WsMessage, WsCommand, WsStatus, WsError, WsTimer}