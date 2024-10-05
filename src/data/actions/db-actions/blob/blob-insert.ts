import { put } from '@vercel/blob';
import { blobSelectOneByUrl } from './blob-select-one';
import { BlobOneResponse } from '@/data/actions/db-actions/blob/index';
import { imageOptimizeAction } from '@/lib/utils';

export async function blobInsert(data: {
  name: string;
  file: File;
  optimizationOptions?: { width?: number; quality?: number; format?: string };
}): Promise<BlobOneResponse> {
  try {
    // Set default optimization settings
    const {
      width = 1024,
      quality = 80,
      format = 'webp', // default format to WebP
    } = data.optimizationOptions || {};

    // Read file as Buffer
    const arrayBufferPromise = data.file.arrayBuffer();
    const webpName = data.name.replace(/\.[^/.]+$/, `.${format}`);

    // Wait for the file buffer
    const arrayBuffer = await arrayBufferPromise;
    const buffer = Buffer.from(arrayBuffer);

    // Check if the file is already in a suitable format and size
    const mimeType = data.file.type;
    const isAlreadyOptimized =
      (mimeType === 'image/webp' || mimeType === 'image/avif') &&
      buffer.byteLength < 1024 * 1024 * 3;

    // Directly upload without optimization if already optimized
    if (isAlreadyOptimized) {
      const blob = await put(webpName, buffer, {
        access: 'public',
        addRandomSuffix: false,
      });

      const result = await blobSelectOneByUrl({ url: blob.url });
      return result.success
        ? {
            success: true,
            message: 'Blob uploaded successfully without further optimization',
            blobMeta: result.blobMeta,
          }
        : {
            success: false,
            message: 'Failed to insert blob',
            blobMeta: null,
          };
    }

    // Optimize image
    const optimizedBuffer = await imageOptimizeAction(buffer, {
      width,
      quality,
      format,
    });

    // Check final size, return error if still above 3MB
    if (optimizedBuffer.byteLength > 1024 * 1024 * 3) {
      return {
        success: false,
        message: 'Optimized image is still larger than 3MB',
        blobMeta: null,
      };
    }

    // Upload the optimized image buffer
    const blob = await put(webpName, optimizedBuffer, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Store and return the blob metadata
    const result = await blobSelectOneByUrl({ url: blob.url });
    return result.success
      ? {
          success: true,
          message: 'Blob uploaded successfully',
          blobMeta: result.blobMeta,
        }
      : {
          success: false,
          message: 'Failed to insert blob',
          blobMeta: null,
        };
  } catch (error) {
    console.error('Failed to optimize and insert blob:', error);
    return {
      success: false,
      message: 'Failed to optimize and insert blob',
      blobMeta: null,
      error,
    };
  }
}
