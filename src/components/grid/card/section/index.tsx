import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GridCardSectionBaseProps {
  children: ReactNode;
  className?: string;
}

type GridCardSectionStaticProps = GridCardSectionBaseProps &
  Omit<ComponentPropsWithoutRef<"section">, "children" | "className"> & {
    mode?: "static";
  };

type GridCardSectionButtonProps = GridCardSectionBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> & {
    mode: "button";
  };

type GridCardSectionProps =
  | GridCardSectionStaticProps
  | GridCardSectionButtonProps;

function getSectionClassName(
  className: string | undefined,
  isInteractive: boolean
): string {
  return cn(
    "glass-section transition-glass",
    "focus-visible:outline-none",
    isInteractive && [
      "glass-interactive cursor-pointer",
      "active:scale-[0.98] active:transition-glass-fast",
    ],
    className
  );
}

export const GridCardSection = (props: GridCardSectionProps) => {
  if (props.mode === "button") {
    const {
      children: buttonChildren,
      className: buttonClassName,
      mode: _buttonMode,
      type,
      ...buttonProps
    } = props;
    const sectionClassName = getSectionClassName(buttonClassName, true);

    return (
      <button
        className={cn(
          sectionClassName,
          "h-full w-full appearance-none text-left"
        )}
        type={type ?? "button"}
        {...buttonProps}
      >
        {buttonChildren}
      </button>
    );
  }

  const {
    children: sectionChildren,
    className: sectionClassNameProp,
    mode: _sectionMode,
    ...sectionProps
  } = props;
  const sectionClassName = getSectionClassName(sectionClassNameProp, false);

  return (
    <section className={sectionClassName} {...sectionProps}>
      {sectionChildren}
    </section>
  );
};
