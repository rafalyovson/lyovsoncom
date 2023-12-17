"use server";

import { auth } from "@/app/lib/auth";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./db";

export const createPost = async (formData, id) => {
  const session = await auth();
  await prisma.post.create({
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
  redirect("/");
};

export const deletePost = async (post) => {
  if (!post) {
    revalidatePath("/");
    return;
  }
  del(post.featuredImg);
  await prisma.post.delete({
    where: {
      id: post.id,
    },
  });
  revalidatePath("/");
};
