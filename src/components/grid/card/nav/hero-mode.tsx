import { LucideMenu, Search, Settings } from "lucide-react";

import { GridCardNavItem } from "./grid-card-nav-item";
import { SiteTitleSection } from "./site-title-section";
import type { MenuModeType } from "./types";

export const HeroMode = ({
  setMenuMode,
}: {
  setMenuMode: (menuMode: MenuModeType) => void;
}) => {
  return (
    <>
      <SiteTitleSection />

      <GridCardNavItem
        className="col-start-1 col-end-2 row-start-3 row-end-4"
        onClick={() => {
          setMenuMode("search");
        }}
      >
        <Search className="h-7 w-7" />
        <span>Search</span>
      </GridCardNavItem>
      <GridCardNavItem
        className="col-start-2 col-end-3 row-start-3 row-end-4"
        onClick={() => {
          setMenuMode("menu");
        }}
      >
        <LucideMenu className="h-7 w-7" />
        <span>Menu</span>
      </GridCardNavItem>
      <GridCardNavItem
        className="col-start-3 col-end-4 row-start-3 row-end-4"
        onClick={() => {
          setMenuMode("settings");
        }}
      >
        <Settings className="h-7 w-7" />
        <span>Settings</span>
      </GridCardNavItem>
    </>
  );
};
