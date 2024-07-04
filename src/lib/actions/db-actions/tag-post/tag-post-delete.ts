import { db } from '@/data/db';
import { tagPost } from '@/data/schema/tagPost';
import { eq } from 'drizzle-orm';
import { TagPostResponse } from '@/lib/actions/db-actions/tag-post';

export async function tagPostDelete(data: {
  postId?: string;
  tagId?: string;
}): Promise<TagPostResponse> {
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
      return { success: false, message: 'Invalid TagPost data' };
    }

    return { success: true, message: 'TagPost deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to delete tagPost' };
  }
}
