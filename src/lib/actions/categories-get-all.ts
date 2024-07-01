"use server";

import {db} from "@/data/db";
import {categories} from "@/data/schema/category";

export const categoriesGetAll = async () => {
  return await db.select().from(categories);
};
