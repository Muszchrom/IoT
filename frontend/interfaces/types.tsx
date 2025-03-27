type WsMessage = WsCommand | WsError | WsStatus

type WsCommand = {
  type: "COMMAND",
  payload: {
    deviceId: string,
    action: "turnOnOff" | "setBrightness" | "balacedBrightness",
    value: number
  }
}

type WsError = {
  type: 'ERROR',
  message: string
}

type WsStatus = {
  type: 'STATUS',
  status: {
    deviceId: string,
    isOn: boolean,
    brightnessLevel: number,
    balancedBrightness: boolean
  }
}

export type {WsMessage, WsCommand, WsStatus, WsError}