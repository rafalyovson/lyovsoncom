import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";
import type { BannerBlock as BannerBlockProps } from "@/payload-types";

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
          "glass-section glass-interactive flex items-start gap-3 rounded-xl border-2 px-5 py-5 backdrop-blur-md transition-all duration-300 sm:gap-4 sm:px-6",
          styleClasses[style || "info"]
        )}
      >
        {/* Icon indicator */}
        <div className="glass-badge mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
          <span className="text-lg">{iconClasses[style || "info"]}</span>
        </div>

        {/* Content */}
        <div className="glass-text min-w-0 flex-1" dir="auto">
          <RichText
            className="text-sm leading-relaxed sm:text-base"
            content={content}
            enableGutter={false}
            enableProse={false}
          />
        </div>
      </div>
    </div>
  );
}
