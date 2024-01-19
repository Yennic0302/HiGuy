import { NextFunction, Request, Response } from "express";
import getPrismaInstance from "../../src/prismaClient";

const getUsersByQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const search = req.query.search!.toString().toLowerCase();
  const userId = req.query.user!;

  const prisma = getPrismaInstance();

  try {
    const users = await prisma.user.findMany({
      select: {
        about: true,
        username: true,
        name: true,
        lastName: true,
        profilePicture: true,
        id: true,
        birthDay: true,
        email: true,
        isNewUser: true,
      },
    });

    const usersFiltered = users.filter((user) => {
      if (!user.username) return false;

      return (
        user.username!.toLowerCase().indexOf(search) != -1 &&
        user.isNewUser !== true &&
        userId !== user.id
      );
    });

    res.status(200).json({ ok: true, usersFiltered });
  } catch (e) {
    next(e);
  }
};

export default getUsersByQuery;
