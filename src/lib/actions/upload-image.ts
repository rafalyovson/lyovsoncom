"use server";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function uploadImage(
  _prevState: { url: string },
  formData: FormData
) {
  console.log("run!");
  const imageFile = formData.get("image") as File;
  const name = formData.get("name") as string;
  const result = await put(name, imageFile, {
    access: "public",
    addRandomSuffix: false,
  });
  revalidatePath("/");
  return { url: result.url };
}
