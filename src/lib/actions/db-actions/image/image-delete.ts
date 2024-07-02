import { db } from '@/data/db';
import { images } from '@/data/schema';
import { eq } from 'drizzle-orm';

export async function imageDeletebyUrl(data: { url: string }): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await db.delete(images).where(eq(images.url, data.url));
    return { success: true, message: 'Image deleted successfully' };
  } catch (error) {
    console.error('Failed to delete image:', error);
    return { success: false, message: 'Failed to delete image' };
  }
}
