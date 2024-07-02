'use server';

import { db } from '@/data/db';
import { categories, categoryInsertSchema } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { categoryUpdate } from '@/lib/actions/db-actions/category';

export const categoryUpdateAction = async (
  _prevState: { message: string; success: boolean },
  formData: FormData,
): Promise<{ success: boolean; message: string }> => {
  const data = {
    name: formData.get('name'),
    slug: formData.get('slug'),
  };

  const existingCategory = await db
    .select()
    .from(categories)
    .where(eq(categories.name, data.name));

  if (existingCategory.length > 0) {
    return { message: 'Category already exists', success: false };
  }

  const parsedData = categoryInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return { message: 'Wrong data', success: false };
  }
  const result = await categoryUpdate(data);
  if (!result.success) {
    return { message: result.message, success: result.success };
  }
  revalidatePath('/dungeon/categories');
  return { message: result.message, success: result.success };
};
