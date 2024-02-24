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
const fs_1 = require("fs");
const prismaClient_1 = __importDefault(require("../../src/prismaClient"));
const addImgMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, prismaClient_1.default)();
    try {
        if (req.file) {
            const date = Date.now();
            let fileName = "uploads/images/" + date + req.file.originalname;
            (0, fs_1.renameSync)(req.file.path, fileName);
            const { from, to } = req.query;
            if (from && to) {
                const getUser = onlineUsers.get(to);
                const message = yield prisma.messages.create({
                    data: {
                        message: fileName,
                        type: "image",
                        sender: { connect: { id: from.toString() } },
                        reciever: { connect: { id: to.toString() } },
                        messageStatus: getUser ? "delivered" : "sent",
                    },
                    include: { sender: true, reciever: true },
                });
                return res.status(201).json({ message });
            }
            return res.status(400).send("from, to are required");
        }
        return res.status(400).send("image is required");
    }
    catch (error) {
        return next(error);
    }
});
exports.default = addImgMessage;
