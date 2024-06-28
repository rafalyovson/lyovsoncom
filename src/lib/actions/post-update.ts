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
import { tagCreate } from "./tag-create";

export const postUpdate = async (
  tags: any[],
  content: JSON,
  prevState: any,
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
    featuredImg: formData.get("featuredImg") as string,
    authorId: user.id!,
    published: !!formData.get("published"),
    content: JSON.stringify(content),
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

  // Check if post already exists
  const [existingPost] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, data.slug));

  // Update or insert post
  if (prevState.slug === data.slug) {
    await db.update(posts).set(data).where(eq(posts.slug, data.slug));
  } else {
    await db.delete(posts).where(eq(posts.slug, prevState.slug));
    await db
      .delete(categoryPost)
      .where(eq(categoryPost.postId, prevState.slug));
    await db.insert(posts).values(data);
  }

  // Update category
  const category = formData.get("category") as string;
  if (category) {
    const [categoryRecord] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, category));
    await db
      .delete(categoryPost)
      .where(eq(categoryPost.postId, existingPost.id));
    await db
      .insert(categoryPost)
      .values({ postId: existingPost.id, categoryId: categoryRecord.id });
  }

  // Update tags

  const allTags = await db.select().from(tagCat);
  const oldPostTags = await db
    .select()
    .from(tagPost)
    .where(eq(tagPost.postId, existingPost?.id));
  for (const tag of tags) {
    const [existingTag] = allTags.filter((t) => t.slug === tag.slug);

    if (existingTag) {
      const tagId = existingTag.id;

      for (const oldTag of oldPostTags) {
        if (!tags.some((t) => t.id === oldTag.tagId)) {
          await db.delete(tagPost).where(eq(tagPost.postId, existingPost.id));
        }

        if (oldTag.tagId !== tagId) {
          await db.insert(tagPost).values({ postId: existingPost.id, tagId });
        }
      }
    } else {
      const newTagData = new FormData();
      newTagData.append("slug", tag.slug);
      newTagData.append("name", tag.name);

      await tagCreate({ message: "" }, newTagData);

      const [newTag] = await db
        .select()
        .from(tagCat)
        .where(eq(tagCat.slug, tag.slug));
      await db
        .insert(tagPost)
        .values({ postId: existingPost?.id, tagId: newTag?.id });
    }
  }

  return { message: "Post updated!", url: `/posts/${data.slug}` };
};
