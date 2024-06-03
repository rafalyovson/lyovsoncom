"use server";

import { getFileExtension } from "@/lib/utils";
import { put } from "@vercel/blob";
import { deleteImage } from "./delete-image";

export async function uploadImage(
  prevState: { url: string; oldImage?: string },
  formData: FormData
) {
  const { oldImage } = prevState;

  console.log("PPPP", prevState);

  if (oldImage) {
    console.log("delete old image");
    await deleteImage(oldImage);
    console.log("AAAA");
  }

  const imageFile = formData.get("image") as File;
  const name = (formData.get("name") +
    "." +
    (getFileExtension(imageFile.name) || "")) as string;
  const result = await put(name, imageFile, {
    access: "public",
    addRandomSuffix: false,
  });

  return { url: result.url, oldImage: "" };
}
