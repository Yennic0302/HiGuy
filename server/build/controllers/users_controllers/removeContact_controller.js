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
const addContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, prismaClient_1.default)();
    try {
        const id = req.params.id;
        const { contactId } = req.body;
        const contact = yield prisma.contact.findMany({
            where: { fromId: id, contactId },
        });
        if (contact[0] !== undefined) {
            const isFriend = yield prisma.contact.findMany({
                where: { fromId: contactId, contactId: id },
            });
            if (isFriend[0] !== undefined) {
                yield prisma.contact.update({
                    where: { id: isFriend[0].id },
                    data: {
                        friends: false,
                    },
                });
            }
            yield prisma.contact.delete({
                where: {
                    id: contact[0].id,
                },
            });
            res.status(202).json({ ok: true });
        }
        else {
            res.status(404).json({ ok: false });
        }
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});
exports.default = addContact;
