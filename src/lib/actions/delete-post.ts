"use server";

import { db } from "@/data/db";
import { Post, posts } from "@/data/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { deleteImage } from "./delete-image";

export const deletePost = async (post: Post): Promise<void> => {
  if (!post) {
    revalidatePath("/dungeon");
    return;
  }
  await deleteImage(post.featuredImg || "");
  await db.delete(posts).where(eq(posts.id, post.id));
  revalidatePath("/dungeon");
};
