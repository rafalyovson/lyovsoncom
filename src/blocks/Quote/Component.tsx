import type React from "react";
import RichText from "@/components/RichText";
import type { QuoteBlock as QuoteBlockType } from "@/payload-types";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
} & QuoteBlockType;

export const QuoteBlock: React.FC<Props> = ({
  className,
  quote,
  attribution,
}) => {
  return (
    <div className={cn("container", className)}>
      <blockquote className="glass-section glass-premium relative mt-0 mb-0 rounded-lg border-glass-border-hover border-l-4 py-6 pl-6 italic">
        <div className="glass-text-secondary text-xl leading-relaxed">
          <RichText content={quote} enableGutter={false} />
        </div>
        {attribution && (
          <footer className="glass-text-secondary mt-4 font-medium text-sm opacity-80">
            — {attribution}
          </footer>
        )}
        {/* Glass decorative element */}
        <div className="glass-badge absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full">
          <span className="text-glass-text-secondary text-lg">&ldquo;</span>
        </div>
      </blockquote>
    </div>
  );
};
