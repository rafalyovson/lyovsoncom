import RichText from "@/components/RichText";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { YouTubeBlock as YouTubeBlockType } from "@/payload-types";
import { YouTubePlayer } from "./YouTubePlayer";

/**
 * YouTube Block - Optimized Facade Pattern Implementation
 *
 * Performance Optimizations:
 * - Uses facade pattern (click-to-load) to defer YouTube iframe loading
 * - Shows lightweight thumbnail image until user interaction
 * - Eliminates ~1.5 MB YouTube player JavaScript on initial page load
 * - Only loads iframe when user clicks play button
 * - Custom glassmorphism styling with play button overlay
 * - Supports multiple aspect ratios (16:9, 4:3, 1:1)
 *
 * Note: This implementation is equivalent to @next/third-parties/YouTubeEmbed
 * but includes custom styling and caption support specific to this design system.
 */

export const YouTubeBlock = async ({
  videoId,
  caption,
  aspectRatio = "16:9",
}: YouTubeBlockType) => {
  if (!videoId) {
    return null;
  }

  return (
    <Card className="glass-interactive glass-stagger-1 transition-all duration-300">
      <CardContent className="p-4">
        <YouTubePlayer videoId={videoId} aspectRatio={aspectRatio || undefined} />
      </CardContent>

      {caption && (
        <CardFooter
          className={cn(
            "glass-section m-4 rounded-lg p-2 transition-all duration-300",
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
