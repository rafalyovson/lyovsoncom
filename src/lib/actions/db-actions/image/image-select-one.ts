import { db } from '@/data/db';
import { Image, images } from '@/data/schema';
import { eq } from 'drizzle-orm';

type ImageSelectOneResponse = {
  success: boolean;
  image: Image | null;
  message: string;
};

export async function imageSelectById(data: {
  id: string;
}): Promise<ImageSelectOneResponse> {
  try {
    const [theImage] = await db
      .select()
      .from(images)
      .where(eq(images.id, data.id));
    return { success: true, image: theImage, message: 'Success' };
  } catch (error) {
    console.error('Error selecting image by id:', error);
    return { success: false, image: null, message: 'Error' };
  }
}

export async function imageSelectBySlug(data: {
  slug: string;
}): Promise<ImageSelectOneResponse> {
  try {
    const [theImage] = await db
      .select()
      .from(images)
      .where(eq(images.slug, data.slug));
    return { success: true, image: theImage, message: 'Success' };
  } catch (error) {
    console.error('Error selecting image by slug:', error);
    return { success: false, image: null, message: 'Error' };
  }
}
