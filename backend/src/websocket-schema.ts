type WsMessage = WsCommand | WsError | WsStatus

type WsCommand = {
  type: "COMMAND",
  payload: {
    deviceId: string,
    action: "turnOnOff" | "setBrightness" | "balacedBrightness",
    value: number // 0 and 1 can represent true/false and validate
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

export {WsMessage, WsError, WsCommand, WsStatus}
/** EXAMPLES

const turnOn = {
  type: "COMMAND",
  payload: {
    deviceId: "lightBulb",
    action: "turnOnOff",
    value: 0 // 0 - turn off, 1 - turn on
  }
}
const setBrightness = {
  type: "COMMAND",
  payload: {
    deviceId: "lightBulb",
    action: "setBrightness",
    value: 80 // 0 - 100%
  }
}
const setBalanceBrightness = {
  type: "COMMAND",
  payload: {
    deviceId: "lightBulb",
    action: "balacedBrightness",
    value: 0 // 0 turn off this feature
  }
}
const timer = { // post 

}


const isOnStatus = {
  type: "STATUS",
  status: {
    isOn: false,
    brightnessLevel: 80,
    balancedBrightness: false
  }
}

*/
