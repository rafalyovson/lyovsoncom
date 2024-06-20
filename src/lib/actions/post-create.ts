"use server";

import { auth } from "@/data/auth";
import { db } from "@/data/db";
import {
  categories,
  categoryPost,
  posts,
  tags as tagCat,
  tagPost,
} from "@/data/schema";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const postCreate = async (
  tags: any[],
  content: JSON,
  _prevState: any,
  formData: FormData
) => {
  // Authenticate user
  const session = await auth();
  if (!session || !session.user) {
    return { message: "Not authenticated", url: "" };
  }
  const user = session.user;

  // Prepare post data
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: JSON.stringify(content),
    featuredImg: formData.get("featuredImg") as string,
    authorId: user.id!,
    published: !!formData.get("published"),
    type: formData.get("type") as string,
  };

  // Validate data using Zod schema
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
  if (!parsedData.success) {
    console.log("Validation error", parsedData.error.issues);
    return { message: "Validation error", url: "" };
  }

  // Insert new post
  await db.insert(posts).values(data);
  const [newPost] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, data.slug));

  // Update category
  const category = formData.get("category") as string;
  if (category) {
    const [categoryRecord] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, category));
    await db
      .insert(categoryPost)
      .values({ postId: newPost.id, categoryId: categoryRecord.id });
  }

  // Fetch all existing tags
  const allTags = await db.select().from(tagCat);

  // Update tags
  for (const tag of tags) {
    const [existingTag] = allTags.filter((t) => t.slug === tag.slug);
    if (existingTag) {
      await db
        .insert(tagPost)
        .values({ postId: newPost.id, tagId: existingTag.id });
    } else {
      await db.insert(tagCat).values({ slug: tag.slug, name: tag.name });
      const [newTag] = await db
        .select()
        .from(tagCat)
        .where(eq(tagCat.slug, tag.slug));
      await db.insert(tagPost).values({ postId: newPost.id, tagId: newTag.id });
    }
  }

  return { message: "Post created!", url: `/posts/${data.slug}` };
};
