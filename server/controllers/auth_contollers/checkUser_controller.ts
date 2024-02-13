import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import getPrismaInstance from "../../src/prismaClient";

const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getPrismaInstance();

  try {
    const token = req.cookies["HIGUY_TOKEN"];

    if (!token) {
      return res.status(401).json({ ok: false });
    }

    let idUser: object | undefined = undefined;

    jwt.verify(
      token,
      process.env.JWT_KEY_WORD,
      (err: VerifyErrors | null, user: any) => {
        if (err) return res.status(403).json({ ok: false });
        return (idUser = user.id);
      }
    );

    const user = await prisma.user.findUnique({
      where: { id: idUser },
      include: {
        contacts: true,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ ok: false, statusError: "Error finding user in database" });
    }
    const { password, ...userData } = user;

    return res.status(200).json({
      ok: true,
      userData,
    });
  } catch (e) {
    return next(e);
  }
};

export default checkUser;
