'use server';

import { postInsertSchema } from '@/data/schema';
import {
  categoryInsert,
  CategoryOneResponse,
  categorySelectOneBySlug,
} from '@/lib/actions/db-actions/category';

export const categoryCreateAction = async (
  _prevState: CategoryOneResponse,
  formData: FormData,
): Promise<CategoryOneResponse> => {
  const data = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
  };

  const result = await categorySelectOneBySlug({ slug: data.slug! });

  if (result.category) {
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
