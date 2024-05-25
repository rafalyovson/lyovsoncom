"use server";

import { db } from "@/data/db";
import { User, users } from "@/data/schema";
import { eq } from "drizzle-orm";

export const getUserById = async (authorId: string): Promise<User> => {
  const authors = await db.select().from(users).where(eq(users.id, authorId));
  return authors[0];
};
