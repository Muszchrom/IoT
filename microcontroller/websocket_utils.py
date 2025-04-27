import urandom
import usocket
import ubinascii

class WebsocketUtils(usocket.socket):
    def __init__(self, ws_host, ws_port, ws_path):
        super().__init__(usocket.AF_INET, usocket.SOCK_STREAM)
        
        self.ws_host = ws_host
        self.ws_port = ws_port
        self.ws_path = ws_path
        self.connect()
    
    def connect(self):
        super().connect(usocket.getaddrinfo(self.ws_host, self.ws_port)[0][-1])
        self.__websocket_handshake()  # Perform WebSocket handshake
    
    # Function to generate WebSocket key
    def __generate_websocket_key(self):
        random_bytes = urandom.getrandbits(16).to_bytes(16, 'big')
        return ubinascii.b2a_base64(random_bytes)[:-1].decode()


    # Function to perform WebSocket handshake
    def __websocket_handshake(self):
        key = self.__generate_websocket_key()
        handshake = (
            f"GET {self.ws_path} HTTP/1.1\r\n"
            f"Host: {self.ws_host}:{self.ws_port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n"
            "\r\n"
        )
        self.send(handshake.encode())
        response = self.recv(4096)
        if b"101 Switching Protocols" not in response:
            raise Exception("WebSocket handshake failed")
        
    # Function to decode WebSocket frames
    def decode_websocket_frame(self, data):
        if len(data) < 2:
            return None
        fin = (data[0] & 0x80) != 0  # check if first byte of frame (fin) is indicating last frame
        opcode = data[0] & 0x0F  #  check opcode at bytes from 4 to 7  
        masked = (data[1] & 0x80) != 0  # 9th byte to check if content is masked
        payload_len = data[1] & 0x7F # check payload length starting from byte 9 or scond in this case since we're checking second octet

        if payload_len == 126:  # for 16 bit payloads
            payload_len = int.from_bytes(data[2:4], 'big')
            offset = 4
        elif payload_len == 127:  # for 64 bit payloads
            payload_len = int.from_bytes(data[2:10], 'big')
            offset = 10
        else:
            offset = 2

        if masked:  # decode if masked
            mask = data[offset:offset+4]
            offset += 4
            payload = data[offset:offset+payload_len]
            decoded = bytearray(payload)
            for i in range(len(decoded)):
                decoded[i] ^= mask[i % 4]
            return decoded.decode()
        else:
            return data[offset:offset+payload_len].decode()
    
    def send_websocket_message(self, message):
        encoded_msg = message.encode('utf-8')
        msg_len = len(encoded_msg)
        frame = bytearray()
        frame.append(0x81)  # FIN + opcode for text frame

        if msg_len <= 125:
            frame.append(0x80 | msg_len)  # Masked + length
        elif msg_len < 65536:
            frame.append(0x80 | 126)
            frame.extend(msg_len.to_bytes(2, 'big'))
        else:
            frame.append(0x80 | 127)
            frame.extend(msg_len.to_bytes(8, 'big'))

        mask = urandom.getrandbits(32).to_bytes(4, 'big')
        frame.extend(mask)

        masked_data = bytearray(msg_len)
        for i in range(msg_len):
            masked_data[i] = encoded_msg[i] ^ mask[i % 4]
        frame.extend(masked_data)
        
        self.send(frame)
    
    # reply to websocket ping 
    def send_pong(self):
        frame = bytearray()
        frame.append(0x8A)  # fin + pong opcode
        frame.append(0x80 | 0)  # mask + payload length 0 => 10000000 | 00000000 = 10000000
        mask = urandom.getrandbits(32).to_bytes(4, 'big')
        frame.extend(mask)
        self.send(frame)

