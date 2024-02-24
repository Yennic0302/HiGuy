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
const createMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, prismaClient_1.default)();
    try {
        const { message, from, to } = req.body;
        const getUser = onlineUsers.get(to);
        if (message && from && to) {
            const newMessage = yield prisma.messages.create({
                data: {
                    message,
                    sender: { connect: { id: from } },
                    reciever: { connect: { id: to } },
                    messageStatus: getUser ? "delivered" : "sent",
                },
                include: { sender: true, reciever: true },
            });
            return res.status(201).send({ ok: true, message: newMessage });
        }
        return res.status(200).send({
            ok: false,
            statusError: "error creating message because to, from and message are missing",
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = createMessage;
