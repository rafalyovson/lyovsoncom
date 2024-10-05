import { db } from '@/data/db';
import { categories } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { CategoryResponse } from '@/data/actions/db-actions/category/index';

export async function categoryDeleteById(data: {
  id: string;
}): Promise<CategoryResponse> {
  try {
    await db.delete(categories).where(eq(categories.id, data.id));
    return { success: true, message: 'Category deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to delete category', error };
  }
}
