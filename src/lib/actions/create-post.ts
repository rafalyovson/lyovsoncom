"use server";

import { auth } from "@/data/auth";
import { db } from "@/data/db";
import { posts } from "@/data/schema";

export const createPost = async (
  content: JSON,
  _prevState: any,
  formData: FormData
) => {
  console.log("_prevState", _prevState);
  console.log("content", content);
  console.log("formData", formData);

  const session = await auth();
  if (!session || !session.user) {
    return { message: "Not authenticated", url: "" };
  }
  const user = session.user;

  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: content as JSON,
    featuredImg: formData.get("featuredImg") as string,
    authorId: user.id!,
    published: formData.get("published") ? true : false,
    type: formData.get("type") as string,
  };

  console.log("data", data);

  await db.insert(posts).values(data);

  return { message: "Post created!", url: `/posts/${data.slug}` };
};
