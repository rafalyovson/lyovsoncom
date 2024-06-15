"use server";

import { auth } from "@/data/auth";
import { db } from "@/data/db";
import { posts } from "@/data/schema";
import { eq } from "drizzle-orm";

export const updatePost = async (
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

  if (prevState.slug !== data.slug) {
    await db.delete(posts).where(eq(posts.slug, prevState.slug));
    await db.insert(posts).values(data);

    return { message: "Post updated!", url: `/posts/${data.slug}` };
  }

  await db.update(posts).set(data).where(eq(posts.slug, data.slug));

  return { message: "Post updated!", url: `/posts/${data.slug}` };
};
