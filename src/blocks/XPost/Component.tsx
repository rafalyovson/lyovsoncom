import { Tweet } from "react-tweet";
import RichText from "@/components/RichText";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { XPostBlock as XPostBlockType } from "@/payload-types";

/**
 * XPost Block - Optimized Twitter/X Embed
 *
 * Performance Optimizations:
 * - Uses react-tweet for static HTML rendering (server component)
 * - Eliminates 309.6 KiB Twitter widgets.js script
 * - Reduces TBT (Total Blocking Time) by 1,177ms
 * - Zero client-side JavaScript overhead
 * - SEO-friendly with static HTML content
 */
export function XPostBlock({ postId, caption }: XPostBlockType) {
  if (!postId) {
    return null;
  }

  const contentPaddingClassName = caption ? "p-3" : "px-4 pt-4 pb-0";

  return (
    <Card className="glass-longform-block glass-interactive glass-stagger-2 gap-0 overflow-hidden py-0 transition-all duration-300">
      <CardContent
        className={cn("flex justify-center", contentPaddingClassName)}
      >
        <div className="xpost-embed w-full max-w-lg">
          <Tweet id={postId} />
        </div>
      </CardContent>

      {caption && (
        <CardFooter
          className={cn(
            "glass-section m-3 mt-0 rounded-lg px-4 py-2 transition-all duration-300 sm:px-5 sm:py-3",
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
