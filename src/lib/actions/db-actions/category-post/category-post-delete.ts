import { db } from '@/data/db';
import { categoryPost } from '@/data/schema';
import { eq } from 'drizzle-orm';

type CategoryPostDeleteResponse = {
  success: boolean;
  message: string;
};

export async function categoryPostDelete(data: {
  postId?: string;
  categoryId?: string;
}): Promise<CategoryPostDeleteResponse> {
  try {
    if (data.postId && data.categoryId) {
      await db
        .delete(categoryPost)
        .where(
          eq(categoryPost.postId, data.postId) &&
            eq(categoryPost.categoryId, data.categoryId),
        );
    } else if (data.categoryId) {
      await db
        .delete(categoryPost)
        .where(eq(categoryPost.categoryId, data.categoryId));
    } else if (data.postId) {
      await db.delete(categoryPost).where(eq(categoryPost.postId, data.postId));
    } else {
      return { success: false, message: 'Invalid data' };
    }

    return { success: true, message: 'CategoryPost deleted successfully' };
  } catch (error) {
    console.error('Failed to delete categoryPost:', error);
    return { success: false, message: 'Failed to delete categoryPost' };
  }
}
