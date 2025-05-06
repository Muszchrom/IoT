type WsMessage = WsCommand | WsError | WsStatus

type WsCommand = {
  type: "command",
  payload: {
    deviceId: string,
    action: "turnOnOff" | "setBrightness" | "balancedBrightness" | "getStatus",
    value: number
  }
}

type WsSchedule = {
  type: "schedule",
  action: "set" | "get" | "del" | "edit",
  active: boolean, // is this job disabled
  execReferenceTime: "absolute" | "sunrise" | "sunset"
  execTimeInMinutes: number, // hours and minutes in single variable, could be negative which means run before sunset/sunrise
  repeatAtDays: number[], // 0 - 6 / sun-sat
  jobId?: string | number,
  commands: WsCommand[] // commands that will be performed
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
    balancedBrightnessLevel: number
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

export type {WsMessage, WsCommand, WsStatus, WsError, WsTimer, WsSchedule}