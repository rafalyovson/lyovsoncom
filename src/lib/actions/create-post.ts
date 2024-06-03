"use server";

import { db } from "@/data/db";
import { posts } from "@/data/schema";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { revalidatePath } from "next/cache";

export const createPost = async (_prevState: any, formData: FormData) => {
  console.log("formData", formData);
  const { id } = await getCurrentUser();
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: formData.get("content") as string,
    featuredImg: formData.get("featuredImg") as string,
    authorId: id,
    published: formData.get("published") ? true : false,
  };
  console.log("data", data);
  await db.insert(posts).values(data);
  revalidatePath("/posts");
  revalidatePath("/dungeon");
  return { message: "Post created!", url: `/posts/${data.slug}` };
  // const currentUser = await getCurrentUser();
  // const { url } = await uploadImage(formData);
  // const data = {
  //   title: formData.get("title") as string,
  //   slug: formData.get("slug") as string,
  //   content: formData.get("content") as string,
  //   featuredImg: url,
  //   authorId: currentUser.id,
  // };
  // const newPost = await db.insert(posts).values(data);
  // console.log("post", newPost);

  // redirect(`/posts/${data.slug}`);
};
