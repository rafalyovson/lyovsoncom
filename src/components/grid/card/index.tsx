import type { ReactNode } from "react";

import { cn } from "@/utilities/cn";

export const GridCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid aspect-square h-[400px] w-[400px] grid-cols-3 grid-rows-3 gap-2 p-2",
        "glass-card glass-interactive rounded-xl",
        className
      )}
      role="article"
    >
      {children}
    </div>
  );
};
