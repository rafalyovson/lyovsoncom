import { db } from '@/data/db';
import { CategoryPost, categoryPost } from '@/data/schema';
import { eq } from 'drizzle-orm';

type CategoryPostSelectOnePostResponse = {
  success: boolean;
  categoryPosts: CategoryPost[] | null;
  message: string;
};

export async function categoryPostSelectOnePost(data: {
  postId: string;
}): Promise<CategoryPostSelectOnePostResponse> {
  try {
    const allCategoryPosts = await db
      .select()
      .from(categoryPost)
      .where(eq(categoryPost.postId, data.postId));
    return {
      success: true,
      categoryPosts: allCategoryPosts,
      message: 'Success',
    };
  } catch (error) {
    console.error('Error selecting tags:', error);
    return { success: false, categoryPosts: null, message: 'Error' };
  }
}
