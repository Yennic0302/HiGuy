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
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, prismaClient_1.default)();
    try {
        const { from, to } = req.params;
        const messages = yield prisma.messages.findMany({
            where: {
                OR: [
                    { senderId: { contains: from }, recieverId: { contains: to } },
                    { senderId: { contains: to }, recieverId: { contains: from } },
                ],
            },
            orderBy: {
                id: "asc",
            },
        });
        const unreadMessages = [];
        messages.forEach((message, index) => {
            if (message.messageStatus !== "read" && message.senderId == to) {
                messages[index].messageStatus = "read";
                unreadMessages.push(message.id);
            }
        });
        yield prisma.messages.updateMany({
            where: {
                id: { in: unreadMessages },
            },
            data: {
                messageStatus: "read",
            },
        });
        res.status(200).json({ ok: true, messages });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = getMessages;
