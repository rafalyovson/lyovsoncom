import { posts } from '@/data/schema';
import { db } from '@/data/db';
import { PostAllResponse } from '@/data/actions/db-actions/post/index';

export async function postSelectAll(
  data: {
    page: number;
    limit: number;
  } = { page: 1, limit: 20 },
): Promise<PostAllResponse> {
  const { page, limit } = data;

  try {
    const offset = (page - 1) * limit;
    const allPosts = await db.select().from(posts).limit(limit).offset(offset);
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
