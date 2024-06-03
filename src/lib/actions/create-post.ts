"use server";

import { auth } from "@/data/auth";
import { db } from "@/data/db";
import { posts } from "@/data/schema";
import { revalidatePath } from "next/cache";

export const createPost = async (_prevState: any, formData: FormData) => {
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

  await db.insert(posts).values(data);
  revalidatePath("/posts");
  revalidatePath("/dungeon");
  return { message: "Post created!", url: `/posts/${data.slug}` };
};
