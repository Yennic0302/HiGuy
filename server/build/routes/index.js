"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = exports.onBoardingRouter = exports.messageRouter = exports.contactsRouter = exports.authRouter = void 0;
var authRouter_1 = require("./authRouter");
Object.defineProperty(exports, "authRouter", { enumerable: true, get: function () { return __importDefault(authRouter_1).default; } });
var contactsRouter_1 = require("./contactsRouter");
Object.defineProperty(exports, "contactsRouter", { enumerable: true, get: function () { return __importDefault(contactsRouter_1).default; } });
var messageRouter_1 = require("./messageRouter");
Object.defineProperty(exports, "messageRouter", { enumerable: true, get: function () { return __importDefault(messageRouter_1).default; } });
var onBoardingRouter_1 = require("./onBoardingRouter");
Object.defineProperty(exports, "onBoardingRouter", { enumerable: true, get: function () { return __importDefault(onBoardingRouter_1).default; } });
var profileRouter_1 = require("./profileRouter");
Object.defineProperty(exports, "profileRouter", { enumerable: true, get: function () { return __importDefault(profileRouter_1).default; } });
