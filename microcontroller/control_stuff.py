from machine import Pin
from machine import PWM
from time import sleep
import ujson

# duty range 0 - 65536
led = PWM(12, freq=1000)

def handle_message(message):
    try:
        data = ujson.loads(message)
        print("Parsed JSON:", data)
        
        if "brightness" in data:
            if data["brightness"] == 100:
                led.duty_u16(65536)
                print("on")
            elif data["brightness"] == 0:
                led.duty_u16(0)
                print("off")
            elif data["brightness"] > 100 or data["brightness"] < 0:
                print("Invalid command")
            else:
                v = int(65536*(data["brightness"]*0.01))
                led.duty_u16(v)
        else:
            print("No brightness in JSON data")
    except ValueError as e:
        print("Failed to parse JSON:", e)
