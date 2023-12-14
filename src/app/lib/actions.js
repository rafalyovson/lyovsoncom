"use server";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
export const newPost = async (formData, id) => {
  const session = await auth();
  const post = await prisma.post.create({
    data: {
      title: formData.get("title"),
      content: formData.get("content"),
      featuredImg: formData.get("featuredImage"),
      author: {
        connect: {
          email: session.user.email,
        },
      },
    },
  });
  redirect("/");
};
