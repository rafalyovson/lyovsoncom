import { db } from '@/data/db';
import { CategoryPost, categoryPost } from '@/data/schema';
import { eq } from 'drizzle-orm';

export async function categoryPostSelect(data: { postId: string }): Promise<{
  success: boolean;
  categories: CategoryPost[] | null;
  message: string;
}> {
  try {
    const allCategoryPosts = await db
      .select()
      .from(categoryPost)
      .where(eq(categoryPost.postId, data.postId));
    return { success: true, categories: allCategoryPosts, message: 'Success' };
  } catch (error) {
    console.error('Error selecting tags:', error);
    return { success: false, categories: null, message: 'Error' };
  }
}
