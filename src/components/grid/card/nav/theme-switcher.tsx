"use client";

import { SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { GridCardNavItem } from "./grid-card-nav-item";

type ThemeSwitcherProps = {
  className?: string;
};

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (mounted) {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  return (
    <GridCardNavItem
      className={cn("col-start-3 col-end-4 row-start-3 row-end-4", className)}
      onClick={toggleTheme}
    >
      <SunMoon className="h-7 w-7" />
      <span className="font-medium text-sm">Theme</span>
    </GridCardNavItem>
  );
};
