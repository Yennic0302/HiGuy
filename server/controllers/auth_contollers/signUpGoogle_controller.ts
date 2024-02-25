import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import getPrismaInstance from "../../src/prismaClient";

import { DataToSignUp } from "../../types/authTypes";

const signUpGoogle = async (req: Request, res: Response) => {
  const prisma = getPrismaInstance();

  try {
    let { typeSingUp, name, lastName, email, profilePicture }: DataToSignUp =
      req.body;

    const verifyUserExitByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (verifyUserExitByEmail)
      return res.status(300).json({
        ok: false,
        error: "error in email",
        statusText: "email already exits",
      });

    const id = nanoid(10);

    let creatingUser;

    if (typeSingUp == "google") {
      creatingUser = await prisma.user.create({
        data: {
          id,
          typeSingUp,
          email,
          name,
          lastName,
          profilePicture,
          password: "null",
        },
      });
    }

    if (!creatingUser)
      return res.status(400).json({
        ok: false,
        error: "Error in server and database",
        statusText: "error creating user, please try again ",
      });

    const { password: userPassword, ...userData } = creatingUser;

    const token = jwt.sign(
      {
        id: userData.id,
      },
      process.env.JWT_KEY_WORD
    );

    return res
      .status(200)
      .cookie("HIGUY_TOKEN", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({ ok: true, statusText: "register completed", userData });
  } catch (e: any) {
    console.log(e);
    return res.status(400).json({
      ok: false,
      statusText: "Error in server and database",
      errors: e,
    });
  }
};

export default signUpGoogle;
