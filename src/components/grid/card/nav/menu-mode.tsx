import { Atom, Flower, Newspaper, X } from "lucide-react";

import { GridCardNavItem } from "./grid-card-nav-item";
import type { MenuModeType } from "./types";

export const MenuMode = ({
  setMenuMode,
}: {
  setMenuMode: (menuMode: MenuModeType) => void;
}) => {
  return (
    <>
      <GridCardNavItem
        className={"col-start-2 col-end-3 row-start-1 row-end-2"}
        onClick={() => setMenuMode("hero")}
      >
        <Newspaper className="h-7 w-7" />
        <span>Posts</span>
      </GridCardNavItem>
      <GridCardNavItem
        className="col-start-1 col-end-2 row-start-2 row-end-3"
        link="/jess"
      >
        <Flower className="h-7 w-7" />
        <span>Jess</span>
      </GridCardNavItem>
      <GridCardNavItem
        className={"col-start-2 col-end-3 row-start-3 row-end-4"}
        onClick={() => setMenuMode("hero")}
      >
        <X className="h-7 w-7" />
        <span>Close</span>
      </GridCardNavItem>
      <GridCardNavItem
        className="col-start-3 col-end-4 row-start-2 row-end-3"
        link="/rafa"
      >
        <Atom className="h-7 w-7" />
        <span>Rafa</span>
      </GridCardNavItem>
    </>
  );
};
