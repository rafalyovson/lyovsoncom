"use server";

import { db } from "@/data/db";
import { categories } from "@/data/schema/category";

export const categoriesGetAll = async () => {
  const cats = await db.select().from(categories);
  return cats;
};
