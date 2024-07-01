import { del } from "@vercel/blob";
import { blobSelect } from "./blob-select";

export async function blobDelete(data: { url: string }): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await del(data.url);
    const oldBlob = await blobSelect({ url: data.url });
    if (oldBlob.success) {
      return { success: false, message: "Failed to delete blob" };
    }
    return { success: true, message: "Blob deleted successfully" };
  } catch (error) {
    console.error("Failed to delete blob:", error);
    return { success: false, message: "Failed to delete blob" };
  }
}
