"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getProfile_controller_1 = require("../controllers/profile_controllers/getProfile_controller");
const profileRouter = express_1.default.Router();
profileRouter.get("/get/:profileId", getProfile_controller_1.getProfile_controller);
exports.default = profileRouter;
