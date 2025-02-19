'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true); // Ce code ne s'exécute que côté client
  }, []);

  if (!mounted) {
    return null; // Retournez un rendu vide côté serveur
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-4 top-4"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Changer de thème"
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}