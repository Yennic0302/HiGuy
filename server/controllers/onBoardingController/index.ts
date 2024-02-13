import { NextFunction, Request, Response } from "express";
import getPrismaInstance from "../../src/prismaClient";

export const checkUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = getPrismaInstance();

  try {
    const username = req.params.username;
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user)
      return res.status(200).json({
        ok: true,
        isThereError: true,
        statusText: "username already exits",
      });

    return res.status(200).json({
      ok: true,
      isThereError: false,
    });
  } catch (e) {
    return next(e);
  }
};

export const setOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = getPrismaInstance();

  try {
    const id = req.params.id;
    const data = req.body;
    const user = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (user)
      return res.status(200).json({
        ok: false,
        isThereError: true,
        statusText: "username already exits",
      });

    const setOnboardingData = await prisma.user.update({ where: { id }, data });

    if (!setOnboarding)
      return res.status(200).json({
        ok: false,
        isThereError: true,
        statusText: "Error setting the data",
      });

    const { password, ...userData } = setOnboardingData;

    return res.status(200).json({
      ok: true,
      isThereError: false,
      userData,
    });
  } catch (e) {
    return next(e);
  }
};
