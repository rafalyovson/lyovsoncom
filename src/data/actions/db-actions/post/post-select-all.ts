import { posts } from '@/data/schema';
import { db } from '@/data/db';
import { PostAllResponse } from '@/data/actions/db-actions/post/index';

export async function postSelectAll(): Promise<PostAllResponse> {
  try {
    const allPosts = await db.select().from(posts);
    return {
      success: true,
      posts: allPosts,
      message: 'Posts selected successfully',
    };
  } catch (error) {
    return {
      success: false,
      posts: null,
      message: 'Failed to select posts',
      error,
    };
  }
}
