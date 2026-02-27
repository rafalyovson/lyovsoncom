import { Info, X } from "lucide-react";
import { GridCardSection } from "@/components/grid";
import { GridCardNavItem } from "@/components/grid/card/nav";
import { cn } from "@/lib/utils";
import type { SubscribeMode } from "./types";

interface InfoModeProps {
  message: string;
  setMode: (mode: SubscribeMode) => void;
}

export const InfoMode = ({ message, setMode }: InfoModeProps) => {
  return (
    <>
      <GridCardSection
        className={cn(
          "col-start-1 col-end-4 row-start-1 row-end-3 flex flex-col items-center justify-center gap-4 text-center"
        )}
      >
        <Info
          aria-label="Information"
          className="h-16 w-16"
          style={{ color: "var(--info)" }}
        />
        <h2
          className={cn("font-bold text-2xl")}
          style={{ color: "var(--info)" }}
        >
          Note
        </h2>
        <p className={cn("glass-text-secondary text-base")}>{message}</p>
      </GridCardSection>

      <GridCardNavItem
        className="col-start-2 col-end-3 row-start-3 row-end-4"
        onClick={() => {
          setMode("form");
        }}
        variant="button"
      >
        <X className="h-7 w-7" />
        <span>Close</span>
      </GridCardNavItem>
    </>
  );
};
