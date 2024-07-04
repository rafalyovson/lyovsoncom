import { images } from '@/data/schema';
import { db } from '@/data/db';
import { ImageAllResponse } from '@/lib/actions/db-actions/image';

export async function imageSelectAll(): Promise<ImageAllResponse> {
  try {
    const allImages = await db.select().from(images);
    return {
      success: true,
      images: allImages,
      message: 'Images selected successfully',
    };
  } catch (error) {
    return { success: false, images: null, message: 'Failed to select images' };
  }
}
