"use server";

/**
 * Server Actions for GIF Block
 *
 * These actions handle Tenor API interactions server-side
 * to keep API keys secure and enable proper caching
 */

interface TenorMediaFormat {
  url: string;
  dims: [number, number];
}

interface TenorResult {
  id: string;
  media_formats: {
    tinygif: TenorMediaFormat;
    mp4: TenorMediaFormat;
  };
}

interface TenorSearchResponse {
  results: TenorResult[];
}

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

  try {
    const response = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${process.env.TENOR_API_KEY}&limit=12&media_filter=tinygif,mp4`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Tenor API error: ${response.status}`);
    }

    const data: TenorSearchResponse = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Tenor search failed:", error);
    throw error;
  }
}
