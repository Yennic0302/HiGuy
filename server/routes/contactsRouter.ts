import express from "express";
import {
  addContact_controller,
  getContacts_controller,
  removeContact_controller,
  searchUsers_controller,
} from "../controllers/users_controllers";

const authRouter = express.Router();

authRouter.get("/get-contacts/:id", getContacts_controller);
authRouter.get("/get-users", searchUsers_controller);
authRouter.post("/add/:id", addContact_controller);
authRouter.post("/remove/:id", removeContact_controller);

export default authRouter;
