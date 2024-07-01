import { type Blob } from "@/data/types/blob";
import { BlobMeta } from "@/data/types/blob-meta";
import { put } from "@vercel/blob";
import { blobSelect } from "./blob-select";

export async function blobInsert(data: {
  name: string;
  file: File;
}): Promise<{ success: boolean; message: string; blobMeta: BlobMeta | null }> {
  try {
    const blob: Blob = await put(data.name, data.file, {
      access: "public",
      addRandomSuffix: false,
    });
    const result = await blobSelect({ url: blob.url });
    if (result.success) {
      return {
        success: true,
        message: "Blob uploaded successfully",
        blobMeta: result.blobMeta,
      };
    } else {
      return {
        success: false,
        message: "Failed to insert blob",
        blobMeta: null,
      };
    }
  } catch (error) {
    console.error("Failed to insert blob:", error);
    return { success: false, message: "Failed to insert blob", blobMeta: null };
  }
}
