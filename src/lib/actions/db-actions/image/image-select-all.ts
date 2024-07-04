import { Image, images } from '@/data/schema';
import { db } from '@/data/db';

type ImageSelectAllResponse = {
  success: boolean;
  images: Image[] | null;
  message: string;
};

export async function imageSelectAll(): Promise<ImageSelectAllResponse> {
  try {
    const allImages = await db.select().from(images);
    return { success: true, images: allImages, message: 'Success' };
  } catch (error) {
    console.error('Error selecting all images:', error);
    return { success: false, images: null, message: 'Error' };
  }
}