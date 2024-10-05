'use server';

import {
  categoryDeleteById,
  CategoryResponse,
} from '@/data/actions/db-actions/category';

export const categoryDeleteAction = async (
  _prevState: CategoryResponse,
  data: FormData,
): Promise<CategoryResponse> => {
  const id = data.get('id') as string;
  return await categoryDeleteById({ id });
};
