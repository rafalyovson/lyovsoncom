"use server";

import { auth } from "@/app/lib/auth";
import { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { deleteImage } from "./imageDelete";

export const getPost = async (slug: string): Promise<Post | null> => {
  return prisma.post.findUnique({ where: { slug } });
};

export const getAllPosts = async (): Promise<Post[]> => {
  return prisma.post.findMany();
};

export const createPost = async (formData: FormData): Promise<void> => {
  const session = await auth();
  const post = await prisma.post.create({
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      featuredImg: formData.get("imageUrl") as string,
      author: {
        connect: {
          email: session?.user?.email,
        },
      },
    },
  });
  redirect(`/posts/${post.slug}`);
};

export const updatePost = async (
  id: string,
  formData: FormData
): Promise<void> => {
  const post = await prisma.post.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      featuredImg: formData.get("imageUrl") as string,
    },
  });
  redirect(`/posts/${post.slug}`);
};

export const deletePost = async (post: Post): Promise<void> => {
  if (!post) {
    revalidatePath("/dungeon");
    return;
  }
  await deleteImage(post.featuredImg || "");
  await prisma.post.delete({ where: { id: post.id } });
  revalidatePath("/dungeon");
};
