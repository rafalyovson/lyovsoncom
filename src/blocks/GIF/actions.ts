"use server";

/**
 * Server Actions for GIF Block
 *
 * These actions handle Tenor API interactions server-side
 * to keep API keys secure and enable proper caching
 */

type TenorMediaFormat = {
  url: string;
  dims: [number, number];
};

type TenorResult = {
  id: string;
  media_formats: {
    tinygif: TenorMediaFormat;
    mp4: TenorMediaFormat;
    webm?: TenorMediaFormat;
    tinygif_transparent?: TenorMediaFormat;
  };
};

export type GifVideoData = {
  mp4Url: string;
  webmUrl?: string;
  posterUrl: string;
  aspectRatio: string;
};

type TenorSearchResponse = {
  results: TenorResult[];
};

/**
 * Search for GIFs on Tenor
 * @param query - Search query string
 * @returns Array of GIF results with thumbnails and metadata
 */
export async function searchGifs(query: string): Promise<TenorResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  if (!process.env.TENOR_API_KEY) {
    throw new Error("TENOR_API_KEY not configured");
  }

  const response = await fetch(
    `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${process.env.TENOR_API_KEY}&limit=12&media_filter=tinygif,mp4,webm`,
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );

  if (!response.ok) {
    throw new Error(`Tenor API error: ${response.status}`);
  }

  const data: TenorSearchResponse = await response.json();

  return data.results || [];
}

/**
 * Get full video URLs for a GIF from Tenor result
 * @param result - Tenor search result
 * @returns Video URLs and metadata
 */
// biome-ignore lint/suspicious/useAwait: server actions in "use server" files must be async
export async function extractVideoUrls(
  result: TenorResult
): Promise<GifVideoData> {
  const media = result.media_formats;

  // Calculate aspect ratio from MP4 dimensions
  const [width, height] = media.mp4?.dims || [];
  const aspectRatio = width && height ? String(width / height) : "1";

  return {
    mp4Url: media.mp4?.url || "",
    webmUrl: media.webm?.url,
    posterUrl: media.tinygif_transparent?.url || media.tinygif?.url || "",
    aspectRatio,
  };
}

/**
 * Fetch GIF data by Tenor post ID (for legacy format support)
 * @param postId - Tenor post ID
 * @returns Video URLs and metadata
 */
export async function fetchGifByPostId(postId: string): Promise<GifVideoData> {
  if (!postId || postId.trim().length === 0) {
    throw new Error("Post ID is required");
  }

  if (!process.env.TENOR_API_KEY) {
    throw new Error("TENOR_API_KEY not configured");
  }

  const response = await fetch(
    `https://tenor.googleapis.com/v2/posts?ids=${postId}&key=${process.env.TENOR_API_KEY}&media_filter=tinygif,mp4,webm`,
    {
      next: { revalidate: 86_400 }, // Cache for 24 hours
    }
  );

  if (!response.ok) {
    throw new Error(`Tenor API error: ${response.status}`);
  }

  const data = await response.json();
  const result = data.results?.[0];

  if (!result) {
    throw new Error("GIF not found");
  }

  return extractVideoUrls(result);
}
