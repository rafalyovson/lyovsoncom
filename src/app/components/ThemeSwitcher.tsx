"use client";

import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";

const ThemeSwitch: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const switchClasses = `flex items-center justify-center w-6 h-6 text-dark dark:text-light bg-light border border-dark dark:border-light dark:bg-dark rounded-full transition-all duration-500 transform ${
    theme === "light" ? "rotate-180" : ""
  }`;

  return (
    <button
      className={switchClasses}
      onClick={toggleTheme}
      title="Toggle Theme"
    >
      <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
    </button>
  );
};

export default ThemeSwitch;
