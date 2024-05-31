"use client";

import { Button } from "@/components/ui/button";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      aria-label="Toggle Theme"
      onClick={toggleTheme}
      title="Toggle Theme"
      variant={"secondary"}
    >
      <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
    </Button>
  );
};

export default ThemeSwitch;
