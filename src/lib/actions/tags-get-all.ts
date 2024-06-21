import { db } from "@/data/db";
import { tags } from "@/data/schema";

export const tagsGetAll = async () => {
  const cats = await db.select().from(tags);
  return cats;
};
