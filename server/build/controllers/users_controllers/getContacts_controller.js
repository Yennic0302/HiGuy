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
const getContacts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, prismaClient_1.default)();
    const id = req.params.id;
    try {
        const contacts = yield prisma.contact.findMany({
            where: { fromId: id },
            include: {
                contact: {
                    select: {
                        about: true,
                        username: true,
                        name: true,
                        lastName: true,
                        profilePicture: true,
                        id: true,
                        birthDay: true,
                        email: true,
                    },
                },
            },
        });
        //just with an array of id from users
        // const allContacts = await prisma.user.findMany({
        //   where: { id: { in: contacts } },
        //   select: {
        //     id: true,
        //     username: true,
        //     name: true,
        //     lastName: true,
        //     profilePicture: true,
        //     about: true,
        //   },
        // });
        const usersGroupedBYInitialLetter = {};
        if (contacts.length > 0) {
            contacts.forEach((cont) => {
                if (cont.contact.username !== null) {
                    const initialLetter = cont.contact.username
                        .charAt(0)
                        .toUpperCase();
                    if (!usersGroupedBYInitialLetter[initialLetter]) {
                        usersGroupedBYInitialLetter[initialLetter] = [];
                    }
                    usersGroupedBYInitialLetter[initialLetter].push(cont);
                }
            });
        }
        res.status(200).json({
            ok: true,
            statusText: "your contacts are loaded",
            usersOrdered: usersGroupedBYInitialLetter,
            users: contacts,
        });
    }
    catch (e) {
        return next(e);
    }
});
exports.default = getContacts;
