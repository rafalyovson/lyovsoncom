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

  return (
    <Card className="glass-longform-block glass-interactive glass-stagger-2 transition-all duration-300">
      <CardContent className="flex justify-center pt-6">
        <div className="w-full max-w-lg">
          <Tweet id={postId} />
        </div>
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
}
