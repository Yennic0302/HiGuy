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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("../../src/prismaClient"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signInGoogle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, prismaClient_1.default)();
    try {
        let { email } = req.body;
        let user = yield prisma.user.findUnique({
            where: { email },
        });
        if (user === null) {
            return res.status(400).json({
                ok: false,
                statusText: "Account doesn't singed up in our database",
            });
        }
        if (user !== undefined) {
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
            }, process.env.JWT_KEY_WORD);
            const { password: userPassword } = user, userData = __rest(user, ["password"]);
            return res
                .status(200)
                .cookie("HIGUY_TOKEN", token, { httpOnly: true })
                .json({ ok: true, statusText: "user loged", userData });
        }
    }
    catch (e) {
        return next(e);
    }
});
exports.default = signInGoogle;
