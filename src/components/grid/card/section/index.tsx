import type { ReactNode } from "react";

import { cn } from "@/utilities/cn";

type GridCardSectionProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
};

export const GridCardSection = ({
  children,
  className,
  onClick,
  interactive,
}: GridCardSectionProps) => {
  const isInteractive = interactive || !!onClick;

  return (
    <section
      className={cn(
        "glass-section transition-glass",
        // Enhanced glassmorphism with no grey hover
        "hover:glass-section-hover hover:hover-float",
        // Focus states
        "focus-visible:glass-section-hover focus-visible:outline-none",
        // Interactive states
        isInteractive && [
          "cursor-pointer",
          // Active state for better feedback
          "active:scale-[0.98] active:transition-glass-fast",
        ],
        className
      )}
      onClick={onClick}
      {...(isInteractive && {
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        },
      })}
    >
      {children}
    </section>
  );
};
