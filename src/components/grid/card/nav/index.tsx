"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { GridCard } from "@/components/grid";
import { HeroMode } from "./hero-mode";
import { MenuMode } from "./menu-mode";
import { SearchMode } from "./search-mode";
import { SettingsMode } from "./settings-mode";
import type { MenuModeType } from "./types";

export const GridCardNav = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");
  const [menuMode, setMenuMode] = useState<MenuModeType>(
    search ? "search" : "hero"
  );
  return (
    <GridCard
      className={cn(
        "col-start-1 col-end-2 row-start-1 row-end-2 self-start",
        className
      )}
    >
      {
        {
          hero: <HeroMode setMenuMode={setMenuMode} />,
          search: <SearchMode setMenuMode={setMenuMode} />,
          menu: <MenuMode setMenuMode={setMenuMode} />,
          settings: <SettingsMode setMenuMode={setMenuMode} />,
        }[menuMode]
      }
    </GridCard>
  );
};

export { GridCardNavItem } from "./grid-card-nav-item";
