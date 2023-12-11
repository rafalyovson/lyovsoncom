"use client";

import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ThemeSwitch: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isActive = theme === "light";

  const switchClasses = `flex items-center justify-center w-6 h-6 text-dark dark:text-light bg-light border border-dark dark:border-light dark:bg-dark rounded-full transform ${
    isActive ? "translate-x-0" : "translate-x-6"
  } transition-transform duration-500 ease-in-out`;

  return (
    <div
      className="relative w-14 h-8 rounded-full p-1 cursor-pointer bg-dark dark:bg-light transition-colors duration-500"
      onClick={toggleTheme}
    >
      <div
        className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform ${
          isActive ? "translate-x-6" : "translate-x-0"
        } transition-transform duration-500 ease-in-out`}
      />
      <div
        className={`absolute inset-0 flex items-center justify-center text-xs ${
          isActive ? "justify-end" : "justify-start"
        } transition-justify duration-500 ease-in-out`}
      >
        {isActive ? (
          <FontAwesomeIcon icon={faMoon} size="xl" className="text-beige" />
        ) : (
          <FontAwesomeIcon icon={faSun} size="xl" className="text-beige" />
        )}
      </div>
    </div>
  );
};

export default ThemeSwitch;
