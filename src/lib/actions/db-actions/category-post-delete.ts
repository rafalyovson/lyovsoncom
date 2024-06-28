import { db } from "@/data/db";
import { categoryPost } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function categoryPostDelete(data: {
  postId?: string;
  categoryId?: string;
}): Promise<{ success: boolean; message: string }> {
  if (!data.postId || !data.categoryId) {
    return { success: false, message: "Invalid data" };
  }

  try {
    if (data.postId) {
      await db.delete(categoryPost).where(eq(categoryPost.postId, data.postId));
    } else if (data.categoryId) {
      await db
        .delete(categoryPost)
        .where(eq(categoryPost.categoryId, data.categoryId));
    }

    return { success: true, message: "CategoryPost deleted successfully" };
  } catch (error) {
    console.error("Failed to delete categoryPost:", error);
    return { success: false, message: "Failed to delete categoryPost" };
  }
}
