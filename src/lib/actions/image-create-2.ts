"use server";

import { db } from "@/data/db";
import { images } from "@/data/schema";
import { slugify } from "@/lib/utils";
import { put } from "@vercel/blob";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function imageCreate(_prevData: any, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    alt: formData.get("alt") as string,
    type: formData.get("type") as string,
  };
  const imageFile = formData.get("file") as File;

  if (!data.name || !data.alt || !data.type || !imageFile) {
    return { message: "Invalid form data", success: false };
  }

  const imageName = `${data.type}.${slugify(data.name)}.${
    imageFile.type.split("/")[1]
  }`;

  const result = await put(imageName, imageFile, {
    access: "public",
    addRandomSuffix: false,
  });

  if (!result) {
    return { message: "Image upload failed", success: false };
  }

  const { url } = result;

  const schema = createInsertSchema(images, {
    url: z.string().url().min(1, { message: "Image is required" }),
  });

  const parsedData = schema.safeParse({ ...data, url });

  if (!parsedData.success) {
    console.log("Validation error", parsedData.error.issues);
    return { message: "Validation error", success: false };
  }

  console.log("parsedData", parsedData.data);

  await db.insert(images).values({ ...data, url });

  revalidatePath("/dungeon/images");
  return { message: "success", success: true };
}
