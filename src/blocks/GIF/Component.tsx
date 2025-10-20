import type React from "react";
import { LazyVideo } from "@/components/LazyVideo";
import RichText from "@/components/RichText";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getTenorVideoUrl, normalizeAspectRatio } from "@/utilities/tenor";
import type { GIFBlock as GIFBlockType } from "./types";

/**
 * GIF Block - Optimized Video-Based Implementation
 *
 * Performance Optimizations:
 * - Converts Tenor GIF embeds to MP4/WebM video format
 * - Reduces file size by 80-85% (200 KiB GIF → 40 KiB MP4)
 * - Eliminates 50 KiB Tenor embed.js script
 * - Uses Intersection Observer for lazy loading
 * - Server-side rendering with Next.js caching
 * - Autoplay + loop + muted for GIF-like behavior
 *
 * Note: This is a server component that fetches video URLs
 * and passes them to the client-side LazyVideo component
 */
export const GIFBlock: React.FC<GIFBlockType> = async ({
  embedCode,
  caption,
}) => {
  if (!embedCode?.postId) {
    return null;
  }

  // Fetch video URLs from Tenor API (server-side, cached for 24 hours)
  const videoData = await getTenorVideoUrl(embedCode.postId);

  // Use provided aspect ratio or fall back to API data
  const aspectRatio = normalizeAspectRatio(
    embedCode.aspectRatio || videoData.aspectRatio
  );

  return (
    <Card className="glass-interactive glass-stagger-1 py-0 transition-all duration-300">
      <CardContent className="px-0">
        <div className="glass-media overflow-hidden rounded-lg">
          <LazyVideo
            mp4Src={videoData.mp4Url}
            webmSrc={videoData.webmUrl}
            poster={videoData.posterUrl}
            aspectRatio={aspectRatio}
            alt="Animated GIF"
          />
        </div>
      </CardContent>

      {caption && (
        <CardFooter
          className={cn(
            "glass-section rounded-lg p-2 transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-border-hover)] focus-visible:ring-offset-2",
            "hover:shadow-md"
          )}
        >
          <RichText
            className="glass-text-secondary w-full text-center text-sm italic"
            content={caption}
          />
        </CardFooter>
      )}
    </Card>
  );
};
