import { ShieldUser, X } from "lucide-react";
import Link from "next/link";
import { GridCardNavItem } from "./grid-card-nav-item";
import { ThemeSwitcher } from "./theme-switcher";
import type { MenuModeType } from "./types";

export const SettingsMode = ({
  setMenuMode,
}: {
  setMenuMode: (menuMode: MenuModeType) => void;
}) => {
  return (
    <>
      <GridCardNavItem
        className={"col-start-1 col-end-2 row-start-1 row-end-2"}
      >
        <AdminLink />
      </GridCardNavItem>
      <ThemeSwitcher
        className={"col-start-2 col-end-3 row-start-2 row-end-3"}
      />
      <GridCardNavItem
        className={"col-start-3 col-end-4 row-start-3 row-end-4"}
        onClick={() => setMenuMode("hero")}
      >
        <X className="h-7 w-7" />
        <span>Close</span>
      </GridCardNavItem>
    </>
  );
};

const AdminLink = () => {
  return (
    <Link
      className="flex flex-col items-center justify-center gap-2"
      href="/admin"
    >
      <ShieldUser className="h-7 w-7" />
      <span>Admin</span>
    </Link>
  );
};
