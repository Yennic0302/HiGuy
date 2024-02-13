import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import getPrismaInstance from "../../src/prismaClient";

import { DataToSignIn } from "../../types/authTypes";

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma = getPrismaInstance();

    let { typeToSignIn, usernameOrEmail, password }: DataToSignIn = req.body;

    let user;

    if (typeToSignIn === "email")
      user = await prisma.user.findUnique({
        where: { email: usernameOrEmail.trim() },
        include: {
          contacts: true,
        },
      });
    if (typeToSignIn === "username")
      user = await prisma.user.findUnique({
        where: { username: usernameOrEmail.trim() },
        include: {
          contacts: true,
        },
      });

    if (user === null) {
      return res.status(400).json({
        ok: false,
        statusText: "username/email doesn't exits",
        errors: [
          {
            instancePath: "/usernameOrEmail",
            message: "it doesn't exits in our database",
          },
        ],
      });
    }

    if (user?.typeSingUp == "google") {
      return res.status(400).json({
        ok: false,
        statusText: "email signed up with google",
        errors: [
          {
            instancePath: "/google",
            message: "Account signed up with google",
          },
        ],
      });
    }

    if (user !== undefined) {
      let validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword)
        return res.status(300).json({
          ok: false,
          statusText: " password is invalid",
          errors: [
            {
              instancePath: "/password",
              message: "password is invalid",
            },
          ],
        });

      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.JWT_KEY_WORD
      );

      const { password: userPassword, ...userData } = user;

      return res
        .status(202)
        .cookie("HIGUY_TOKEN", token, {
          httpOnly: true,
        })
        .json({ ok: true, statusText: "user logged", userData });
    }
  } catch (e) {
    return next(e);
  }
};

export default signIn;
