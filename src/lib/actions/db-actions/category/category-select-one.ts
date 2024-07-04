import { db } from '@/data/db';
import { categories, Category } from '@/data/schema';
import { eq } from 'drizzle-orm';

type CategorySelectOneResponse = {
  success: boolean;
  category: Category | null;
  message: string;
};

export async function categorySelectOneById(data: {
  id: string;
}): Promise<CategorySelectOneResponse> {
  try {
    const [theCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, data.id));
    return { success: true, category: theCategory, message: 'Success' };
  } catch (error) {
    console.error('Error selecting category by id:', error);
    return { success: false, category: null, message: 'Error' };
  }
}

export async function categorySelectOneBySlug(data: {
  slug: string;
}): Promise<CategorySelectOneResponse> {
  try {
    const [theCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, data.slug));

    if (theCategory.length === 0) {
      return { success: false, category: null, message: 'Category not found' };
    } else {
      return { success: true, category: theCategory, message: 'Success' };
    }
  } catch (error) {
    console.error('Error selecting category by slug:', error);
    return { success: false, category: null, message: 'Error' };
  }
}
