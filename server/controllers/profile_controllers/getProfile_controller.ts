import { NextFunction, Request, Response } from "express";
import getPrismaInstance from "../../src/prismaClient";

export const getProfile_controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const profileId = req.params.profileId;
  const prisma = getPrismaInstance();
  try {
    const userData = await prisma.user.findUnique({
      where: { id: profileId },
      select: {
        about: true,
        username: true,
        name: true,
        lastName: true,
        birthDay: true,
        id: true,
        profilePicture: true,
      },
    });

    if (userData) {
      res.status(200).json({ ok: true, userData });
    }
  } catch (error) {
    next(error);
  }
};
