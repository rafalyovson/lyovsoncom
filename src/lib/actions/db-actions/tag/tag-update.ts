import { db } from "@/data/db";
import { NewTag, Tag, tagInsertSchema, tags } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function tagUpdate(
  data: NewTag
): Promise<{ success: boolean; message: string; tag: Tag | null }> {
  const parsedData = tagInsertSchema.safeParse(data);

  if (!parsedData.success) {
    console.log("Validation error", parsedData.error.issues);
    return {
      success: parsedData.success,
      message: "Validation error",
      tag: null,
    };
  }

  try {
    await db.update(tags).set(data).where(eq(tags.slug, data.slug));
    const [newTag] = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, data.slug));
    return {
      success: parsedData.success,
      message: "Tag updated successfully",
      tag: newTag,
    };
  } catch (error) {
    console.error("Failed to update tag:", error);
    return {
      success: false,
      message: "Failed to update tag",
      tag: null,
    };
  }
}
