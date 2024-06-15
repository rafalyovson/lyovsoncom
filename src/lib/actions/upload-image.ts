"use server";

import { getFileExtension } from "@/lib/utils";
import { put } from "@vercel/blob";
import { deleteImage } from "./delete-image";

export async function uploadImage(
  prevState: { url: string; oldImage?: string },
  formData: FormData
) {
  const { oldImage } = prevState;

  if (oldImage) {
    console.log("delete old image");
    await deleteImage(oldImage);
  }

  const imageFile = formData.get("image") as File;
  const name = (formData.get("name") +
    "." +
    (getFileExtension(imageFile.name) || "")) as string;
  const result = await put(name, imageFile, {
    access: "public",
    addRandomSuffix: false,
  });

  console.log("result", result);
  return { url: result.url, oldImage: "" };
}
