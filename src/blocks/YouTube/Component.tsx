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
 * - Supports flexible CSS aspect ratios (for example "16:9", "4:3", "1:1")
 *
 * Note: This implementation is equivalent to @next/third-parties/YouTubeEmbed
 * but includes custom styling and caption support specific to this design system.
 */

export function YouTubeBlock({
  videoId,
  caption,
  aspectRatio = "16:9",
}: YouTubeBlockType) {
  if (!videoId) {
    return null;
  }

  return (
    <Card className="glass-longform-block glass-interactive glass-stagger-1 gap-0 overflow-hidden py-0 transition-all duration-300">
      <CardContent className="p-0">
        <YouTubePlayer
          aspectRatio={aspectRatio || undefined}
          videoId={videoId}
        />
      </CardContent>

      {caption && (
        <CardFooter
          className={cn(
            "glass-section m-3 mt-2 rounded-lg px-4 py-2 transition-all duration-300 sm:px-5 sm:py-3",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-border-hover)] focus-visible:ring-offset-2",
            "hover:shadow-md"
          )}
          dir="auto"
        >
          <RichText
            className="glass-text-secondary w-full break-words text-center text-sm italic"
            content={caption}
            enableGutter={false}
            enableProse={false}
          />
        </CardFooter>
      )}
    </Card>
  );
}
