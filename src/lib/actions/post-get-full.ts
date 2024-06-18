import { db } from "@/data/db";
import { categories, categoryPost, posts, users } from "@/data/schema";
import { eq } from "drizzle-orm";

export const postGetFull = async ({ postId }: { postId: string }) => {
  const result = await db
    .select()
    .from(categoryPost)
    .leftJoin(posts, eq(categoryPost.postId, posts.id))
    .leftJoin(categories, eq(categoryPost.categoryId, categories.id))
    .where(eq(categoryPost.postId, postId))
    .leftJoin(users, eq(posts.authorId, users.id));

  return result[0];
};

export const getPostBySlug2 = async (slug: string) => {
  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(categoryPost, eq(posts.id, categoryPost.postId))
    .leftJoin(categories, eq(categoryPost.categoryId, categories.id));

  return allPosts[0];
};
