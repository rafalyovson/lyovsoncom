"use client";

import Button from "@/app/ui/Button";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const switchClasses = `flex items-center justify-center rounded-full size-12 `;

  return (
    <Button
      aria-label="Toggle Theme"
      className={switchClasses}
      onClick={toggleTheme}
      title="Toggle Theme"
    >
      <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
    </Button>
  );
};

export default ThemeSwitch;
