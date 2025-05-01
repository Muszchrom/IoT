docker compose -f docker-compose.dev.yml up --build -d

# Microcontroller - Light Controller API
* After connection to the power and booting, the app will connect to wifi with predefined credentials, then it will connect to websocket server. If weboscket connection fails, the green LED will turn off.
* Microcontroller must receive ping requests constantly. If the time between ping request exceeds 3 seconds, the app will close current connection and try to reconnect in loop untill a connection is achieved. 
* To interract with the app you must send websocket messages with the following structure:
```JSON
{
  "action": "turnOnOff" | "setBrightness" | "balancedBrightness" | "getStatus",
  "value": number
}
```
* After receiving and handling the message, status response will be sent immediately. Structure of status message is shown below, in "getStatus" section.
## Action "getStatus"
Sends back current status of microcontroller. It is also sent back after handling each action as an action confirmation. You dont need to set "value" in your message for this handler.
```JSON
{
  "type": "status",
  "status": {
    "deviceId": string,
    "isOn": boolean,
    "brightnessLevel": number, 
    "balancedBrightness": boolean,
    "balancedBrightnessLevel": number
  }
}
```
## Action "turnOnOff"
Turns the light on or off. Supported values are 0 (off) and 1 (on), other values will throw `Invalid turnOnOff value` exception.

This action changes the following:
* isOn: true | false 
* brightnessLevel: 100 | 0
* balancedBrightness: false
## Action "setBrightness"
Sets the brightness level from 0 to 100. Values outside this range will raise `Invalid setBrightness value` exception.

This action changes the following:
* isOn: true | false 
* brightnessLevel: 100 -> 0
* balancedBrightness: false

isOn is set to true if the brightness level is greater than 0. It should work with floating point values. 
## Action "balancedBrightness"
Values greater than 0 set the desired lighting level in lux and automatically turn on this feature, which tries to keep ambient brightness at the same set level.
If provided value is less than 0, balanced brightness will be disabled and the light state will stay at the same level untill other actions are performed. It will also keep the previously set balancedBrightnessLevel value, so you could retrieve it with getStatus.

This action changes the following:
* balancedBrightness: true | false
* balancedBrightnessLevel: number > 0

