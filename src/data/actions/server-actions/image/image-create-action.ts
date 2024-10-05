'use server';

import { imageInsertSchema } from '@/data/schema';
import { slugify } from '@/lib/utils';
import { blobInsert } from '@/data/actions/db-actions/blob';
import {
  imageInsert,
  ImageOneResponse,
  imageSelectOneBySlug,
} from '@/data/actions/db-actions/image';

export async function imageCreateAction(
  _prevData: ImageOneResponse,
  formData: FormData,
): Promise<ImageOneResponse> {
  console.log('👠', formData);
  // Extract and validate form data
  const { caption, altText, group, file } = {
    caption: formData.get('caption') as string,
    altText: formData.get('altText') as string,
    group: formData.get('group') as string,
    file: formData.get('file') as File,
  };

  // Quick validation for required fields
  if (!caption || !altText || !group || !file) {
    return { message: 'Invalid form data', success: false, image: null };
  }

  // Generate base name for the file and ensure it's unique
  let name = `${group}.${slugify(caption)}.${file.type.split('/')[1]}`;

  // Check if a slug already exists and modify the name if necessary
  const checkExistingName = imageSelectOneBySlug({ slug: name });
  const checkNameResult = await checkExistingName;

  if (checkNameResult.success && checkNameResult.image) {
    // Append a unique identifier to avoid duplicates
    name = `${group}.${slugify(caption)}.${Date.now()}.${file.type.split('/')[1]}`;
  }

  // Upload file to Vercel Blob with `blobInsert` which also optimizes it
  const result = await blobInsert({ name, file });

  if (!result.success || !result.blobMeta) {
    return { message: result.message, success: result.success, image: null };
  }

  // Extract blob metadata
  const { url, pathname: slug } = result.blobMeta;

  // Combine all data for insertion
  const fullData = { caption, altText, group, url, slug };

  // Validate data against schema
  const parsedData = imageInsertSchema.safeParse(fullData);

  if (!parsedData.success) {
    console.error('Validation error', parsedData.error.issues);
    return { message: 'Validation error', success: false, image: null };
  }

  // Insert the image data into the database
  return await imageInsert(fullData);
}
