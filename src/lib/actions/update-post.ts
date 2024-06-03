"use server";

import { auth } from "@/data/auth";
import { db } from "@/data/db";
import { posts } from "@/data/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updatePost = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) {
    return { message: "Not authenticated", url: "" };
  }
  const user = session.user;

  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: formData.get("content") as string,
    featuredImg: formData.get("featuredImg") as string,
    authorId: user.id!,
    published: formData.get("published") ? true : false,
  };

  console.log("data", data);

  if (prevState.slug !== data.slug) {
    await db.delete(posts).where(eq(posts.slug, prevState.slug));
    await db.insert(posts).values(data);
    revalidatePath("/posts/${data.slug}");
    revalidatePath("/dungeon/posts/${data.slug}");
    return { message: "Post updated!", url: `/posts/${data.slug}` };
  }

  await db.update(posts).set(data).where(eq(posts.slug, data.slug));
  revalidatePath(`/posts/${data.slug}`);
  revalidatePath(`/dungeon/posts/${data.slug}`);
  return { message: "Post updated!", url: `/posts/${data.slug}` };
};
