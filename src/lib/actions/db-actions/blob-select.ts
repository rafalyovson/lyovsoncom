import { BlobList } from "@/data/types/blob-list";
import { BlobMeta } from "@/data/types/blob-meta";
import { head, list } from "@vercel/blob";

export async function blobSelectAll(data: {
  limit?: number;
  cursor?: string;
  prefix?: string;
  mode?: "expanded" | "folded" | undefined;
}): Promise<{
  success: boolean;
  blobs: BlobList | null;
  message: string;
}> {
  try {
    const allBlobs = await list(data);
    if (allBlobs) {
      return { success: true, blobs: allBlobs, message: "Success" };
    }
    return { success: false, blobs: null, message: "Error" };
  } catch (error) {
    console.error("Error selecting all blobs:", error);
    return { success: false, blobs: null, message: "Error" };
  }
}

export async function blobSelectByUrl(data: { url: string }): Promise<{
  success: boolean;
  blobMeta: BlobMeta | null;
  message: string;
}> {
  try {
    const blobMeta: BlobMeta = await head(data.url);
    return { success: true, blobMeta: blobMeta, message: "Success" };
  } catch (error) {
    console.error("Error selecting blob:", error);
    return { success: false, blobMeta: null, message: "Error" };
  }
}
