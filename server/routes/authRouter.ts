import express from "express";
import {
  checkUser_controller,
  deleteJWT_controller,
  signInGoogle_Controller,
  signIn_controller,
  signUpGoogle_controller,
  signUp_controller,
} from "../controllers/auth_contollers";
import {
  signInDto,
  signInGoogleDto,
  signUpDto,
  signUpGoogleDto,
} from "../dto/authDtos";

const authRouter = express.Router();

authRouter.post("/sign-up", signUpDto, signUp_controller);
authRouter.post("/sign-up-google", signUpGoogleDto, signUpGoogle_controller);
authRouter.post("/sign-in", signInDto, signIn_controller);
authRouter.post("/sign-in-google", signInGoogleDto, signInGoogle_Controller);
authRouter.get("/check-user", checkUser_controller);
authRouter.get("/delete-jwt", deleteJWT_controller);

export default authRouter;
