import { del } from '@vercel/blob';
import { blobSelectOneByUrl } from './blob-select-one';
import { BlobResponse } from '@/data/actions/db-actions/blob/index';

export async function blobDelete(data: { url: string }): Promise<BlobResponse> {
  try {
    await del(data.url);
    const oldBlob = await blobSelectOneByUrl({ url: data.url });
    if (oldBlob.success) {
      return { success: false, message: 'Failed to delete blob' };
    }
    return { success: true, message: 'Blob deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to delete blob', error };
  }
}
