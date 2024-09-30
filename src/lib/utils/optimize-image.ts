'use server';

import sharp from 'sharp';

// Configurable image optimization function
export async function optimizeImage(
  buffer: Buffer,
  options: { width: number; quality: number; format: string },
): Promise<Buffer> {
  const { width, quality, format } = options;

  let optimizedBuffer = await sharp(buffer)
    .resize({ width }) // Resize to max width
    .toFormat(format as keyof sharp.FormatEnum, { quality }) // Convert to specified format
    .toBuffer();

  // Reduce quality dynamically if size exceeds 3MB, to a minimum quality threshold
  while (optimizedBuffer.byteLength > 1024 * 1024 * 3 && quality > 30) {
    optimizedBuffer = await sharp(buffer)
      .resize({ width })
      .toFormat(format as keyof sharp.FormatEnum, { quality: quality - 10 })
      .toBuffer();
  }

  return optimizedBuffer;
}
