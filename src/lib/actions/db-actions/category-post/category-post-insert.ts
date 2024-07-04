import { db } from '@/data/db';
import { categoryPost, categoryPostInsertSchema } from '@/data/schema';
import { CategoryPostOneResponse } from '@/lib/actions/db-actions/category-post';

export async function categoryPostInsert(data: {
  categoryId: string;
  postId: string;
}): Promise<CategoryPostOneResponse> {
  const parsedData = categoryPostInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: parsedData.success,
      message: 'Failed to validate CategoryPost data',
      categoryPost: null,
    };
  }

  try {
    await db.insert(categoryPost).values(data);
    return {
      success: parsedData.success,
      message: 'CategoryPost inserted successfully',
      categoryPost: data,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to insert CategoryPost',
      categoryPost: null,
    };
  }
}
