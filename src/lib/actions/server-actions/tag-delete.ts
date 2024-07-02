"use server";

import { db } from "@/data/db";
import { tags } from "@/data/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const tagDelete = async (data: string): Promise<void> => {
  await db.delete(tags).where(eq(tags.id, data));
  revalidatePath("/dungeon/categories");
};
