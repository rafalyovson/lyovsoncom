import { db } from '@/data/db';
import { tagPost } from '@/data/schema/tagPost';
import { eq } from 'drizzle-orm';

type TagPostDeleteResponse = {
  success: boolean;
  message: string;
};

export async function tagPostDelete(data: {
  postId?: string;
  tagId?: string;
}): Promise<TagPostDeleteResponse> {
  try {
    if (data.postId && data.tagId) {
      await db
        .delete(tagPost)
        .where(
          eq(tagPost.postId, data.postId) && eq(tagPost.tagId, data.tagId),
        );
    } else if (data.tagId) {
      await db.delete(tagPost).where(eq(tagPost.tagId, data.tagId));
    } else if (data.postId) {
      await db.delete(tagPost).where(eq(tagPost.postId, data.postId));
    } else {
      return { success: false, message: 'Invalid data' };
    }

    return { success: true, message: 'TagPost deleted successfully' };
  } catch (error) {
    console.error('Failed to delete tagPost:', error);
    return { success: false, message: 'Failed to delete tagPost' };
  }
}
