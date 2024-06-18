"use server";

import { db } from "@/data/db";
import { categories } from "@/data/schema";

export const categoryGetAll = async () => {
  const cats = await db.select().from(categories);
  return cats;
};
