import { db } from '@/data/db';
import { posts } from '@/data/schema';
import { eq } from 'drizzle-orm';

type PostDeleteResponse = {
  success: boolean;
  message: string;
};

export async function postDeleteById(data: {
  id: string;
}): Promise<PostDeleteResponse> {
  try {
    await db.delete(posts).where(eq(posts.id, data.id));
    return { success: true, message: 'Post deleted successfully' };
  } catch (error) {
    console.error('Failed to delete post:', error);
    return { success: false, message: 'Failed to delete post' };
  }
}
