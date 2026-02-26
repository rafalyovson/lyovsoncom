/**
 * Tenor API Utility - Fetch Direct Video URLs
 *
 * Performance Optimizations:
 * - Converts Tenor GIF embeds to MP4/WebM video formats
 * - Reduces file size by 80-85% compared to GIF
 * - Eliminates 50 KiB Tenor embed.js script
 * - Uses Next.js caching (24 hour revalidation)
 */

interface TenorVideoData {
  aspectRatio: string;
  mp4Url: string;
  posterUrl: string;
  webmUrl?: string;
}

export { normalizeAspectRatio } from "@/utilities/aspectRatio";

/**
 * Fetch video URLs from Tenor API
 * Falls back to direct URL pattern if API is unavailable
 */
export async function getTenorVideoUrl(
  postId: string
): Promise<TenorVideoData> {
  const TENOR_REVALIDATE_SECONDS = 86_400;

  // If TENOR_API_KEY is available, use the official API
  if (process.env.TENOR_API_KEY) {
    try {
      const response = await fetch(
        `https://tenor.googleapis.com/v2/posts?ids=${postId}&key=${process.env.TENOR_API_KEY}`,
        {
          next: { revalidate: TENOR_REVALIDATE_SECONDS }, // 24 hour cache
        }
      );

      if (!response.ok) {
        throw new Error(`Tenor API error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.results?.[0];

      if (!result) {
        throw new Error("No results from Tenor API");
      }

      const media = result.media_formats;

      return {
        mp4Url: media.mp4?.url || media.tinygif?.url,
        webmUrl: media.webm?.url,
        posterUrl: media.tinygif_transparent?.url || media.tinygif?.url,
        aspectRatio: media.mp4?.dims
          ? `${media.mp4.dims[0]}:${media.mp4.dims[1]}`
          : "1:1",
      };
    } catch (_error) {
      // Fall through to direct URL pattern
    }
  }

  // Fallback: Use direct Tenor CDN URL pattern
  return getTenorDirectUrl(postId);
}

/**
 * Fallback method using Tenor's CDN URL pattern
 * This works without an API key but has less reliability
 */
function getTenorDirectUrl(postId: string): TenorVideoData {
  return {
    mp4Url: `https://media.tenor.com/${postId}/tenor.mp4`,
    webmUrl: `https://media.tenor.com/${postId}/tenor.webm`,
    posterUrl: `https://media.tenor.com/${postId}/tenor.gif`,
    aspectRatio: "1:1", // Default to square aspect ratio
  };
}

/**
 * Calculate aspect ratio from dimensions
 * @param dims - [width, height] array from Tenor API
 * @returns Aspect ratio as decimal string (e.g., "1.7777")
 */
export function calculateAspectRatio(dims: [number, number]): string {
  const [width, height] = dims;
  if (!(width && height) || height === 0) {
    return "1"; // Default to square
  }
  return String(width / height);
}
