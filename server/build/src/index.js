"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const routes_1 = require("../routes");
const prismaClient_1 = __importDefault(require("./prismaClient"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: process.env.FRONT_HOST, credentials: true }));
app.use("/uploads/images", express_1.default.static("uploads/images"));
app.use("/uploads/audio", express_1.default.static("uploads/audio"));
app.use("/api/auth", routes_1.authRouter);
app.use("/api/onboarding", routes_1.onBoardingRouter);
app.use("/api/contacts", routes_1.contactsRouter);
app.use("/api/message", routes_1.messageRouter);
app.use("/api/profile", routes_1.profileRouter);
const server = app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});
const io = new socket_io_1.Server(server, {
    cors: { origin: process.env.FRONT_HOST },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.socketGlobal = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        const getContactsOfUser = () => __awaiter(void 0, void 0, void 0, function* () {
            const prisma = (0, prismaClient_1.default)();
            const contacts = yield prisma.contact.findMany({
                where: { fromId: userId },
            });
            const contactsOnline = contacts.map((contact) => {
                if (onlineUsers.has(contact.contactId) && contact.friends) {
                    return contact.contactId;
                }
                else {
                    return null;
                }
            });
            contactsOnline.forEach((contactId) => {
                if (contactId != null) {
                    const userSocket = onlineUsers.get(contactId);
                    socket.to(userSocket).emit("user-connected", userId);
                }
            });
        });
        getContactsOfUser();
    });
    socket.on("send-message", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data);
        }
    });
    socket.on("read-message", (message) => {
        const prisma = (0, prismaClient_1.default)();
        const sendUserSocket = onlineUsers.get(message.senderId);
        const updateMessage = () => __awaiter(void 0, void 0, void 0, function* () {
            const update = yield prisma.messages.update({
                where: { id: message.id },
                data: { messageStatus: "read" },
            });
            if (update && sendUserSocket) {
                socket.to(sendUserSocket).emit("update-read-message", message);
            }
        });
        updateMessage();
    });
    socket.on("update-read-from-reciever", (message) => {
        const senderUserSocket = onlineUsers.get(message.senderId);
        if (senderUserSocket) {
            socket.to(senderUserSocket).emit("update-read-from-sender", message);
        }
    });
    socket.on("disconnect", () => {
        let userId = "";
        for (let [clave, valor] of onlineUsers) {
            if (valor === socket.id) {
                userId = clave;
                break;
            }
        }
        const getContactsOfUser = () => __awaiter(void 0, void 0, void 0, function* () {
            const prisma = (0, prismaClient_1.default)();
            const contacts = yield prisma.contact.findMany({
                where: { fromId: userId },
            });
            const contactsOnline = contacts.map((contact) => {
                if (onlineUsers.has(contact.contactId) && contact.friends) {
                    return contact.contactId;
                }
                else {
                    return null;
                }
            });
            contactsOnline.forEach((contactId) => {
                if (contactId != null) {
                    const userSocket = onlineUsers.get(contactId);
                    socket.to(userSocket).emit("user-diconected", userId);
                }
            });
        });
        getContactsOfUser();
        onlineUsers.delete(userId);
    });
});
