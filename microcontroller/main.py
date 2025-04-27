from wifi import connect_to_wifi
from light_controller import handle_message
from websocket_utils import WebsocketUtils
import time

# WebSocket server details
WS_HOST = "192.168.100.55"
WS_PORT = 8080
WS_PATH = "/?token=device"
RECONNECT_TIMEOUT_SECONDS = 3

# Main function
def main():
    # Connect to Wi-Fi
    connected = connect_to_wifi()
    if not connected:
        return
    
    sock = None
    sleep_duration = 0.1
    i = -1
    
    # Receive messages
    while True:
        # if silent for some time, drop current connection and try to reconnect
        if i > RECONNECT_TIMEOUT_SECONDS/sleep_duration or i == -1:
            if i == -1:  # connecting for the first time 
                print("Connecting to websocket server...")
            else:
                sock.close()
                print("Reconnecting...")
                
            time.sleep(1)
            
            try:
                sock = WebsocketUtils(WS_HOST, WS_PORT, WS_PATH)
                i = 0
                print("Connected to WS!")
            except OSError as e:
                # 103 is for failed connection
                if e.args[0] != 103:
                    print(e)
                    break
                else:
                    continue
            # this weird handshake connection occurs sometimes
            except Exception as e:
                if str(e) == "WebSocket handshake failed":
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
                handle_message(message, sock.send_websocket_message)
        
        i += 1
        time.sleep(sleep_duration)

if __name__ == "__main__":
    main()
