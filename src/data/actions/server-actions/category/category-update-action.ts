'use server';

import { db } from '@/data/db';
import { categories, categoryInsertSchema } from '@/data/schema';
import { eq } from 'drizzle-orm';
import {
  CategoryOneResponse,
  categoryUpdate,
} from '@/data/actions/db-actions/category';

export const categoryUpdateAction = async (
  _prevState: CategoryOneResponse,
  formData: FormData,
): Promise<CategoryOneResponse> => {
  const data = {
    name: formData.get('name'),
    slug: formData.get('slug'),
  };

  const existingCategory = await db
    .select()
    .from(categories)
    .where(eq(categories.name, data.name));

  if (existingCategory.length > 0) {
    return {
      message: 'Category already exists',
      success: false,
      category: null,
    };
  }

  const parsedData = categoryInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      message: 'Failed to validate Category data',
      success: false,
      category: null,
    };
  }
  return await categoryUpdate(data);
};
