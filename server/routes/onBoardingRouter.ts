import express from "express";
import {
  checkUsername,
  setOnboarding,
} from "../controllers/onBoardingController";

const onboardingRouter = express.Router();

onboardingRouter.get("/check-username/:username", checkUsername);
onboardingRouter.post("/set-onboarding/:id", setOnboarding);

export default onboardingRouter;
