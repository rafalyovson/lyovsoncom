"use server";

import { db } from "@/data/db";
import { images } from "@/data/schema";
import { slugify } from "@/lib/utils";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export async function imageCreate(_prevData: any, formData: FormData) {
  const data = {
    caption: formData.get("caption") as string,
    altText: formData.get("altText") as string,
    group: formData.get("group") as string,
  };

  const imageFile = formData.get("file") as File;

  if (!data.caption || !data.altText || !data.group || !imageFile) {
    return { message: "Invalid form data", success: false, image: null };
  }

  const imageName = `${data.group}.${slugify(data.caption)}.${
    imageFile.type.split("/")[1]
  }`;

  const result = await put(imageName, imageFile, {
    access: "public",
    addRandomSuffix: false,
  });

  if (!result) {
    return { message: "Image upload failed", success: false, image: null };
  }

  const { url } = result;
  const slug = url.split("/").pop() as string;

  const schema = createInsertSchema(images, {
    url: z.string().url().min(1, { message: "Image is required" }),
    slug: z.string().min(1, { message: "Slug is required" }),
  });

  const parsedData = schema.safeParse({ ...data, url, slug });

  if (!parsedData.success) {
    console.log("Validation error", parsedData.error.issues);
    return { message: "Validation error", success: false };
  }

  await db.insert(images).values({ ...data, url, slug });

  const [newImage] = await db.select().from(images).where(eq(images.url, url));

  return { message: "success", success: true, image: newImage };
}
