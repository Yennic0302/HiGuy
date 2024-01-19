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
exports.getProfile_controller = void 0;
const prismaClient_1 = __importDefault(require("../../src/prismaClient"));
const getProfile_controller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const profileId = req.params.profileId;
    const prisma = (0, prismaClient_1.default)();
    try {
        const userData = yield prisma.user.findUnique({
            where: { id: profileId },
            select: {
                about: true,
                username: true,
                name: true,
                lastName: true,
                birthDay: true,
                id: true,
                profilePicture: true,
            },
        });
        if (userData) {
            res.status(200).json({ ok: true, userData });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getProfile_controller = getProfile_controller;
