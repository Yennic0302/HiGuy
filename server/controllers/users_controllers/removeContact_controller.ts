import { NextFunction, Request, Response } from "express";
import getPrismaInstance from "../../src/prismaClient";

const addContact = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getPrismaInstance();
  try {
    const id = req.params.id;
    const { contactId } = req.body;

    const contact = await prisma.contact.findUnique({
      where: { fromId: id, contactId },
    });

    if (contact) {
      const isFriend = await prisma.contact.findUnique({
        where: { fromId: contactId, contactId: id },
      });

      if (isFriend) {
        await prisma.contact.update({
          where: { id: isFriend.id },
          data: {
            friends: false,
          },
        });
      }

      await prisma.contact.delete({
        where: {
          fromId: id,
          contactId,
        },
      });

      res.status(202).json({ ok: true });
    } else {
      res.status(404).json({ ok: false });
    }
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

export default addContact;
