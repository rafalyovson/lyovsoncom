import { db } from "@/data/db";
import { TagPost, tagPost } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function tagPostSelect(data: {
  postId: string;
}): Promise<{ success: boolean; tags: TagPost[] | null; message: string }> {
  try {
    const allTagPosts = await db
      .select()
      .from(tagPost)
      .where(eq(tagPost.postId, data.postId));
    return { success: true, tags: allTagPosts, message: "Success" };
  } catch (error) {
    console.error("Error selecting tags:", error);
    return { success: false, tags: null, message: "Error" };
  }
}
