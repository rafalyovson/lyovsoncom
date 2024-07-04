'use server';

import { tagInsertSchema } from '@/data/schema';
import { capitalize } from '@/lib/utils';
import {
  tagInsert,
  TagOneResponse,
  tagSelectOneBySlug,
} from '@/lib/actions/db-actions/tag';

export const tagCreate = async (
  _prevState: TagOneResponse,
  formData: FormData,
): Promise<TagOneResponse> => {
  const data = {
    name: capitalize(formData.get('name') as string),
    slug: formData.get('slug') as string,
  };

  const existingTag = await tagSelectOneBySlug({ slug: data.slug });

  if (!existingTag.success) {
    return existingTag;
  }

  const parsedData = tagInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      message: 'Failed to validate Tag data',
      success: false,
      tag: null,
    };
  }

  return await tagInsert(data);
};
