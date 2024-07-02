'use server';

import { imageDeletebyUrl } from '@/lib/actions/db-actions/image';
import { blobDelete } from '@/lib/actions/db-actions/blob';

export async function imageDelete(
  _prevState: { message: string; success: boolean },
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  const url = formData.get('url') as string;
  if (url === '') {
    console.error(`Invalid URL: ${url}`);
    return { success: false, message: 'Invalid URL' };
  }
  try {
    const blobResults = await blobDelete({ url });
    if (!blobResults.success) {
      return blobResults;
    }
    const imageResults = await imageDeletebyUrl({ url });
    if (!imageResults.success) {
      return imageResults;
    }
    return imageResults;
  } catch (error) {
    console.error('Failed to delete image:', error);
    return { success: false, message: 'Failed to delete image' };
  }
}
