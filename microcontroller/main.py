from wifi import connect_to_wifi
from light_controller import LightController
from websocket_utils import WebsocketUtils
import time

# WebSocket server details
WS_HOST = "192.168.100.55"
WS_PORT = 8080
WS_PATH = "/?token=device"
RECONNECT_TIMEOUT_SECONDS = 3

# This function connects pico with ws server
# This function will reconnect if conditions are met
# i == -1 - connecting for the first time
def connect_reconnect_ws(i, i_threshold, s, lc):
    if i > i_threshold or i == -1:
        lc.set_ws_indicator(False)
        if i == -1:  # connecting for the first time 
            print("Connecting to websocket server...")
        else:
            s.close()
            print("Reconnecting...")
  
        time.sleep(1)  
        try:
            sock = WebsocketUtils(WS_HOST, WS_PORT, WS_PATH)
            lc.set_ws_indicator(True)
            i = 0
            return [1, sock]
        
        except OSError as e:
            # 103 is for failed connection
            if e.args[0] != 103:
                print(e)
                return [-1, sock]
            else:
                return [0, sock]
        # this weird handshake connection occurs sometimes
        except Exception as e:
            if str(e) == "WebSocket handshake failed":
                return [0, sock]
    return [1, s]

def main():
    lc = LightController()
    # Connect to Wi-Fi
    connected = connect_to_wifi()
    if not connected:
        return
    
    sock = None
    sleep_duration = 0.1
    i = -1
    
    # Receive messages
    while True:
        lc.balanced_brightness_brightness_balancing()
        # if silent for some time, drop current connection and try to reconnect
        status, sock = connect_reconnect_ws(i, RECONNECT_TIMEOUT_SECONDS/sleep_duration, sock, lc)
        if status == -1:
            break
        if status == 0:
            continue
        
        # if any message shows up (message/ping etc)
        data = sock.recv(4096)
        if data:
            i = 0 # reset "timer"
            # check if received ping
            if data[0] & 0x0F == 9:
                sock.send_pong()
                continue
            
            message = sock.decode_websocket_frame(data)
            if message:
                lc.handle_message(message, sock.send_websocket_message)
                #handle_message(message, sock.send_websocket_message)
        
        i += 1
        time.sleep(sleep_duration)

if __name__ == "__main__":
    main()
