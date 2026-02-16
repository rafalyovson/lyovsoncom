import type { BannerBlock as BannerBlockProps } from "src/payload-types";
import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
} & BannerBlockProps;

export function BannerBlock({ className, content, style }: Props) {
  const styleClasses = {
    info: "border-glass-border-hover bg-glass-bg",
    error: "border-red-400/50 bg-red-500/10 glass-bg",
    success: "border-green-400/50 bg-green-500/10 glass-bg",
    warning: "border-yellow-400/50 bg-yellow-500/10 glass-bg",
  };

  const iconClasses = {
    info: "💡",
    error: "⚠️",
    success: "✅",
    warning: "⚡",
  };

  return (
    <div className={cn("glass-longform-block mx-auto w-full", className)}>
      <div
        className={cn(
          "glass-section glass-interactive flex items-start gap-4 rounded-lg border-2 px-6 py-4 backdrop-blur-md transition-all duration-300",
          styleClasses[style || "info"]
        )}
      >
        {/* Icon indicator */}
        <div className="glass-badge mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
          <span className="text-lg">{iconClasses[style || "info"]}</span>
        </div>

        {/* Content */}
        <div className="glass-text flex-1">
          <RichText
            content={content}
            enableGutter={false}
            enableProse={false}
          />
        </div>
      </div>
    </div>
  );
}
