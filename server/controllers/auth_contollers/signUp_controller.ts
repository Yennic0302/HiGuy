import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import getPrismaInstance from "../../src/prismaClient";

import { DataToSignUp } from "../../types/authTypes";

const signUp = async (req: Request, res: Response) => {
  const prisma = getPrismaInstance();

  try {
    let { typeSingUp, password, name, lastName, email }: DataToSignUp =
      req.body;

    const verifyUserExitByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (verifyUserExitByEmail)
      return res.status(300).json({
        ok: false,
        statusText: "error in email",
        errors: [
          {
            instancePath: "/email",
            message: "email alredy exits",
          },
        ],
      });

    let regexName = /^[a-zA-Z\s]+$/i;
    const verifyNameUser = regexName.test(name);
    const verifyLastNameUser = regexName.test(lastName);

    if (!verifyNameUser) {
      return res.status(300).json({
        ok: false,
        statusText: "error in last name",
        errors: [
          {
            instancePath: "/name",
            message: "can't have numbers ",
          },
        ],
      });
    }

    if (!verifyLastNameUser) {
      return res.status(300).json({
        ok: false,
        statusText: "error in last name",
        errors: [
          {
            instancePath: "/lastName",
            message: "can't have numbers ",
          },
        ],
      });
    }

    const id = nanoid(10);
    const passwordHashed = await bcrypt.hash(password, 10);

    let creatingUser;

    if (!typeSingUp) {
      creatingUser = await prisma.user.create({
        data: {
          id,
          email,
          name,
          lastName,
          password: passwordHashed,
        },
      });
    }

    if (!creatingUser)
      return res.status(400).json({
        ok: false,
        statusText: "Error in server and database",
        errors: [
          {
            instancePath: "/server",
            message: "error creating user, please try again ",
          },
        ],
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
      .cookie("HIGUY_TOKEN", token, { httpOnly: true })
      .json({ ok: true, statusText: "register completed", userData });
  } catch (e: any) {
    return res.status(400).json({
      ok: false,
      statusText: "Error in server and database",
      errors: e,
    });
  }
};

export default signUp;
