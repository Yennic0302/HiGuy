import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import {
  authRouter,
  contactsRouter,
  messageRouter,
  onBoardingRouter,
  profileRouter,
} from "../routes";
import getPrismaInstance from "./prismaClient";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors({ origin: process.env.FRONT_HOST, credentials: true }));

app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/audio", express.static("uploads/audio"));

app.use("/api/auth", authRouter);
app.use("/api/onboarding", onBoardingRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/message", messageRouter);
app.use("/api/profile", profileRouter);

const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: { origin: process.env.FRONT_HOST },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.socketGlobal = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-message", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data);
    }
  });

  socket.on("read-message", (message) => {
    const prisma = getPrismaInstance();
    const sendUserSocket = onlineUsers.get(message.senderId);
    const updateMessage = async () => {
      const update = await prisma.messages.update({
        where: { id: message.id },
        data: { messageStatus: "read" },
      });
      if (update && sendUserSocket) {
        socket.to(sendUserSocket).emit("update-read-message", message);
      }
    };
    updateMessage();
  });

  socket.on("update-read-from-reciever", (message) => {
    const senderUserSocket = onlineUsers.get(message.senderId);
    if (senderUserSocket) {
      socket.to(senderUserSocket).emit("update-read-from-sender", message);
    }
  });

  socket.on("disconnect", () => {
    let userId;
    for (let [clave, valor] of onlineUsers) {
      if (valor === socket.id) {
        userId = clave;
        break;
      }
    }
    onlineUsers.delete(userId);
  });
});
