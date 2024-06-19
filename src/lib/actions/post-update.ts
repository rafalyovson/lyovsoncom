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
import { tagCreate } from "./tag-create";

export const postUpdate = async (
  tags: any,
  content: JSON,
  prevState: any,
  formData: FormData
) => {
  const session = await auth();
  if (!session || !session.user) {
    return { message: "Not authenticated", url: "" };
  }
  const user = session.user;

  const allTags = await db.select().from(tagCat);

  const allTagPost = await db.select().from(tagPost);
  console.log("👯‍♀️", allTagPost);

  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    featuredImg: formData.get("featuredImg") as string,
    authorId: user.id!,
    published: formData.get("published") ? true : false,
    content: content as JSON,
    type: formData.get("type") as string,
  };

  const category = formData.get("category");

  if (prevState.slug !== data.slug) {
    await db.delete(posts).where(eq(posts.slug, prevState.slug));
    await db
      .delete(categoryPost)
      .where(eq(categoryPost.postId, prevState.slug));

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

    tags.forEach(async (tag: any) => {
      if (allTags.filter((t) => t.slug === tag.slug).length > 0) {
        const tagId = allTags.filter((t) => t.slug === tag.slug)[0].id;
        await db
          .insert(tagPost)
          .values({ postId: newPost[0].id, tagId: tagId! });
      } else {
        await db.insert(tags).values({ slug: tag.slug, name: tag.name });
        const newTag = await db
          .select()
          .from(tags)
          .where(eq(tags.slug, tag.slug));
        await db
          .insert(tagPost)
          .values({ postId: newPost[0].id, tagId: newTag[0].id });
      }
    });

    return { message: "Post updated!", url: `/posts/${data.slug}` };
  }

  await db.update(posts).set(data).where(eq(posts.slug, data.slug));

  const newPost = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, data.slug));

  const allCats = await db
    .select()
    .from(categories)
    .where(eq(categories.name, category));

  await db.delete(categoryPost).where(eq(categoryPost.postId, newPost[0].id));

  await db
    .insert(categoryPost)
    .values({ postId: newPost[0].id, categoryId: allCats[0].id });

  tags.forEach(async (tag: any) => {
    //check if tag already exists in db
    if (allTags.filter((t) => t.slug === tag.slug).length > 0) {
      const tagId = allTags.filter((t) => t.slug === tag.slug)[0].id;

      // check if tag is already in post
      const oldIds = await db
        .select()
        .from(tagPost)
        .where(eq(tagPost.postId, newPost[0].id));

      oldIds.forEach(async (oldId: any) => {
        if (oldId.tagId !== tagId) {
          console.log(newPost[0].id, tagId, "🎄");
          await db
            .insert(tagPost)
            .values({ postId: newPost[0].id, tagId: tagId! });
        }
      });
    } else {
      const data = new FormData();
      data.append("slug", tag.slug);
      data.append("name", tag.name);

      await tagCreate({ message: "" }, data);

      const newTag = await db
        .select()
        .from(tagCat)
        .where(eq(tagCat.slug, tag.slug));

      await db
        .insert(tagPost)
        .values({ postId: newPost[0]?.id, tagId: newTag[0]?.id });
    }
  });

  return { message: "Post updated!", url: `/posts/${data.slug}` };
};
