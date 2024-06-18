"use server";

import { auth } from "@/data/auth";
import { db } from "@/data/db";
import { categories, categoryPost, posts } from "@/data/schema";
import { eq } from "drizzle-orm";

export const postUpdate = async (
  content: JSON,
  prevState: any,
  formData: FormData
) => {
  const session = await auth();
  if (!session || !session.user) {
    return { message: "Not authenticated", url: "" };
  }
  const user = session.user;

  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    featuredImg: formData.get("featuredImg") as string,
    authorId: user.id!,
    published: formData.get("published") ? true : false,
    content: content as JSON,
    type: formData.get("type") as string,
  };

  const category = formData.get("category");
  console.log("🍆", category);

  if (prevState.slug !== data.slug) {
    await db.delete(posts).where(eq(posts.slug, prevState.slug));
    await db
      .delete(categoryPost)
      .where(eq(categoryPost.postId, prevState.slug));

    await db.insert(posts).values(data);

    const newPost = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, data.slug));

    const allCats = await db
      .select()
      .from(categories)
      .where(eq(categories.name, category));

    await db
      .insert(categoryPost)
      .values({ postId: newPost[0].id, categoryId: allCats[0].id });

    return { message: "Post updated!", url: `/posts/${data.slug}` };
  }

  await db.update(posts).set(data).where(eq(posts.slug, data.slug));

  const newPost = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, data.slug));

  const allCats = await db
    .select()
    .from(categories)
    .where(eq(categories.name, category));

  await db.delete(categoryPost).where(eq(categoryPost.postId, newPost[0].id));

  await db
    .insert(categoryPost)
    .values({ postId: newPost[0].id, categoryId: allCats[0].id });

  return { message: "Post updated!", url: `/posts/${data.slug}` };
};
