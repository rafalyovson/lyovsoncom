"use server";

import { auth } from "@/app/lib/auth";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";

export const deleteImage = async (url) => {
  del(url);
};

export const createPost = async (formData, id) => {
  const session = await auth();
  const post = await prisma.post.create({
    data: {
      title: formData.get("title"),
      slug: formData.get("slug"),
      content: formData.get("content"),
      featuredImg: formData.get("imageUrl"),
      author: {
        connect: {
          email: session.user.email,
        },
      },
    },
  });
  redirect(`/posts/${post.slug}`);
};

export const updatePost = async (id, formData) => {
  const post = await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      title: formData.get("title"),
      slug: formData.get("slug"),
      content: formData.get("content"),
      featuredImg: formData.get("imageUrl"),
    },
  });
  redirect(`/posts/${post.slug}`);
};

export const deletePost = async (post) => {
  if (!post) {
    revalidatePath("/dungeon");
    return;
  }
  deleteImage(post.featuredImg);
  await prisma.post.delete({
    where: {
      id: post.id,
    },
  });
  revalidatePath("/dungeon");
};

export const getPost = async (slug) => {
  try {
    return await prisma.post.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    return await prisma.post.findMany();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
