import { Socket } from "socket.io";

declare global {
  var socketGlobal: Socket;
  var onlineUsers: Map;
}
