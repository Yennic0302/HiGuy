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

    if (contact[0] !== undefined) {
      const isFriend = await prisma.contact.findMany({
        where: { fromId: contactId, contactId: id },
      });

      if (isFriend[0] !== undefined) {
        await prisma.contact.update({
          where: { id: isFriend[0].id },
          data: {
            friends: false,
          },
        });
      }

      await prisma.contact.delete({
        where: {
          id: contact[0].id,
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
