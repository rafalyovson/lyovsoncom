import { list } from '@vercel/blob';
import { BlobAllResponse } from '@/data/actions/db-actions/blob/index';

export async function blobSelectAll(data: {
  limit?: number;
  cursor?: string;
  prefix?: string;
  mode?: 'expanded' | 'folded' | undefined;
}): Promise<BlobAllResponse> {
  try {
    const allBlobs = await list(data);
    if (allBlobs) {
      return {
        success: true,
        blobs: allBlobs,
        message: 'Blobs selected successfully',
      };
    }
    return {
      success: false,
      blobs: null,
      message: 'Failed to select blobs',
    };
  } catch (error) {
    return {
      success: false,
      blobs: null,
      message: 'Failed to select blobs',
      error,
    };
  }
}
