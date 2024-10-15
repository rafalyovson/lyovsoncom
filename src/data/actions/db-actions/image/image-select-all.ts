import { images } from '@/data/schema';
import { db } from '@/data/db';
import { ImageAllResponse } from '@/data/actions/db-actions/image/index';
import { count, eq } from 'drizzle-orm';

export async function imageSelectAll(
  data: {
    group?: string;
    page: number;
    limit: number;
  } = { group: undefined, page: 1, limit: 20 },
): Promise<ImageAllResponse> {
  const { group, page, limit } = data;

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

export async function imageCount(data: { group?: string }): Promise<number> {
  try {
    const { group } = data;
    const result = await db
      .select({ count: count() })
      .from(images)
      .where(group ? eq(images.group, group) : undefined);
    return result[0].count;
  } catch (error) {
    return 0;
  }
}
