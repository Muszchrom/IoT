import network
import time

SSID = "WIFI SSID"
PASSWORD = "WIFI PASSWORD"
def connect_to_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)

    print("Łączenie z WiFi...")
    for _ in range(10):
        if wlan.isconnected():
            print("Połączono:", wlan.ifconfig())
            return True
        time.sleep(1)

    print("Nie udało się połączyć z WiFi.")
    return False
# wlan.ifconfig(("192.168.100.56", "255.255.255.0", "192.168.1.1", "8.8.8.8"))

