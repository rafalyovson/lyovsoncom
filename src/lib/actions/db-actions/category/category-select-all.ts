import { categories } from '@/data/schema';
import { db } from '@/data/db';
import { CategoryAllResponse } from '@/lib/actions/db-actions/category/index';

export async function categorySelectAll(): Promise<CategoryAllResponse> {
  try {
    const allCategories = await db.select().from(categories);
    return {
      success: true,
      categories: allCategories,
      message: 'Categories selected successfully',
    };
  } catch (error) {
    return {
      success: false,
      categories: null,
      message: 'Failed to select categories',
      error,
    };
  }
}
