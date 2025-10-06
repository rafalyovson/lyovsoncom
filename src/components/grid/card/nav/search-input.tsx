import { Search } from "@/search/Component";
import { cn } from "@/utilities/cn";
import { GridCardNavItem } from "./grid-card-nav-item";

export const SearchInput = ({ className }: { className?: string }) => {
  return (
    <GridCardNavItem className={cn(" ", className)}>
      <Search className="w-full" />
    </GridCardNavItem>
  );
};
