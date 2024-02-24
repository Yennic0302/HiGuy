"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const message_controller_1 = require("../controllers/message_controller");
const messageRouter = express_1.default.Router();
const uploadImage = (0, multer_1.default)({ dest: "uploads/images/" });
const uploadAudio = (0, multer_1.default)({ dest: "uploads/audio/" });
messageRouter.post("/create", message_controller_1.createMessage_controller);
messageRouter.get("/get/:from/:to", message_controller_1.getMessages_controller);
messageRouter.post("/add/img-message", uploadImage.single("image"), message_controller_1.addImgMessage_controller);
messageRouter.post("/add/audio-message", uploadAudio.single("audio"), message_controller_1.addAudioMessage_controller);
messageRouter.get("/contacts-with-message/:from", message_controller_1.getInitialContactWithMessages_controller);
exports.default = messageRouter;
