import { db } from '@/data/db';
import { imageInsertSchema, images, NewImage } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { ImageOneResponse } from '@/data/actions/db-actions/image/index';

export async function imageInsert(data: NewImage): Promise<ImageOneResponse> {
  const parsedData = imageInsertSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      success: parsedData.success,
      message: 'Failed to validate Image data',
      image: null,
    };
  }
  try {
    await db.insert(images).values(data);
    const [newImage] = await db
      .select()
      .from(images)
      .where(eq(images.url, data.url));
    return {
      success: parsedData.success,
      message: 'Image inserted successfully',
      image: newImage,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to insert image',
      image: null,
      error,
    };
  }
}
