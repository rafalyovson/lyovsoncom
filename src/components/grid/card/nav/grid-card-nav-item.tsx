import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { GridCardSection } from "../section";

type GridCardNavItemBaseProps = {
  children: ReactNode;
  className?: string;
};

type GridCardNavItemLinkProps = GridCardNavItemBaseProps & {
  variant: "link";
  href: string;
};

type GridCardNavItemButtonProps = GridCardNavItemBaseProps & {
  variant: "button";
  onClick: () => void;
  disabled?: boolean;
};

type GridCardNavItemStaticProps = GridCardNavItemBaseProps & {
  variant?: "static";
};

type GridCardNavItemProps =
  | GridCardNavItemLinkProps
  | GridCardNavItemButtonProps
  | GridCardNavItemStaticProps;

export const GridCardNavItem = ({
  children,
  className,
  ...props
}: GridCardNavItemProps) => {
  if (props.variant === "link") {
    return (
      <GridCardSection className={cn("group", className)}>
        <Link
          className="glass-text flex h-full w-full flex-col items-center justify-center gap-2 transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
          href={props.href}
        >
          {children}
        </Link>
      </GridCardSection>
    );
  }

  if (props.variant === "button") {
    return (
      <GridCardSection
        className={cn(
          "glass-text flex h-full flex-col items-center justify-center gap-2",
          className
        )}
        disabled={props.disabled}
        mode="button"
        onClick={props.onClick}
      >
        {children}
      </GridCardSection>
    );
  }

  return (
    <GridCardSection
      className={cn(
        "glass-text flex h-full flex-col items-center justify-center gap-2",
        className
      )}
    >
      {children}
    </GridCardSection>
  );
};
