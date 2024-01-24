import { PrismaClient } from "@prisma/client";

const globalForPrisma: any = globalThis;
export const prisma = globalForPrisma.prisma
  ? globalForPrisma.prisma
  : new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
