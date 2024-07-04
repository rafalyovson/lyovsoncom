import { db } from '@/data/db';
import { CategoryPost, categoryPost } from '@/data/schema';
import { z } from 'zod';

type CategoryPostInsertResponse = {
  success: boolean;
  message: string;
  categoryPost: CategoryPost | null;
};

export async function categoryPostInsert(data: {
  categoryId: string;
  postId: string;
}): Promise<CategoryPostInsertResponse> {
  const schema = z.object({
    categoryId: z.string().uuid({ message: 'Invalid category ID' }),
    postId: z.string().uuid({ message: 'Invalid post ID' }),
  });

  const parsedData = schema.safeParse(data);

  if (!parsedData.success) {
    console.log('🐤 Validation error', parsedData.error.issues);
    return {
      success: parsedData.success,
      message: 'Validation error',
      categoryPost: null,
    };
  }

  try {
    await db.insert(categoryPost).values(data);
    return {
      success: parsedData.success,
      message: 'CategoryPost created successfully',
      categoryPost: data,
    };
  } catch (error) {
    console.error('Failed to insert category:', error);
    return {
      success: false,
      message: 'Failed to insert category',
      categoryPost: null,
    };
  }
}
