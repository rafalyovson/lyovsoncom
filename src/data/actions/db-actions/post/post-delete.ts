import { db } from '@/data/db';
import { posts } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { PostResponse } from '@/data/actions/db-actions/post/index';

export async function postDeleteById(data: {
  id: string;
}): Promise<PostResponse> {
  try {
    await db.delete(posts).where(eq(posts.id, data.id));
    return { success: true, message: 'Post deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to delete post', error };
  }
}
