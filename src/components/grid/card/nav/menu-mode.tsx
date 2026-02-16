import {
  Atom,
  BriefcaseBusiness,
  FileText,
  Flower,
  Newspaper,
  Play,
  X,
} from "lucide-react";
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
        className="col-start-1 col-end-2 row-start-1 row-end-2"
        href="/posts"
        variant="link"
      >
        <Newspaper className="h-7 w-7" />
        <span>Posts</span>
      </GridCardNavItem>
      <GridCardNavItem
        className="col-start-2 col-end-3 row-start-1 row-end-2"
        href="/notes"
        variant="link"
      >
        <FileText className="h-7 w-7" />
        <span>Notes</span>
      </GridCardNavItem>
      <GridCardNavItem
        className="col-start-3 col-end-4 row-start-1 row-end-2"
        href="/activities"
        variant="link"
      >
        <Play className="h-7 w-7" />
        <span>Activities</span>
      </GridCardNavItem>
      <GridCardNavItem
        className="col-start-1 col-end-2 row-start-2 row-end-3"
        href="/jess"
        variant="link"
      >
        <Flower className="h-7 w-7" />
        <span>Jess</span>
      </GridCardNavItem>
      <GridCardNavItem
        className="col-start-2 col-end-3 row-start-2 row-end-3"
        href="/projects"
        variant="link"
      >
        <BriefcaseBusiness className="h-7 w-7" />
        <span>Projects</span>
      </GridCardNavItem>
      <GridCardNavItem
        className="col-start-3 col-end-4 row-start-2 row-end-3"
        href="/rafa"
        variant="link"
      >
        <Atom className="h-7 w-7" />
        <span>Rafa</span>
      </GridCardNavItem>
      <GridCardNavItem
        className="col-start-2 col-end-3 row-start-3 row-end-4"
        onClick={() => setMenuMode("hero")}
        variant="button"
      >
        <X className="h-7 w-7" />
        <span>Close</span>
      </GridCardNavItem>
    </>
  );
};
