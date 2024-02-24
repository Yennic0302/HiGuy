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
const getUsersByQuery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search.toString().toLowerCase();
    const userId = req.query.user;
    const prisma = (0, prismaClient_1.default)();
    try {
        const users = yield prisma.user.findMany({
            select: {
                about: true,
                username: true,
                name: true,
                lastName: true,
                profilePicture: true,
                id: true,
                birthDay: true,
                email: true,
                isNewUser: true,
            },
        });
        const usersFiltered = users.filter((user) => {
            if (!user.username)
                return false;
            return (user.username.toLowerCase().indexOf(search) != -1 &&
                user.isNewUser !== true &&
                userId !== user.id);
        });
        res.status(200).json({ ok: true, usersFiltered });
    }
    catch (e) {
        next(e);
    }
});
exports.default = getUsersByQuery;
