import { X } from "lucide-react";
import { GridCardNavItem } from "./grid-card-nav-item";
import { SearchInput } from "./search-input";
import { SiteTitleSection } from "./site-title-section";
import type { MenuModeType } from "./types";

export const SearchMode = ({
  setMenuMode,
}: {
  setMenuMode: (menuMode: MenuModeType) => void;
}) => {
  return (
    <>
      <SiteTitleSection />
      <GridCardNavItem
        className={"col-start-1 col-end-2 row-start-3 row-end-4"}
        onClick={() => setMenuMode("hero")}
      >
        <X className="h-7 w-7" />
        <span>Close</span>
      </GridCardNavItem>
      <SearchInput className="col-start-2 col-end-4 row-start-3 row-end-4" />
    </>
  );
};
