import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { GridCardSection } from "../section";

type GridCardNavItemProps = {
  children: ReactNode;
  link?: string;
  onClick?: () => void;
  className?: string;
};

export const GridCardNavItem = ({
  children,
  link,
  onClick,
  className,
}: GridCardNavItemProps) => {
  if (link) {
    return (
      <GridCardSection asChild className={cn("group", className)} interactive>
        <Link
          className="glass-text flex h-full flex-col items-center justify-center gap-2 transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
          href={link}
        >
          {children}
        </Link>
      </GridCardSection>
    );
  }
  return (
    <GridCardSection
      className={cn(
        "glass-text flex h-full cursor-pointer flex-col items-center justify-center gap-2",
        className
      )}
      interactive
      onClick={onClick}
    >
      {children}
    </GridCardSection>
  );
};
