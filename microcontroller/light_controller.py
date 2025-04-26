from machine import Pin
from machine import PWM
from time import sleep
import ujson

# duty range 0 - 65536
led = PWM(12, freq=1000)

device_status = {
    "type": "status",
    "status": {
        "deviceId": "device",
        "isOn": False,
        "brightnessLevel": 60,
        "balancedBrightness": False
    }
}

def turn_on_off(value):
    if value == 0:
      led.duty_u16(0)
      device_status["status"]["isOn"] = False
      device_status["status"]["brightnessLevel"] = 0
      return
    elif value == 1:
      led.duty_u16(65536)
      device_status["status"]["isOn"] = True
      device_status["status"]["brightnessLevel"] = 100
      return
    else:
      raise Exception("Invalid turnOnOff value")


def set_brightness(value):
    if value <= 100 and value >= 0:
      v = int(65536*(value*0.01))
      device_status["status"]["isOn"] = bool(v)
      device_status["status"]["brightnessLevel"] = value
      # print(f"Status {device_status}")
      led.duty_u16(v)
    else:
      raise Exception("Invalid setBrightness value") 


# Requires light sensor
def balanced_brightness(value):
    raise Exception("Action unsupported")


actions = {
    "turnOnOff": turn_on_off,
    "setBrightness": set_brightness,
    "balancedBrightness": balanced_brightness
}


def handle_message(message, send_message):
    try:
        data = ujson.loads(message)
        # print("Parsed JSON:", data)
        data["action"]
        if data["action"] == "getStatus":
            send_message(ujson.dumps(device_status))
            return
        
        actions[data["action"]](data["value"])
        send_message(ujson.dumps(device_status))
        
    except ValueError as e:
        print("Failed to parse JSON:", e)

