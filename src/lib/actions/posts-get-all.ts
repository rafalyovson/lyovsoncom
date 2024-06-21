import { db } from "@/data/db";
import {
  categories,
  categoryPost,
  posts,
  tagPost,
  tags,
  users,
} from "@/data/schema";
import { Post } from "@/data/types";
import { eq } from "drizzle-orm";

export const postsGetAll = async () => {
  const results = await db
    .select({
      post: posts,
      author: users,
      category: categories,
      tag: tags,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(categoryPost, eq(posts.id, categoryPost.postId))
    .leftJoin(categories, eq(categoryPost.categoryId, categories.id))
    .leftJoin(tagPost, eq(posts.id, tagPost.postId))
    .leftJoin(tags, eq(tagPost.tagId, tags.id));

  if (results.length === 0) {
    return null;
  }

  const postMap = new Map<string, Post>();

  results.forEach((result) => {
    const postId = result.post.id as string;

    if (!postMap.has(postId)) {
      postMap.set(postId, {
        ...result.post,
        author: result.author || undefined,
        categories: [],
        tags: [],
      });
    }

    const post = postMap.get(postId);

    if (
      result.category &&
      !post!.categories!.some((cat) => cat.id === result.category.id)
    ) {
      post!.categories!.push(result.category);
    }

    if (result.tag && !post!.tags!.some((tag) => tag.id === result.tag!.id)) {
      post!.tags!.push(result.tag);
    }
  });

  return Array.from(postMap.values());
};
