import { db } from "@/data/db";
import {
  categories,
  categoryPost,
  posts,
  tagPost,
  tags,
  users,
} from "@/data/schema";
import { eq, InferSelectModel } from "drizzle-orm";

export type Post = InferSelectModel<typeof posts> & {
  author?: InferSelectModel<typeof users>;
  categories?: InferSelectModel<typeof categories>[];
  tags?: InferSelectModel<typeof tags>[];
};

export const getPostBySlug2 = async (slug: string): Promise<Post | null> => {
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
    .leftJoin(tags, eq(tagPost.tagId, tags.id))
    .where(eq(posts.slug, slug));

  if (results.length === 0) {
    return null;
  }

  const post: Post = results[0].post;
  post.author = results[0].author!;
  post.categories = [];
  post.tags = [];

  results.forEach((result) => {
    if (
      result.category &&
      !post.categories?.some((cat) => cat.id === result.category.id)
    ) {
      post.categories?.push(result.category);
    }
    if (result.tag && !post.tags?.some((tag) => tag.id === result.tag?.id)) {
      post.tags?.push(result.tag);
    }
  });

  return post;
};
