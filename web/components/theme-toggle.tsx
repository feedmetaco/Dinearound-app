'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/use-theme';

export function ThemeToggle() {
  const { isLight, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--chip-fill)] text-[var(--text-secondary)] transition-transform hover:scale-105 active:scale-95"
    >
      {isLight ? <Moon size={16} strokeWidth={2.4} /> : <Sun size={16} strokeWidth={2.4} />}
    </button>
  );
}
