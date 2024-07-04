import { db } from '@/data/db';
import { images } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { ImageOneResponse } from '@/lib/actions/db-actions/image';

export async function imageSelectById(data: {
  id: string;
}): Promise<ImageOneResponse> {
  try {
    const [theImage] = await db
      .select()
      .from(images)
      .where(eq(images.id, data.id));
    return {
      success: true,
      image: theImage,
      message: 'Selected image successfully',
    };
  } catch (error) {
    return { success: false, image: null, message: 'Failed to select image' };
  }
}

export async function imageSelectBySlug(data: {
  slug: string;
}): Promise<ImageOneResponse> {
  try {
    const [theImage] = await db
      .select()
      .from(images)
      .where(eq(images.slug, data.slug));
    return {
      success: true,
      image: theImage,
      message: 'Selected image successfully',
    };
  } catch (error) {
    return { success: false, image: null, message: 'Failed to select image' };
  }
}
