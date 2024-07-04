import { db } from '@/data/db';
import { Image, imageInsertSchema, images, NewImage } from '@/data/schema';
import { eq } from 'drizzle-orm';

type ImageInsertResponse = {
  success: boolean;
  message: string;
  image: Image | null;
};

export async function imageInsert(
  data: NewImage,
): Promise<ImageInsertResponse> {
  const parsedData = imageInsertSchema.safeParse(data);
  if (!parsedData.success) {
    console.log('Validation error', parsedData.error.issues);
    return {
      success: parsedData.success,
      message: 'Validation error',
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
      message: 'Image created successfully',
      image: newImage,
    };
  } catch (error) {
    console.error('Failed to insert image:', error);
    return {
      success: false,
      message: 'Failed to insert image',
      image: null,
    };
  }
}
