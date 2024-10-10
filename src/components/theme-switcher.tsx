'use client';

import { Button } from '@/components/shadcn/ui/button';
import { useTheme } from 'next-themes';

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      aria-label="Toggle Theme"
      onClick={toggleTheme}
      title="Toggle Theme"
      variant={'secondary'}
      size={'icon'}
    >
      {theme === 'light' ? (
        <span className={`text-lg`}>🌒</span>
      ) : (
        <span className={`text-lg`}>🌞</span>
      )}
    </Button>
  );
};

export default ThemeSwitch;
