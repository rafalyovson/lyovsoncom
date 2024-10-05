import { BlobMeta } from '@/data/types/blob-meta';
import { head } from '@vercel/blob';
import { BlobOneResponse } from '@/data/actions/db-actions/blob/index';

export async function blobSelectOneByUrl(data: {
  url: string;
}): Promise<BlobOneResponse> {
  try {
    const blobMeta: BlobMeta = await head(data.url);
    return {
      success: true,
      blobMeta: blobMeta,
      message: 'Blob selected successfully',
    };
  } catch (error) {
    return {
      success: false,
      blobMeta: null,
      message: 'Failed to select blob',
      error,
    };
  }
}
