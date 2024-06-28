import { db } from "@/data/db";
import { NewPost, Post, postInsertSchema, posts } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function postUpdate(
  data: NewPost
): Promise<{ success: boolean; message: string; post: Post | null }> {
  const parsedData = postInsertSchema.safeParse(data);

  if (!parsedData.success) {
    console.log("Validation error", parsedData.error.issues);
    return {
      success: parsedData.success,
      message: "Validation error",
      post: null,
    };
  }

  try {
    await db.update(posts).set(data).where(eq(posts.slug, data.slug));
    const [newPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, data.slug));
    return {
      success: parsedData.success,
      message: "Post updated successfully",
      post: newPost,
    };
  } catch (error) {
    console.error("Failed to update post:", error);
    return {
      success: false,
      message: "Failed to update post",
      post: null,
    };
  }
}
