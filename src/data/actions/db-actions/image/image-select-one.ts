import { db } from '@/data/db';
import { images } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { ImageOneResponse } from '@/data/actions/db-actions/image/index';

export async function imageSelectOneById(data: {
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
    return {
      success: false,
      image: null,
      message: 'Failed to select image',
      error,
    };
  }
}

export async function imageSelectOneBySlug(data: {
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
    return {
      success: false,
      image: null,
      message: 'Failed to select image',
      error,
    };
  }
}
