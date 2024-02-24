import { NextFunction, Request, Response } from "express";
import getPrismaInstance from "../../src/prismaClient";

import jwt from "jsonwebtoken";

const signInGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = getPrismaInstance();

  try {
    let { email }: { email: string } = req.body;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user === null) {
      return res.status(400).json({
        ok: false,
        statusText: "Account doesn't singed up in our database",
      });
    }

    if (user !== undefined) {
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.JWT_KEY_WORD
      );
      const { password: userPassword, ...userData } = user;

      return res
        .status(200)
        .cookie("HIGUY_TOKEN", token, {
          httpOnly: true,
          secure: true,
          SameSite: "None",
          Partitioned: true,
        })
        .json({ ok: true, statusText: "user loged", userData });
    }
  } catch (e) {
    return next(e);
  }
};

export default signInGoogle;
