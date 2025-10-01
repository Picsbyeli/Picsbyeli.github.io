import { io } from "socket.io-client";

const socket = io("http://165.227.124.255:3000"); // DigitalOcean droplet IP

export default socket;