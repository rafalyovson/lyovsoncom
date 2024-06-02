"use server";

import { getFileExtension } from "@/lib/utils";
import { put } from "@vercel/blob";

export async function uploadImage(
  _prevState: { url: string },
  formData: FormData
) {
  console.log("formData", formData);
  const imageFile = formData.get("image") as File;
  const name = (formData.get("name") +
    "." +
    (getFileExtension(imageFile.name) || "")) as string;
  const result = await put(name, imageFile, {
    access: "public",
    addRandomSuffix: false,
  });
  console.log("result", result);
  return { url: result.url };
}

export const logger = async (formData: FormData) => {
  console.log("run!");
  console.log("formData", formData);
};
