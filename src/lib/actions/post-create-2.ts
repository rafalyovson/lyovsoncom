"use server";

import { db } from "@/data/db";
import {
  categories,
  categoryPost,
  NewPost,
  posts,
  tagPost,
  tags as tagsType,
} from "@/data/schema";
import { capitalize, slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { redirect } from "next/navigation";
import { z } from "zod";

export const postCreate = async (
  content: any, // Changed JSON to any for better TypeScript compatibility
  _prevState: any,
  formData: FormData
) => {
  const data: NewPost = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    featuredImageId: formData.get("featuredImageId") as string,
    published: formData.get("published") === "on" ? true : false,
    content: JSON.stringify(content),
    type: formData.get("type") as string,
    authorId: formData.get("authorId") as string,
    createdAt: new Date(formData.get("createdAt") as string),
  };

  const schema = createInsertSchema(posts, {
    title: z.string().min(1, { message: "Title is required" }),
    slug: z.string().min(1, { message: "Slug is required" }),
    content: z.string().min(1, { message: "Content is required" }),
    featuredImageId: z.string().min(1, { message: "Image is required" }),
    authorId: z.string().uuid(),
    published: z.boolean().default(false),
    createdAt: z.date(),
    type: z
      .enum(["article", "review", "embed", "podcast", "video"])
      .default("article"),
  });

  const parsedData = schema.safeParse(data);

  if (!parsedData.success) {
    console.log("Validation error", parsedData.error.issues);
    return { message: "Validation error", success: false };
  }

  try {
    await db.insert(posts).values(data);

    const [newPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, data.slug));

    const category = formData.get("category") as string;
    if (category) {
      const [categoryRecord] = await db
        .select()
        .from(categories)
        .where(eq(categories.name, category));
      if (categoryRecord) {
        await db
          .insert(categoryPost)
          .values({ postId: newPost.id, categoryId: categoryRecord.id });
      }
    }

    const tags = formData.getAll("tags") as string[];
    for (const tag of tags) {
      if (tag === "") continue;
      const [existingTag] = await db
        .select()
        .from(tagsType)
        .where(eq(tagsType.slug, slugify(tag)));

      let tagId;
      if (existingTag) {
        tagId = existingTag.id;
      } else {
        const newTagData = {
          slug: slugify(tag),
          name: capitalize(tag),
        };
        await db.insert(tagsType).values(newTagData);
        const [newTag] = await db
          .select()
          .from(tagsType)
          .where(eq(tagsType.slug, slugify(tag)));
        tagId = newTag.id;
        console.log("newTag", newTag);
      }
      await db.insert(tagPost).values({ postId: newPost.id, tagId });
    }
    redirect("/dungeon/posts");
    return { message: "Post created successfully", success: true };
  } catch (error) {
    console.error("Failed to insert post:", error);
    return { message: "Failed to insert post", success: false };
  }
};
