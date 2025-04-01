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

export type {WsMessage, WsCommand, WsStatus, WsError}