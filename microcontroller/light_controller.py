from machine import Pin, PWM, SoftI2C
import ujson
from bh1750 import BH1750

class LightController:
    def __init__(self):
        self.led = PWM(12, freq=1000) # duty range 0 - 65536
        self.ws_indicator = Pin(13, Pin.OUT, value=0)
        i2c = SoftI2C(scl=Pin(1), sda=Pin(0), freq=400000)
        self.light_sensor = BH1750(bus=i2c, addr=0x23)

        self.device_id = "device"
        self.is_on = False
        self.brightness_level = 60
        self.balanced_brightness = True
        self.balanced_brightness_level = 300
    
    def get_status(self, *args):
        device_status = {
            "type": "status",
            "status": {
                "deviceId": self.device_id,
                "isOn": self.is_on,
                "brightnessLevel": self.brightness_level,
                "balancedBrightness": self.balanced_brightness,
                "balancedBrightnessLevel": self.balanced_brightness_level
            }
        }
        return device_status
    
    def set_ws_indicator(self, value):
        if value:
            self.ws_indicator.on()
        else:
            self.ws_indicator.off()
    
    
    def turn_on_off(self, value):
        if value == 0:
            self.led.duty_u16(0)
            self.is_on = False
            self.brightness_level = 0
            self.balanced_brightness = False
        elif value == 1:
            self.led.duty_u16(65536)
            self.is_on = True
            self.brightness_level = 100
            self.balanced_brightness = False
        else:
            raise Exception("Invalid turnOnOff value")
    
    def set_brightness(self, value):
        if value <= 100 and value >= 0:
            v = int(65536*(value*0.01))
            self.is_on = bool(v)
            self.brightness_level = value
            self.balanced_brightness = False
            self.led.duty_u16(v)
        else:
            raise Exception("Invalid setBrightness value")
    
    # -1 to disable
    def set_balanced_brightness(self, value):
        if value <= 0:
            self.balanced_brightness = False
        else:
            self.balanced_brightness = True
            self.balanced_brightness_level = value
    
    def balanced_brightness_brightness_balancing(self):
        if self.balanced_brightness == False:
            return
        
        duty_atomic = int(655.36)  # 65536*0.01
    
        lux = self.light_sensor.luminance(BH1750.CONT_HIRES_1)
        print("Lux {:.2f} {}".format(lux, self.balanced_brightness_level))
        
        increase_duty_by = (self.balanced_brightness_level - lux)/50 * duty_atomic
        current_duty = 655.36*self.brightness_level
        if current_duty + increase_duty_by > 65536:  # prevent overflowing this number
            current_duty = 65536
        elif current_duty + increase_duty_by < 0:
            current_duty = 0
        else:
            current_duty = int(current_duty + increase_duty_by)
    
        self.brightness_level = current_duty/655.36
        self.led.duty_u16(current_duty)
        
    
    def handle_message(self, message, send_message):
        actions = {
            "turnOnOff": self.turn_on_off,
            "setBrightness": self.set_brightness,
            "balancedBrightness": self.set_balanced_brightness,
            "getStatus": None  # self.get_status
        }
        
        try:
            data = ujson.loads(message)
            #if data["action"] == "getStatus":
            #    send_message(ujson.dumps(self.get_status()))
            #    return
            actions[data["action"]](data["value"])
            send_message(ujson.dumps(self.get_status()))
        except ValueError as e:
            print("Failed to parse JSON:", e)

