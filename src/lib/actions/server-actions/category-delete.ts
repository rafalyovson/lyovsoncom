'use server';

import { revalidatePath } from 'next/cache';
import { categoryDeleteById } from '@/lib/actions/db-actions/category';

export const categoryDeleteAction = async (
  _prevState: { message: string; success: boolean },
  data: FormData,
): Promise<{ success: boolean; message: string }> => {
  const id = data.get('id') as string;
  const result = await categoryDeleteById({ id });
  revalidatePath('/dungeon/categories');
  return result;
};
