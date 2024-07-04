import { db } from '@/data/db';
import { categories } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { CategoryOneResponse } from '@/lib/actions/db-actions/category';

export async function categorySelectOneById(data: {
  id: string;
}): Promise<CategoryOneResponse> {
  try {
    const [theCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, data.id));
    return {
      success: true,
      category: theCategory,
      message: 'Category selected successfully',
    };
  } catch (error) {
    return {
      success: false,
      category: null,
      message: 'Failed to select category',
    };
  }
}

export async function categorySelectOneBySlug(data: {
  slug: string;
}): Promise<CategoryOneResponse> {
  try {
    const [theCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, data.slug));

    if (theCategory.length === 0) {
      return { success: false, category: null, message: 'Category not found' };
    } else {
      return {
        success: true,
        category: theCategory,
        message: 'Category selected successfully',
      };
    }
  } catch (error) {
    return {
      success: false,
      category: null,
      message: 'Failed to select category',
    };
  }
}
