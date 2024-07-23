import { images } from '@/data/schema';
import { db } from '@/data/db';
import { ImageAllResponse } from '@/lib/actions/db-actions/image';
import { eq } from 'drizzle-orm';

export async function imageSelectAll(
  group?: string,
): Promise<ImageAllResponse> {
  try {
    const allImages = await db
      .select()
      .from(images)
      .where(group ? eq(images.group, group) : undefined);
    return {
      success: true,
      images: allImages,
      message: 'Images selected successfully',
    };
  } catch (error) {
    return {
      success: false,
      images: null,
      message: 'Failed to select images',
      error,
    };
  }
}
