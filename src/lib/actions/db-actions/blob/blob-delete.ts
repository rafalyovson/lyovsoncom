import { del } from '@vercel/blob';
import { blobSelectOneByUrl } from './blob-select-one';

type BlobDeleteResponse = {
  success: boolean;
  message: string;
};

export async function blobDelete(data: {
  url: string;
}): Promise<BlobDeleteResponse> {
  try {
    await del(data.url);
    const oldBlob = await blobSelectOneByUrl({ url: data.url });
    if (oldBlob.success) {
      return { success: false, message: 'Failed to delete blob' };
    }
    return { success: true, message: 'Blob deleted successfully' };
  } catch (error) {
    console.error('Failed to delete blob:', error);
    return { success: false, message: 'Failed to delete blob' };
  }
}
