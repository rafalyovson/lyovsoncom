"use server";

import { NewPost, Post, postInsertSchema } from "@/data/schema";
import { capitalize, slugify } from "@/lib/utils";
import { categoryPostCreate } from "./db-actions/category-post-create";
import { categoryPostDelete } from "./db-actions/category-post-delete";
import { categorySelectBySlug } from "./db-actions/category-select";
import { postDeleteById } from "./db-actions/post-delete";
import { postInsert } from "./db-actions/post-insert";
import { postUpdate as postUpdateAction } from "./db-actions/post-update";
import { tagCreate } from "./db-actions/tag-create";
import { tagPostCreate } from "./db-actions/tag-post-create";
import { tagPostDelete } from "./db-actions/tag-post-delete";
import { tagSelectBySlug } from "./db-actions/tag-select";

export async function postUpdate(
  content: any, // Changed JSON to any for better TypeScript compatibility
  prevState: { message: string; success: boolean; post: Post },
  formData: FormData
): Promise<{ success: boolean; message: string; post: Post | null }> {
  const { post: oldPost } = prevState;

  console.log("🐤", formData);

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
    if (oldPost.slug !== data.slug) {
      await postDeleteById({ id: oldPost.id });
      const { post } = await postInsert(data);
      newPost = post;
    } else {
      const { post } = await postUpdateAction(data);
      newPost = post;
    }

    if (!newPost) {
      return { message: "Post not found", success: false, post: null };
    }

    const categoryName = formData.get("category") as string;
    if (categoryName) {
      const result = await categorySelectBySlug({
        slug: slugify(categoryName),
      });

      if (result.success && result.category) {
        await categoryPostDelete({
          postId: oldPost.id,
        });
        await categoryPostCreate({
          postId: newPost.id,
          categoryId: result.category.id,
        });
      }
    }

    await tagPostDelete({
      postId: oldPost.id,
    });

    const newPostTagStrings = formData.getAll("tags") as string[];
    newPostTagStrings.filter(Boolean).forEach(async (tag) => {
      const tagSlug = slugify(tag);
      const tagName = capitalize(tag);
      const result = await tagSelectBySlug({ slug: tagSlug });

      if (result.success && result.tag) {
        await tagPostCreate({
          postId: newPost.id,
          tagId: result.tag.id,
        });
      } else {
        const result = await tagCreate({
          name: tagName,
          slug: tagSlug,
        });

        if (result.success && result.tag) {
          await tagPostCreate({
            postId: newPost.id,
            tagId: result.tag.id,
          });
        }
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
