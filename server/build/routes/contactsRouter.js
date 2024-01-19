"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controllers_1 = require("../controllers/users_controllers");
const authRouter = express_1.default.Router();
authRouter.get("/get-contacts/:id", users_controllers_1.getContacts_controller);
authRouter.get("/get-users", users_controllers_1.searchUsers_controller);
authRouter.post("/add/:id", users_controllers_1.addContact_controller);
authRouter.post("/remove/:id", users_controllers_1.removeContact_controller);
exports.default = authRouter;
