"use server";

import { auth } from "@/data/auth";
import { db } from "@/data/db";
import { categories, categoryPost, posts } from "@/data/schema";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const postCreate = async (
  content: JSON,
  _prevState: any,
  formData: FormData
) => {
  console.log(formData);

  const session = await auth();
  if (!session || !session.user) {
    return { message: "Not authenticated", url: "" };
  }
  const user = session.user;

  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: JSON.stringify(content),
    featuredImg: formData.get("featuredImg") as string,
    authorId: user.id!,
    published: formData.get("published") ? true : false,
    type: formData.get("type") as string,
  };

  const schema = createInsertSchema(posts, {
    title: z.string().min(1, { message: "Title is required" }),
    slug: z.string().min(1, { message: "Slug is required" }),
    content: z.string().min(1, { message: "Content is required" }),
    featuredImg: z.string().url().min(1, { message: "Image is required" }),
    authorId: z.string().uuid().optional(),
    published: z.boolean().default(false),
    type: z
      .enum(["article", "review", "embed", "podcast", "video"])
      .default("article"),
  });

  const parsedData = schema.safeParse(data);

  const category = formData.get("category");

  if (parsedData.success) {
    await db.insert(posts).values(data);

    const newPost = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, data.slug));

    const allCats = await db
      .select()
      .from(categories)
      .where(eq(categories.name, category));

    await db
      .insert(categoryPost)
      .values({ postId: newPost[0].id, categoryId: allCats[0].id });

    return { message: "Post created!", url: `/posts/${data.slug}` };
  } else {
    console.log("error", parsedData.error.issues);
    return { message: "", url: "" };
  }
};
