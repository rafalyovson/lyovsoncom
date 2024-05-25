"use server";

import { db } from "@/data/db";
import { Post, posts } from "@/data/schema";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteImage } from "./imageDelete";
import { uploadImage } from "./imageUpload";

export const createPost = async (formData: FormData): Promise<void> => {
  const currentUser = await getCurrentUser();
  const { url } = await uploadImage(formData);
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: formData.get("content") as string,
    featuredImg: url,
    authorId: currentUser.id,
  };
  const newPost = await db.insert(posts).values(data);
  console.log("post", newPost);

  redirect(`/posts/${data.slug}`);
};

export const updatePost = async (
  id: string,
  formData: FormData
): Promise<void> => {
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: formData.get("content") as string,
    featuredImg: formData.get("imageUrl") as string,
  };

  const updatedPost = await db.update(posts).set(data).where(eq(posts.id, id));
  console.log("post", updatedPost);
  redirect(`/posts/${data.slug}`);
};

export const deletePost = async (post: Post): Promise<void> => {
  if (!post) {
    revalidatePath("/dungeon");
    return;
  }
  await deleteImage(post.featuredImg || "");
  await db.delete(posts).where(eq(posts.id, post.id));
  revalidatePath("/dungeon");
};
