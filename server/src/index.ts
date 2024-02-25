import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import { Server } from "socket.io";
import {
  authRouter,
  contactsRouter,
  messageRouter,
  onBoardingRouter,
  profileRouter,
} from "../routes";
import getPrismaInstance from "./prismaClient";

if (!fs.existsSync("./updoads/images") && !fs.existsSync("./uploads/audio")) {
  fs.mkdirSync("./uploads/images");
  fs.mkdirSync("./uploads/audio");
}

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());
app.use(cors({ origin: process.env.FRONT_HOST, credentials: true }));

app.use("/uploads/images", express.static("./uploads/images"));
app.use("/uploads/audio", express.static("./uploads/audio"));

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
    const getContactsOfUser = async () => {
      const prisma = getPrismaInstance();
      const contacts = await prisma.contact.findMany({
        where: { fromId: userId },
      });
      const contactsOnline = contacts.map((contact) => {
        if (onlineUsers.has(contact.contactId) && contact.friends) {
          return contact.contactId;
        } else {
          return null;
        }
      });
      contactsOnline.forEach((contactId) => {
        if (contactId != null) {
          const userSocket = onlineUsers.get(contactId);
          socket.to(userSocket).emit("user-connected", userId);
        }
      });
    };
    getContactsOfUser();
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
    let userId: string = "";

    for (let [clave, valor] of onlineUsers) {
      if (valor === socket.id) {
        userId = clave;
        break;
      }
    }

    const getContactsOfUser = async () => {
      const prisma = getPrismaInstance();
      const contacts = await prisma.contact.findMany({
        where: { fromId: userId },
      });
      const contactsOnline = contacts.map((contact) => {
        if (onlineUsers.has(contact.contactId) && contact.friends) {
          return contact.contactId;
        } else {
          return null;
        }
      });
      contactsOnline.forEach((contactId) => {
        if (contactId != null) {
          const userSocket = onlineUsers.get(contactId);
          socket.to(userSocket).emit("user-diconected", userId);
        }
      });
    };
    getContactsOfUser();
    onlineUsers.delete(userId);
  });
});
