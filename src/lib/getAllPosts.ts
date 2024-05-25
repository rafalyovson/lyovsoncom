"use server";

import { db } from "@/data/db";
import { Post, posts } from "@/data/schema";

export async function getAllPosts(): Promise<Post[]> {
  return await db.select().from(posts);
}
