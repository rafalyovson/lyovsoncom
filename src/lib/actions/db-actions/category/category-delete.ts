import { db } from '@/data/db';
import { categories } from '@/data/schema';
import { eq } from 'drizzle-orm';

export async function categoryDeleteById(data: { id: string }): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await db.delete(categories).where(eq(categories.id, data.id));
    return { success: true, message: 'Category deleted successfully' };
  } catch (error) {
    console.error('Failed to delete category:', error);
    return { success: false, message: 'Failed to delete category' };
  }
}
