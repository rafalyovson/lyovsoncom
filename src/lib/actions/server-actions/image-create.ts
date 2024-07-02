'use server';

import { Image, imageInsertSchema } from '@/data/schema';
import { slugify } from '@/lib/utils';
import { blobInsert } from '@/lib/actions/db-actions/blob';
import { imageInsert } from '@/lib/actions/db-actions/image';

export async function imageCreate(
  _prevData: { message: string; success: boolean; image: Image | null },
  formData: FormData,
): Promise<{ success: boolean; message: string; image: Image | null }> {
  const data = {
    caption: formData.get('caption') as string,
    altText: formData.get('altText') as string,
    group: formData.get('group') as string,
  };

  const file = formData.get('file') as File;

  if (!data.caption || !data.altText || !data.group || !file) {
    return { message: 'Invalid form data', success: false, image: null };
  }

  const name = `${data.group}.${slugify(data.caption)}.${
    file.type.split('/')[1]
  }`;

  const result = await blobInsert({ name, file });

  if (!result.success || !result.blobMeta) {
    return { message: result.message, success: result.success, image: null };
  }

  const { url, pathname: slug } = result.blobMeta;

  const fullData = { ...data, url, slug };

  const parsedData = imageInsertSchema.safeParse(fullData);

  if (!parsedData.success) {
    console.log('Validation error', parsedData.error.issues);
    return { message: 'Validation error', success: false, image: null };
  }

  try {
    return await imageInsert(fullData);
  } catch (error) {
    console.error('Failed to insert image:', error);
    return { message: 'Failed to insert image', success: false, image: null };
  }
}
