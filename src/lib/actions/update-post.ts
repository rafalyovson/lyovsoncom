"use server";

import { db } from "@/data/db";
import { posts } from "@/data/schema";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { eq } from "drizzle-orm";

export const updatePost = async (prevState: any, formData: FormData) => {
  console.log("formData", formData);
  const { id } = await getCurrentUser();
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: formData.get("content") as string,
    featuredImg: formData.get("featuredImg") as string,
    authorId: id,
    published: formData.get("published") ? true : false,
  };

  console.log("data", data);

  if (prevState.slug !== data.slug) {
    await db.delete(posts).where(eq(posts.slug, prevState.slug));
    await db.insert(posts).values(data);
    return { message: "Post updated!", url: `/posts/${data.slug}` };
  }

  await db.update(posts).set(data).where(eq(posts.slug, data.slug));
  return { message: "Post updated!", url: `/posts/${data.slug}` };
};
