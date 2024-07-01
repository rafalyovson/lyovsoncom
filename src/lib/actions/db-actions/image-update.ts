import { db } from "@/data/db";
import { Image, imageInsertSchema, images } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function imageUpdate(data: Image): Promise<{
  success: boolean;
  message: string;
  image: Image | null;
}> {
  const parsedData = imageInsertSchema.safeParse(data);

  if (!parsedData.success) {
    console.log("Validation error", parsedData.error.issues);
    return {
      success: parsedData.success,
      message: "Validation error",
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
      message: "Image updated successfully",
      image: newImage,
    };
  } catch (error) {
    console.error("Failed to update image:", error);
    return {
      success: false,
      message: "Failed to update image",
      image: null,
    };
  }
}
