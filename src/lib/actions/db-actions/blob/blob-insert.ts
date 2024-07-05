import { type Blob } from '@/data/types/blob';
import { put } from '@vercel/blob';
import { blobSelectOneByUrl } from './blob-select-one';
import { BlobOneResponse } from '@/lib/actions/db-actions/blob';

export async function blobInsert(data: {
  name: string;
  file: File;
}): Promise<BlobOneResponse> {
  if (data.file.size > 1024 * 1024 * 3) {
    return {
      success: false,
      message: 'File size is too large',
      blobMeta: null,
    };
  }
  try {
    const blob: Blob = await put(data.name, data.file, {
      access: 'public',
      addRandomSuffix: false,
    });
    const result = await blobSelectOneByUrl({ url: blob.url });
    if (result.success) {
      return {
        success: true,
        message: 'Blob uploaded successfully',
        blobMeta: result.blobMeta,
      };
    } else {
      return {
        success: false,
        message: 'Failed to insert blob',
        blobMeta: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to insert blob',
      blobMeta: null,
      error,
    };
  }
}
