import { db } from '@/data/db';
import { images } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { ImageResponse } from '@/lib/actions/db-actions/image';

export async function imageDeleteByUrl(data: {
  url: string;
}): Promise<ImageResponse> {
  try {
    await db.delete(images).where(eq(images.url, data.url));
    return { success: true, message: 'Image deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to delete image' };
  }
}
