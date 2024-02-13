import express from "express";
import { getProfile_controller } from "../controllers/profile_controllers/getProfile_controller";

const profileRouter = express.Router();

profileRouter.get("/get/:profileId", getProfile_controller);

export default profileRouter;
