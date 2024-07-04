'use server';

import { db } from '@/data/db';
import { categories, postInsertSchema } from '@/data/schema';
import { eq } from 'drizzle-orm';
import {
  categoryInsert,
  CategoryOneResponse,
} from '@/lib/actions/db-actions/category';

export const categoryCreateAction = async (
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

  const parsedData = postInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      message: 'Failed to validate Category Data',
      success: false,
      category: null,
    };
  }
  return await categoryInsert(data);
};
