import express from "express";
import multer from "multer";
import {
  addAudioMessage_controller,
  addImgMessage_controller,
  createMessage_controller,
  getInitialContactWithMessages_controller,
  getMessages_controller,
} from "../controllers/message_controller";

const messageRouter = express.Router();
const uploadImage = multer({ dest: "uploads/images/" });
const uploadAudio = multer({ dest: "uploads/audio/" });

messageRouter.post("/create", createMessage_controller);
messageRouter.get("/get/:from/:to", getMessages_controller);
messageRouter.post(
  "/add/img-message",
  uploadImage.single("image"),
  addImgMessage_controller
);
messageRouter.post(
  "/add/audio-message",
  uploadAudio.single("audio"),
  addAudioMessage_controller
);
messageRouter.get(
  "/contacts-with-message/:from",
  getInitialContactWithMessages_controller
);
export default messageRouter;
