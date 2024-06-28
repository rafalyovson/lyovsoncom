import { db } from "@/data/db";
import { tagPost } from "@/data/schema/tagPost";
import { eq } from "drizzle-orm";

export async function tagPostDelete(data: {
  postId?: string;
  tagId?: string;
}): Promise<{ success: boolean; message: string }> {
  if (!data.postId && !data.tagId) {
    return { success: false, message: "Invalid data" };
  }

  try {
    if (data.postId) {
      await db.delete(tagPost).where(eq(tagPost.postId, data.postId));
    } else if (data.tagId) {
      await db.delete(tagPost).where(eq(tagPost.tagId, data.tagId));
    }

    return { success: true, message: "TagPost deleted successfully" };
  } catch (error) {
    console.error("Failed to delete tagPost:", error);
    return { success: false, message: "Failed to delete tagPost" };
  }
}
