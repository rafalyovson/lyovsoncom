import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DungeonLinks } from "@/data/dungeon-links";
import { Settings } from "lucide-react";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        {DungeonLinks.map((link) => {
          return (
            <Tooltip key={link.name}>
              <TooltipTrigger>
                <Button
                  asChild
                  variant={"outline"}
                  size="icon"
                  className="h-8 w-8 "
                >
                  <Link href={link.url} className="">
                    {link.icon}
                    <span className="sr-only">{link.name}</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{link.name}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Castle</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Castle</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
};
