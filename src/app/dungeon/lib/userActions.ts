"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "../../lib/prisma";

const session = await auth();

export const getId = async () => {
  const { id } = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });
  return id;
};
