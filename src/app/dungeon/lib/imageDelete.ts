"use server";

import { del } from "@vercel/blob";

export const deleteImage = async (url: string) => {
  del(url);
};
