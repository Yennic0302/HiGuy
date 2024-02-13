import { NextFunction, Request, Response } from "express";
import getPrismaInstance from "../../src/prismaClient";

const addContact = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getPrismaInstance();
  try {
    const id = req.params.id;
    const { contactId } = req.body;

    const contact = await prisma.contact.findMany({
      where: { fromId: id, contactId },
    });

    if (contact[0] == undefined) {
      const isFriend = await prisma.contact.findMany({
        where: { fromId: contactId, contactId: id },
      });

      if (isFriend[0] !== undefined) {
        await prisma.contact.update({
          where: { id: isFriend[0].id },
          data: {
            friends: true,
          },
        });
      }

      const newContact = await prisma.contact.create({
        data: {
          fromId: id,
          contactId: contactId,
          friends: isFriend[0] !== undefined ? true : false,
        },
        include: {
          contact: {
            select: {
              username: true,
              name: true,
              lastName: true,
              profilePicture: true,
              id: true,
            },
          },
        },
      });

      res.status(202).json({ ok: true, newContact });
    } else {
      res.status(404).json({ ok: false });
    }
  } catch (e) {
    return next(e);
  }
};

export default addContact;
