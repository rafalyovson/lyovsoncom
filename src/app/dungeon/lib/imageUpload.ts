// import { put } from "@vercel/blob";
// import { revalidatePath } from "next/cache";

// async function uploadImage(formData: FormData) {
//   "use server";
//   const imageFile = formData.get("image") as File;
//   const blob = await put(imageFile.name, imageFile, {
//     access: "public",
//   });
//   revalidatePath("/");
//   return blob;
// }
