"use server";

import { NewPost, Post, postInsertSchema } from "@/data/schema";
import { slugify } from "@/lib/utils";
import { categoryPostCreate } from "./db-actions/category-post-create";
import { categoryPostDelete } from "./db-actions/category-post-delete";
import { categorySelectBySlug } from "./db-actions/category-select";
import { postDeleteById } from "./db-actions/post-delete";
import { postInsert } from "./db-actions/post-insert";
import { postUpdate } from "./db-actions/post-update";
import { tagPostCreate } from "./db-actions/tag-post-create";
import { tagSelectAll, tagSelectBySlug } from "./db-actions/tag-select";

export async function postUpdate2(
  content: any, // Changed JSON to any for better TypeScript compatibility
  prevState: { message: string; success: boolean; post: Post },
  formData: FormData
): Promise<{ success: boolean; message: string; post: Post | null }> {
  const data: NewPost = {
    title: formData.get("title") as string,
    slug: slugify(formData.get("title") as string),
    featuredImageId: formData.get("featuredImageId") as string,
    published: formData.get("published") === "on" ? true : false,
    content: JSON.stringify(content),
    type: formData.get("type") as string,
    authorId: formData.get("authorId") as string,
    createdAt: new Date(formData.get("createdAt") as string),
  };

  const parsedData = postInsertSchema.safeParse(data);

  if (!parsedData.success) {
    console.log("Validation error", parsedData.error.issues);
    return { message: "Validation error", success: false, post: null };
  }

  try {
    let newPost;
    if (prevState.post.slug === data.slug) {
      const { post } = await postUpdate(data);
      newPost = post;
    } else {
      await postDeleteById(prevState.post.id);
      const { post } = await postInsert(data);
      newPost = post;
    }

    if (!newPost) {
      return { message: "Post not found", success: false, post: null };
    }

    const categorySlug = formData.get("category") as string;
    if (categorySlug) {
      const result = await categorySelectBySlug(categorySlug);
      if (result.success && result.category) {
        await categoryPostDelete({
          postId: prevState.post.id,
        });
        await categoryPostCreate({
          postId: newPost.id,
          categoryId: result.category.id,
        });
      }
    }

    const newTags = formData.getAll("tags") as string[];
    const allTags = await tagSelectAll();
    console.log("allTags", allTags);

    newTags
      .filter((tag) => tag !== "")
      .forEach(async (tag) => {
        const result = await tagSelectBySlug(slugify(tag));
        if (result.success && result.tag) {
          await tagPostCreate({
            postId: newPost.id,
            tagId: result.tag.id,
          });
        }
      });
    return {
      message: "Post updated successfully",
      success: true,
      post: newPost,
    };
  } catch (error) {
    console.error("Failed to insert post:", error);
    return {
      message: "Failed to insert post",
      success: false,
      post: null,
    };
  }
}
