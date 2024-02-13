import { NextFunction, Request, Response } from "express";
import { renameSync } from "fs";
import getPrismaInstance from "../../src/prismaClient";
const addImgMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = getPrismaInstance();
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/images/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const { from, to } = req.query;
      if (from && to) {
        const getUser = onlineUsers.get(to);
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            type: "image",
            sender: { connect: { id: from.toString() } },
            reciever: { connect: { id: to.toString() } },
            messageStatus: getUser ? "delivered" : "sent",
          },
          include: { sender: true, reciever: true },
        });

        return res.status(201).json({ message });
      }
      return res.status(400).send("from, to are required");
    }
    return res.status(400).send("image is required");
  } catch (error) {
    return next(error);
  }
};

export default addImgMessage;
