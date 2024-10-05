import { db } from '@/data/db';
import { categories, categoryInsertSchema, NewCategory } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { CategoryOneResponse } from '@/lib/actions/db-actions/category';

export async function categoryInsert(
  data: NewCategory,
): Promise<CategoryOneResponse> {
  const parsedData = categoryInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: parsedData.success,
      message: 'Failed to validate Category data',
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
      message: 'Category inserted successfully',
      category: newCategory,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to insert category',
      category: null,
      error,
    };
  }
}
