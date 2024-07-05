import { PostFullAllResponse } from '@/lib/actions/db-actions/post';
import { db } from '@/data/db';
import {
  categories,
  categoryPost,
  images,
  posts,
  tagPost,
  tags,
  users,
} from '@/data/schema';
import { PostFull } from '@/data/types/post-full';
import { eq } from 'drizzle-orm';

export async function postSelectFullAll(): Promise<PostFullAllResponse> {
  try {
    const results = await db
      .select({
        post: posts,
        author: users,
        featuredImage: images,
        category: categories,
        tag: tags,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(images, eq(posts.featuredImageId, images.id))
      .leftJoin(categoryPost, eq(posts.id, categoryPost.postId))
      .leftJoin(categories, eq(categoryPost.categoryId, categories.id))
      .leftJoin(tagPost, eq(posts.id, tagPost.postId))
      .leftJoin(tags, eq(tagPost.tagId, tags.id));

    if (results.length === 0) {
      return { message: 'No posts found', success: false, posts: null };
    }

    const postMap = new Map<string, PostFull>();

    results.forEach((result) => {
      const postId = result.post.id as string;

      if (!postMap.has(postId)) {
        postMap.set(postId, {
          ...result.post,
          author: result.author || undefined,
          featuredImage: result.featuredImage || undefined,
          categories: [],
          tags: [],
        });
      }

      const post = postMap.get(postId)!;

      if (
        result.category &&
        !post.categories?.some((cat) => cat.id === result.category.id)
      ) {
        post.categories?.push(result.category);
      }

      if (result.tag && !post.tags?.some((tag) => tag.id === result.tag!.id)) {
        post.tags?.push(result.tag);
      }
    });

    const allPosts = Array.from(postMap.values());

    return {
      message: 'Posts selected successfully',
      success: true,
      posts: allPosts,
    };
  } catch (error) {
    console.error('Failed to select posts:', error);
    return { message: 'Failed to select posts', success: false, posts: null };
  }
}
