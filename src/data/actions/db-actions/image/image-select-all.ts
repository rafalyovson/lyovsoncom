import { images } from '@/data/schema';
import { db } from '@/data/db';
import { ImageAllResponse } from '@/data/actions/db-actions/image/index';
import { eq } from 'drizzle-orm';

export async function imageSelectAll(
  group?: string,
  page: number = 1,
  limit: number = 20,
): Promise<ImageAllResponse> {
  try {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Fetch images with pagination and optional group filter
    const allImages = await db
      .select()
      .from(images)
      .where(group ? eq(images.group, group) : undefined)
      .limit(limit)
      .offset(offset);

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
