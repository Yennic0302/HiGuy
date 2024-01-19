import { NextFunction, Request, Response } from "express";
import getPrismaInstance from "../../src/prismaClient";

const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getPrismaInstance();
  const id = req.params.id;

  try {
    const contacts = await prisma.contact.findMany({
      where: { fromId: id },
      include: {
        contact: {
          select: {
            about: true,
            username: true,
            name: true,
            lastName: true,
            profilePicture: true,
            id: true,
            birthDay: true,
            email: true,
          },
        },
      },
    });

    //just with an array of id from users
    // const allContacts = await prisma.user.findMany({
    //   where: { id: { in: contacts } },
    //   select: {
    //     id: true,
    //     username: true,
    //     name: true,
    //     lastName: true,
    //     profilePicture: true,
    //     about: true,
    //   },
    // });
    const usersGroupedBYInitialLetter: Dictionary = {};

    if (contacts.length > 0) {
      contacts.forEach((cont) => {
        if (cont.contact.username !== null) {
          const initialLetter: string = cont.contact.username
            .charAt(0)
            .toUpperCase();
          if (!usersGroupedBYInitialLetter[initialLetter]) {
            usersGroupedBYInitialLetter[initialLetter] = [];
          }
          usersGroupedBYInitialLetter[initialLetter].push(cont);
        }
      });
    }

    res.status(200).json({
      ok: true,
      statusText: "your contacts are loaded",
      usersOrdered: usersGroupedBYInitialLetter,
      users: contacts,
    });
  } catch (e) {
    return next(e);
  }
};

export default getContacts;
