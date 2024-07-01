import { db } from "@/data/db";
import { Post, posts } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function postSelectAll(): Promise<{
  success: boolean;
  posts: Post[] | null;
  message: string;
}> {
  try {
    const allPosts = await db.select().from(posts);
    return { success: true, posts: allPosts, message: "Success" };
  } catch (error) {
    console.error("Error selecting all posts:", error);
    return { success: false, posts: null, message: "Error" };
  }
}

export async function postSelectBySlug(data: { slug: string }): Promise<{
  success: boolean;
  post: Post | null;
  message: string;
}> {
  try {
    const [thePost] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, data.slug));
    return { success: true, post: thePost, message: "Success" };
  } catch (error) {
    console.error("Error selecting post by slug:", error);
    return { success: false, post: null, message: "Error" };
  }
}

export async function postSelectById(data: { id: string }): Promise<{
  success: boolean;
  post: Post | null;
  message: string;
}> {
  try {
    const [thePost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, data.id));
    return { success: true, post: thePost, message: "Success" };
  } catch (error) {
    console.error("Error selecting post by id:", error);
    return { success: false, post: null, message: "Error" };
  }
}
