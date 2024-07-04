import { BlobMeta } from '@/data/types/blob-meta';
import { head } from '@vercel/blob';

type BlobSelectOneResponse = {
  success: boolean;
  blobMeta: BlobMeta | null;
  message: string;
};

export async function blobSelectOneByUrl(data: {
  url: string;
}): Promise<BlobSelectOneResponse> {
  try {
    const blobMeta: BlobMeta = await head(data.url);
    return { success: true, blobMeta: blobMeta, message: 'Success' };
  } catch (error) {
    console.error('Error selecting blob:', error);
    return { success: false, blobMeta: null, message: 'Error' };
  }
}
