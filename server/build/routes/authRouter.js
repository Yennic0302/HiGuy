"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_contollers_1 = require("../controllers/auth_contollers");
const authDtos_1 = require("../dto/authDtos");
const authRouter = express_1.default.Router();
authRouter.post("/sign-up", authDtos_1.signUpDto, auth_contollers_1.signUp_controller);
authRouter.post("/sign-up-google", authDtos_1.signUpGoogleDto, auth_contollers_1.signUpGoogle_controller);
authRouter.post("/sign-in", authDtos_1.signInDto, auth_contollers_1.signIn_controller);
authRouter.post("/sign-in-google", authDtos_1.signInGoogleDto, auth_contollers_1.signInGoogle_Controller);
authRouter.get("/check-user", auth_contollers_1.checkUser_controller);
authRouter.get("/delete-jwt", auth_contollers_1.deleteJWT_controller);
exports.default = authRouter;
