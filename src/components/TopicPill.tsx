import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TopicPillProps {
  children: ReactNode;
  className?: string;
}

export function TopicPill({ children, className }: TopicPillProps) {
  return (
    <span
      className={cn(
        "glass-text-secondary inline-flex w-full items-center justify-center rounded-full border border-[var(--glass-border-hover)] bg-[color:var(--glass-bg-hover)] px-3 py-1 text-center font-semibold text-xs shadow-none transition-colors duration-300",
        "hover:bg-[color:var(--glass-bg-active)] hover:text-[var(--glass-text)]",
        className
      )}
    >
      {children}
    </span>
  );
}
