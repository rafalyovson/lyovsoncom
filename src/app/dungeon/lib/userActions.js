"use server";

import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";

const session = await auth();

export const getId = async () => {
  const { id } = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  return id;
};

export const updateUser = async (id, formData) => {
  const user = await prisma.user.update({
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
