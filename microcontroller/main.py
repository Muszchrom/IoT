from wifi import connect_to_wifi
from control_stuff import handle_message
from websocket_utils import WebsocketUtils
import network
import time

# WebSocket server details
WS_HOST = "192.168.100.55"
WS_PORT = 8080
WS_PATH = "/"

# Main function
def main():
    # Connect to Wi-Fi
    connect_to_wifi()
    sock = WebsocketUtils(WS_HOST, WS_PORT, WS_PATH)
    # Receive messages
    while True:
        data = sock.recv(4096)
        if data:
            message = sock.decode_websocket_frame(data)
            if message:
                print("Received message:", message)
                handle_message(message)
        time.sleep(0.1)

if __name__ == "__main__":
    main()
