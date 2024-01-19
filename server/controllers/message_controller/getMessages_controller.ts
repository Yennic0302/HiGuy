import { NextFunction, Request, Response } from "express";
import getPrismaInstance from "../../src/prismaClient";
const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getPrismaInstance();
  try {
    const { from, to } = req.params;

    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          { senderId: { contains: from }, recieverId: { contains: to } },
          { senderId: { contains: to }, recieverId: { contains: from } },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });

    const unreadMessages: number[] = [];

    messages.forEach((message, index) => {
      if (message.messageStatus !== "read" && message.senderId == to) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });

    await prisma.messages.updateMany({
      where: {
        id: { in: unreadMessages },
      },
      data: {
        messageStatus: "read",
      },
    });

    res.status(200).json({ ok: true, messages });
  } catch (error) {
    return next(error);
  }
};

export default getMessages;
