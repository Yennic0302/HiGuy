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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nanoid_1 = require("nanoid");
const prismaClient_1 = __importDefault(require("../../src/prismaClient"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, prismaClient_1.default)();
    try {
        let { typeSingUp, password, name, lastName, email } = req.body;
        const verifyUserExitByEmail = yield prisma.user.findUnique({
            where: { email },
        });
        if (verifyUserExitByEmail)
            return res.status(300).json({
                ok: false,
                statusText: "error in email",
                errors: [
                    {
                        instancePath: "/email",
                        message: "email alredy exits",
                    },
                ],
            });
        let regexName = /^[a-zA-Z\s]+$/i;
        const verifyNameUser = regexName.test(name);
        const verifyLastNameUser = regexName.test(lastName);
        if (!verifyNameUser) {
            return res.status(300).json({
                ok: false,
                statusText: "error in last name",
                errors: [
                    {
                        instancePath: "/name",
                        message: "can't have numbers ",
                    },
                ],
            });
        }
        if (!verifyLastNameUser) {
            return res.status(300).json({
                ok: false,
                statusText: "error in last name",
                errors: [
                    {
                        instancePath: "/lastName",
                        message: "can't have numbers ",
                    },
                ],
            });
        }
        const id = (0, nanoid_1.nanoid)(10);
        const passwordHashed = yield bcrypt_1.default.hash(password, 10);
        let creatingUser;
        if (!typeSingUp) {
            creatingUser = yield prisma.user.create({
                data: {
                    id,
                    email,
                    name,
                    lastName,
                    password: passwordHashed,
                },
            });
        }
        if (!creatingUser)
            return res.status(400).json({
                ok: false,
                statusText: "Error in server and database",
                errors: [
                    {
                        instancePath: "/server",
                        message: "error creating user, please try again ",
                    },
                ],
            });
        const { password: userPassword } = creatingUser, userData = __rest(creatingUser, ["password"]);
        const token = jsonwebtoken_1.default.sign({
            id: userData.id,
        }, process.env.JWT_KEY_WORD);
        return res
            .status(200)
            .cookie("HIGUY_TOKEN", token, { httpOnly: true })
            .json({ ok: true, statusText: "register completed", userData });
    }
    catch (e) {
        return res.status(400).json({
            ok: false,
            statusText: "Error in server and database",
            errors: e,
        });
    }
});
exports.default = signUp;
