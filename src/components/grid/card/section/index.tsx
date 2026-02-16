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

  const sectionClassName = cn(
    "glass-section transition-glass",
    "hover:hover-float",
    "focus-visible:outline-none",
    isInteractive && "glass-interactive",
    shouldHandleWrapperInteraction && [
      "cursor-pointer",
      "active:scale-[0.98] active:transition-glass-fast",
    ],
    className
  );

  if (shouldHandleWrapperInteraction) {
    return (
      <button
        className={cn(
          sectionClassName,
          "h-full w-full appearance-none text-left"
        )}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    );
  }

  return <section className={sectionClassName}>{children}</section>;
};
