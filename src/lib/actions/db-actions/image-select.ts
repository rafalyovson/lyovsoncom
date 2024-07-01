import { db } from "@/data/db";
import { Image, images } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function imageSelectAll(): Promise<{
  success: boolean;
  images: Image[] | null;
  message: string;
}> {
  try {
    const allImages = await db.select().from(images);
    return { success: true, images: allImages, message: "Success" };
  } catch (error) {
    console.error("Error selecting all images:", error);
    return { success: false, images: null, message: "Error" };
  }
}

export async function imageSelectById(data: { id: string }): Promise<{
  success: boolean;
  image: Image | null;
  message: string;
}> {
  try {
    const [theImage] = await db
      .select()
      .from(images)
      .where(eq(images.id, data.id));
    return { success: true, image: theImage, message: "Success" };
  } catch (error) {
    console.error("Error selecting image by id:", error);
    return { success: false, image: null, message: "Error" };
  }
}

export async function imageSelectBySlug(data: { slug: string }): Promise<{
  success: boolean;
  image: Image | null;
  message: string;
}> {
  try {
    const [theImage] = await db
      .select()
      .from(images)
      .where(eq(images.slug, data.slug));
    return { success: true, image: theImage, message: "Success" };
  } catch (error) {
    console.error("Error selecting image by slug:", error);
    return { success: false, image: null, message: "Error" };
  }
}
