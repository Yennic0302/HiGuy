import { NextFunction, Request, Response } from "express";
import getPrismaInstance from "../../src/prismaClient";
const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = getPrismaInstance();
  try {
    const { message, from, to } = req.body;
    const getUser = onlineUsers.get(to);
    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message,
          sender: { connect: { id: from } },
          reciever: { connect: { id: to } },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: { sender: true, reciever: true },
      });

      return res.status(201).send({ ok: true, message: newMessage });
    }
    return res.status(200).send({
      ok: false,
      statusError:
        "error creating message because to, from and message are missing",
    });
  } catch (error) {
    return next(error);
  }
};

export default createMessage;
