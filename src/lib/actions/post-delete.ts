"use server";

import { db } from "@/data/db";
import { Post, posts } from "@/data/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { imageDelete } from "./image-delete";

export const postDelete = async (post: Post): Promise<void> => {
  if (!post) {
    revalidatePath("/dungeon");
    return;
  }
  await imageDelete(post.featuredImg || "");
  await db.delete(posts).where(eq(posts.id, post.id));
  revalidatePath("/dungeon");
};
