"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const onBoardingController_1 = require("../controllers/onBoardingController");
const onboardingRouter = express_1.default.Router();
onboardingRouter.get("/check-username/:username", onBoardingController_1.checkUsername);
onboardingRouter.post("/set-onboarding/:id", onBoardingController_1.setOnboarding);
exports.default = onboardingRouter;
