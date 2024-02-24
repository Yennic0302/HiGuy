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
const prismaClient_1 = __importDefault(require("../../src/prismaClient"));
const getInitialContactWithMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, prismaClient_1.default)();
    try {
        const userId = req.params.from;
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: {
                sentMessages: {
                    include: {
                        reciever: true,
                        sender: true,
                    },
                    orderBy: {
                        createAt: "desc",
                    },
                },
                recievedMessages: {
                    include: {
                        reciever: true,
                        sender: true,
                    },
                    orderBy: {
                        createAt: "desc",
                    },
                },
            },
        });
        if (user) {
            const messages = [...user === null || user === void 0 ? void 0 : user.sentMessages, ...user === null || user === void 0 ? void 0 : user.recievedMessages];
            messages.sort((a, b) => b.createAt.getTime() - a.createAt.getTime());
            const users = new Map();
            const messageStatusChange = [];
            messages.forEach((msg) => {
                const isSender = msg.senderId === userId;
                const calculatedId = isSender ? msg.recieverId : msg.senderId;
                if (msg.messageStatus == "sent" && msg.senderId !== userId) {
                    messageStatusChange.push(msg.id);
                }
                if (!users.get(calculatedId)) {
                    const { id, type, message, messageStatus, createAt, senderId, recieverId, } = msg;
                    let user = {
                        messageId: id,
                        type,
                        message,
                        messageStatus,
                        createAt,
                        senderId,
                        recieverId,
                        totalUnreadMessages: 0,
                    };
                    if (isSender) {
                        user = Object.assign(Object.assign(Object.assign({}, msg.reciever), user), { totalUnreadMessages: 0 });
                    }
                    else {
                        user = Object.assign(Object.assign(Object.assign({}, msg.sender), user), { totalUnreadMessages: msg.messageStatus !== "read" ? 1 : 0 });
                    }
                    users.set(calculatedId, Object.assign({}, user));
                }
                else if (msg.messageStatus !== "read" && !isSender) {
                    const user = users.get(calculatedId);
                    users.set(calculatedId, Object.assign(Object.assign({}, user), { totalUnreadMessages: user.totalUnreadMessages + 1 }));
                }
            });
            if (messageStatusChange.length > 0) {
                yield prisma.messages.updateMany({
                    where: {
                        id: { in: messageStatusChange },
                    },
                    data: {
                        messageStatus: "delivered",
                    },
                });
                const messagesUpdated = yield prisma.messages.findMany({
                    where: {
                        id: { in: messageStatusChange },
                    },
                });
                messagesUpdated.forEach((msg) => {
                    const sender = onlineUsers.get(msg.senderId);
                    if (sender) {
                        socketGlobal.to(sender).emit("messages-delivered", msg.recieverId);
                    }
                });
            }
            const friendsOnline = yield prisma.contact.findMany({
                where: {
                    fromId: userId,
                    friends: true,
                    contactId: {
                        in: Array.from(onlineUsers.keys()),
                    },
                },
                select: {
                    contactId: true,
                },
            });
            const friendsOnlineArray = friendsOnline.map((friend) => friend.contactId);
            return res.status(200).json({
                ok: true,
                users: Array.from(users.values()),
                onlineUsers: friendsOnlineArray,
            });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.default = getInitialContactWithMessages;
