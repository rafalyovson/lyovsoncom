import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type GridCardSectionProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  asChild?: boolean;
};

export const GridCardSection = ({
  children,
  className,
  onClick,
  interactive,
  asChild,
}: GridCardSectionProps) => {
  const isInteractive = interactive || !!onClick;
  const shouldHandleWrapperInteraction = isInteractive && !asChild;

  return (
    <section
      className={cn(
        "glass-section transition-glass",
        "hover:hover-float",
        "focus-visible:outline-none",
        isInteractive && "glass-interactive",
        // Interactive states
        shouldHandleWrapperInteraction && [
          "cursor-pointer",
          // Active state for better feedback
          "active:scale-[0.98] active:transition-glass-fast",
        ],
        className
      )}
      onClick={onClick}
      {...(shouldHandleWrapperInteraction && {
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        },
        onKeyUp: (e) => {
          if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
          }
        },
      })}
    >
      {children}
    </section>
  );
};
