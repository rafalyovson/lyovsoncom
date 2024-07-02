import { db } from "@/data/db";
import { Tag, tags } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function tagSelectAll(): Promise<{
  success: boolean;
  tags: Tag[] | null;
  message: string;
}> {
  try {
    const allTags = await db.select().from(tags);
    return { success: true, tags: allTags, message: "Success" };
  } catch (error) {
    console.error("Error selecting all tags:", error);
    return { success: false, tags: null, message: "Error" };
  }
}

export async function tagSelectById(data: { id: string }): Promise<{
  success: boolean;
  tag: Tag | null;
  message: string;
}> {
  try {
    const [theTag] = await db.select().from(tags).where(eq(tags.id, data.id));
    return { success: true, tag: theTag, message: "Success" };
  } catch (error) {
    console.error("Error selecting tag by id:", error);
    return { success: false, tag: null, message: "Error" };
  }
}

export async function tagSelectBySlug(data: { slug: string }): Promise<{
  success: boolean;
  tag: Tag | null;
  message: string;
}> {
  try {
    const [theTag] = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, data.slug));
    return { success: true, tag: theTag, message: "Success" };
  } catch (error) {
    console.error("Error selecting tag by slug:", error);
    return { success: false, tag: null, message: "Error" };
  }
}
