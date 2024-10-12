'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div
      className={`cursor-pointer h-full w-full flex justify-center items-center gap-2 flex-col`}
      onClick={toggleTheme}
    >
      {theme === 'light' ? <Moon w-7 h-7 /> : <Sun w-7 h-7 />}
      <span>{theme === 'light' ? 'Dark Side' : 'Light Side'}</span>
    </div>
  );
};

export default ThemeSwitch;
