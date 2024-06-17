"use server";

import { db } from "@/data/db";
import { categories } from "@/data/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const categoryDelete = async (data: string): Promise<void> => {
  await db.delete(categories).where(eq(categories.id, data));
  revalidatePath("/dungeon/categories");
};
