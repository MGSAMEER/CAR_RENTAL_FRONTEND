'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '../layout/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-2 w-9 h-9" />; // Placeholder with same dimensions
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-700"
      aria-label="Toggle dark mode"
    >
      {theme === 'light' ? (
        <Moon size={20} className="animate-fade-in" />
      ) : (
        <Sun size={20} className="animate-fade-in" />
      )}
    </button>
  );
}
