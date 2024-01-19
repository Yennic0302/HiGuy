import { PrismaClient } from "@prisma/client";

let prisma: null | PrismaClient = null;

function getPrismaInstance() {
  if (!prisma) {
    prisma = new PrismaClient();
  }

  return prisma;
}

export default getPrismaInstance;
