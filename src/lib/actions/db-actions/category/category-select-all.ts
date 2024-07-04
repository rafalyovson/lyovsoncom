import { categories, Category } from '@/data/schema';
import { db } from '@/data/db';

type CategorySelectAllResponse = {
  success: boolean;
  categories: Category[] | null;
  message: string;
};

export async function categorySelectAll(): Promise<CategorySelectAllResponse> {
  try {
    const allCategories = await db.select().from(categories);
    return { success: true, categories: allCategories, message: 'Success' };
  } catch (error) {
    console.error('Error selecting all categories:', error);
    return { success: false, categories: null, message: 'Error' };
  }
}