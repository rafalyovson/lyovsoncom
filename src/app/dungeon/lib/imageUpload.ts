"use server";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadImage(formData: FormData) {
  const imageFile = formData.get("file") as File;
  const blob = await put(imageFile.name, imageFile, {
    contentType: imageFile.type,
    access: "public",
  });
  console.log("blob");
  revalidatePath("/");
  return blob;
}

export async function logger(formData: FormData) {
  "use server";
  if (formData.get("imageUrl") !== null) {
    await del(formData.get("imageUrl") as string);
  }
  redirect("/dungeon");
}
