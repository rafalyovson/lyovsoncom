'use server';

import {
  imageDeleteByUrl,
  ImageResponse,
} from '@/lib/actions/db-actions/image';
import { blobDelete } from '@/lib/actions/db-actions/blob';

export async function imageDeleteAction(
  _prevState: ImageResponse,
  formData: FormData,
): Promise<ImageResponse> {
  const url = formData.get('url') as string;
  if (url === '') {
    console.error(`Invalid URL: ${url}`);
    return { success: false, message: 'Invalid URL' };
  }

  const blobResults = await blobDelete({ url });
  if (!blobResults.success) {
    return blobResults;
  }
  return await imageDeleteByUrl({ url });
}
