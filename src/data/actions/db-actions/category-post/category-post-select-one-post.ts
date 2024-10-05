import { db } from '@/data/db';
import { categoryPost } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { CategoryPostAllResponse } from '@/data/actions/db-actions/category-post/index';

export async function categoryPostSelectOnePost(data: {
  postId: string;
}): Promise<CategoryPostAllResponse> {
  try {
    const allCategoryPosts = await db
      .select()
      .from(categoryPost)
      .where(eq(categoryPost.postId, data.postId));
    return {
      success: true,
      categoryPosts: allCategoryPosts,
      message: 'CategoryPosts selected successfully',
    };
  } catch (error) {
    return {
      success: false,
      categoryPosts: null,
      message: 'Failed to select posts',
      error,
    };
  }
}
