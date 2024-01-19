import { NextFunction, Request, Response } from "express";
import getPrismaInstance from "../../src/prismaClient";
const getInitialContactWithMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = getPrismaInstance();
  try {
    const userId = req.params.from;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentMessages: {
          include: {
            reciever: true,
            sender: true,
          },
          orderBy: {
            createAt: "desc",
          },
        },
        recievedMessages: {
          include: {
            reciever: true,
            sender: true,
          },
          orderBy: {
            createAt: "desc",
          },
        },
      },
    });

    if (user) {
      const messages = [...user?.sentMessages, ...user?.recievedMessages];
      messages.sort((a, b) => b.createAt.getTime() - a.createAt.getTime());
      const users = new Map();
      const messageStatusChange: any = [];

      messages.forEach((msg) => {
        const isSender = msg.senderId === userId;
        const calculatedId = isSender ? msg.recieverId : msg.senderId;
        if (msg.messageStatus == "sent" && msg.senderId !== userId) {
          messageStatusChange.push(msg.id);
        }
        if (!users.get(calculatedId)) {
          const {
            id,
            type,
            message,
            messageStatus,
            createAt,
            senderId,
            recieverId,
          } = msg;

          let user = {
            messageId: id,
            type,
            message,
            messageStatus,
            createAt,
            senderId,
            recieverId,
            totalUnreadMessages: 0,
          };

          if (isSender) {
            user = {
              ...user,
              ...msg.reciever,
              totalUnreadMessages: 0,
            };
          } else {
            user = {
              ...user,
              ...msg.sender,
              totalUnreadMessages: msg.messageStatus !== "read" ? 1 : 0,
            };
          }

          users.set(calculatedId, { ...user });
        } else if (msg.messageStatus !== "read" && !isSender) {
          const user = users.get(calculatedId);
          users.set(calculatedId, {
            ...user,
            totalUnreadMessages: user.totalUnreadMessages + 1,
          });
        }
      });

      if (messageStatusChange.length > 0) {
        console.log("ejecutando");
        await prisma.messages.updateMany({
          where: {
            id: { in: messageStatusChange },
          },
          data: {
            messageStatus: "delivered",
          },
        });

        const messagesUpdated = await prisma.messages.findMany({
          where: {
            id: { in: messageStatusChange },
          },
        });

        messagesUpdated.forEach((msg) => {
          const sender = onlineUsers.get(msg.senderId);
          if (sender) {
            socketGlobal.to(sender).emit("messages-delivered", msg.recieverId);
          }
        });
      }

      return res.status(200).json({
        ok: true,
        users: Array.from(users.values()),
        onlineUsers: Array.from(onlineUsers.keys()),
      });
    }
  } catch (error) {
    return next(error);
  }
};

export default getInitialContactWithMessages;
