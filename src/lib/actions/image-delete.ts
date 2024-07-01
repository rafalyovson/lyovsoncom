"use server";

import {imageDeletebyUrl} from "./db-actions/image-delete";

export async function imageDelete(
  _prevState: { message: string; success: boolean },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const url = formData.get("url") as string;
  if (url === "") {
    console.error(`Invalid URL: ${url}`);
    return { success: false, message: "Invalid URL" };
  }
  try {
    return await imageDeletebyUrl({url});
  } catch (error) {
    console.error("Failed to delete image:", error);
    return { success: false, message: "Failed to delete image" };
  }
}
