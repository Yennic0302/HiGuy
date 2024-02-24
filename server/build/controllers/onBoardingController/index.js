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
exports.setOnboarding = exports.checkUsername = void 0;
const prismaClient_1 = __importDefault(require("../../src/prismaClient"));
const checkUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, prismaClient_1.default)();
    try {
        const username = req.params.username;
        const user = yield prisma.user.findUnique({
            where: { username },
        });
        if (user)
            return res.status(200).json({
                ok: true,
                isThereError: true,
                statusText: "username already exits",
            });
        return res.status(200).json({
            ok: true,
            isThereError: false,
        });
    }
    catch (e) {
        return next(e);
    }
});
exports.checkUsername = checkUsername;
const setOnboarding = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = (0, prismaClient_1.default)();
    try {
        const id = req.params.id;
        const data = req.body;
        const user = yield prisma.user.findUnique({
            where: { username: data.username },
        });
        if (user)
            return res.status(200).json({
                ok: false,
                isThereError: true,
                statusText: "username already exits",
            });
        const setOnboardingData = yield prisma.user.update({ where: { id }, data });
        if (!exports.setOnboarding)
            return res.status(200).json({
                ok: false,
                isThereError: true,
                statusText: "Error setting the data",
            });
        const { password } = setOnboardingData, userData = __rest(setOnboardingData, ["password"]);
        return res.status(200).json({
            ok: true,
            isThereError: false,
            userData,
        });
    }
    catch (e) {
        return next(e);
    }
});
exports.setOnboarding = setOnboarding;
