"use server";

import { del } from "@vercel/blob";

export const deleteImage = async (url: string) => {
  console.log("deleteImage", url);
  try {
    if (url === "") {
      console.error(`Invalid URL: ${url}`);
      return;
    }
    await del(url);
  } catch (error) {
    console.error("Failed to delete image:", error);
  }
};
