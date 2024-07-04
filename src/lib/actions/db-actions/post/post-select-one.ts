import { db } from '@/data/db';
import { posts } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { PostOneResponse } from '@/lib/actions/db-actions/post';

export async function postSelectOneBySlug(data: {
  slug: string;
}): Promise<PostOneResponse> {
  try {
    const [thePost] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, data.slug));
    return {
      success: true,
      post: thePost,
      message: 'Post selected successfully',
    };
  } catch (error) {
    return { success: false, post: null, message: 'Failed to select post' };
  }
}

export async function postSelectOneById(data: {
  id: string;
}): Promise<PostOneResponse> {
  try {
    const [thePost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, data.id));
    return {
      success: true,
      post: thePost,
      message: 'Post selected successfully',
    };
  } catch (error) {
    return { success: false, post: null, message: 'Failed to select post' };
  }
}
