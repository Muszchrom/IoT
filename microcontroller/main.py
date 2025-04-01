from wifi import connect_to_wifi
from light_controller import handle_message
from websocket_utils import WebsocketUtils
import network
import time

# WebSocket server details
WS_HOST = "192.168.100.55"
WS_PORT = 8080
WS_PATH = "/?token=device"

def main():
    connect_to_wifi()
    sock = WebsocketUtils(WS_HOST, WS_PORT, WS_PATH)

    while True:
        data = sock.recv(4096)
        if data:
            message = sock.decode_websocket_frame(data)
            if message:
                handle_message(message, sock.send_websocket_message)
        time.sleep(0.1)

if __name__ == "__main__":
    main()