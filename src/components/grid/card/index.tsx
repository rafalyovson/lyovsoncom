import type {
  AriaRole,
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type GridCardBaseProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  role?: AriaRole;
  style?: CSSProperties;
  variant?: "default" | "content";
};

type GridCardProps<T extends ElementType> = GridCardBaseProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof GridCardBaseProps<T>>;

export const GridCard = <T extends ElementType = "div">({
  as,
  children,
  className,
  interactive = true,
  role,
  style,
  variant = "default",
  ...rest
}: GridCardProps<T>) => {
  const Component = (as ?? "div") as ElementType;

  const baseStyle: CSSProperties =
    variant === "default"
      ? {
          minHeight: "var(--grid-card-size)",
        }
      : {};

  const cardClassName = cn(
    "glass-card rounded-xl",
    "grid gap-2 p-2",
    variant === "default"
      ? "aspect-square grid-cols-3 grid-rows-3"
      : "auto-rows-auto grid-cols-1",
    interactive && "glass-interactive",
    className
  );

  return (
    <Component
      className={cardClassName}
      role={role ?? (Component === "div" ? "article" : undefined)}
      style={{ ...baseStyle, ...style }}
      {...(rest as ComponentPropsWithoutRef<T>)}
    >
      {children}
    </Component>
  );
};

export const GridCardContent = ({
  children,
  className,
  interactive,
  role,
  style,
  ...props
}: Omit<GridCardProps<"article">, "variant" | "as">) => {
  return (
    <GridCard
      as="article"
      className={cn("p-6", className)}
      interactive={interactive}
      role={role}
      style={style}
      variant="content"
      {...props}
    >
      {children}
    </GridCard>
  );
};
