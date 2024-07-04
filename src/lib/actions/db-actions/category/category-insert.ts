import { db } from '@/data/db';
import {
  categories,
  Category,
  categoryInsertSchema,
  NewCategory,
} from '@/data/schema';
import { eq } from 'drizzle-orm';

type CategoryInsertResponse = {
  success: boolean;
  message: string;
  category: Category | null;
};

export async function categoryInsert(
  data: NewCategory,
): Promise<CategoryInsertResponse> {
  const parsedData = categoryInsertSchema.safeParse(data);

  if (!parsedData.success) {
    console.log('Validation error', parsedData.error.issues);
    return {
      success: parsedData.success,
      message: 'Validation error',
      category: null,
    };
  }

  try {
    await db.insert(categories).values(data);
    const [newCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, data.slug));
    return {
      success: parsedData.success,
      message: 'Category created successfully',
      category: newCategory,
    };
  } catch (error) {
    console.error('Failed to insert category:', error);
    return {
      success: false,
      message: 'Failed to insert category',
      category: null,
    };
  }
}
