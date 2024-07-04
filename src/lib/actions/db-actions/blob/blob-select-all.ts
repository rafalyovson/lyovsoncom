import { BlobList } from '@/data/types/blob-list';
import { list } from '@vercel/blob';

type BlobSelectAllResponse = {
  success: boolean;
  blobs: BlobList | null;
  message: string;
};

export async function blobSelectAll(data: {
  limit?: number;
  cursor?: string;
  prefix?: string;
  mode?: 'expanded' | 'folded' | undefined;
}): Promise<BlobSelectAllResponse> {
  try {
    const allBlobs = await list(data);
    if (allBlobs) {
      return { success: true, blobs: allBlobs, message: 'Success' };
    }
    return { success: false, blobs: null, message: 'Error' };
  } catch (error) {
    console.error('Error selecting all blobs:', error);
    return { success: false, blobs: null, message: 'Error' };
  }
}
