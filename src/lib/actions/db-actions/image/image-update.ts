import { db } from '@/data/db';
import { Image, imageInsertSchema, images } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { ImageOneResponse } from '@/lib/actions/db-actions/image';

export async function imageUpdate(data: Image): Promise<ImageOneResponse> {
  const parsedData = imageInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: parsedData.success,
      message: 'Failed to validate Image data',
      image: null,
    };
  }

  try {
    await db.update(images).set(data).where(eq(images.slug, data.slug));
    const [newImage] = await db
      .select()
      .from(images)
      .where(eq(images.slug, data.slug));
    return {
      success: parsedData.success,
      message: 'Image updated successfully',
      image: newImage,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update image',
      image: null,
      error,
    };
  }
}
