import type { PutBlobResult } from "@vercel/blob";
import { del } from "@vercel/blob";

export const deleteImage = async (url: string) => {
  del(url);
};

export const uploadImage = async (image: File): Promise<PutBlobResult> => {
  if (!image || image.type.indexOf("image/") !== 0) {
    throw new Error("Please select a valid image");
  }

  const response = await fetch(`/api/image/upload?filename=${image.name}`, {
    method: "POST",
    body: image,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const newBlob: PutBlobResult = await response.json();
  return newBlob;
};
