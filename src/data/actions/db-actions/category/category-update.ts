import { db } from '@/data/db';
import { categories, categoryInsertSchema, NewCategory } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { CategoryOneResponse } from '@/data/actions/db-actions/category/index';

export async function categoryUpdate(
  data: NewCategory,
): Promise<CategoryOneResponse> {
  const parsedData = categoryInsertSchema.safeParse(data);

  if (!parsedData.success) {
    console.log('Validation error', parsedData.error.issues);
    return {
      success: parsedData.success,
      message: 'Failed to validate Category data',
      category: null,
    };
  }

  try {
    await db.update(categories).set(data).where(eq(categories.slug, data.slug));
    const [newCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, data.slug));
    return {
      success: parsedData.success,
      message: 'Category updated successfully',
      category: newCategory,
    };
  } catch (error) {
    console.error('Failed to update category:', error);
    return {
      success: false,
      message: 'Failed to update category',
      category: null,
      error,
    };
  }
}
