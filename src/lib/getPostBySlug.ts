"use server";

import { db } from "@/data/db";
import { Post, posts } from "@/data/schema";
import { eq } from "drizzle-orm";

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const allPosts: Post[] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug));

  return allPosts[0];
};
