'use client';

import { useCallback, useState } from 'react';

const STORAGE_KEY = 'dinearound-theme';

function getInitialIsLight() {
  if (typeof document === 'undefined') return true;
  return !document.documentElement.classList.contains('dark');
}

export function useTheme() {
  // theme-init.js (beforeInteractive) applies the persisted class before this
  // component ever renders on the client, so a lazy initializer is sufficient —
  // no effect needed to sync state after the fact.
  const [isLight, setIsLight] = useState(getInitialIsLight);

  const toggle = useCallback(() => {
    setIsLight((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('light', next);
      document.documentElement.classList.toggle('dark', !next);
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'light' : 'dark');
      } catch {
        // ignore storage failures (private mode, etc.)
      }
      return next;
    });
  }, []);

  return { isLight, toggle };
}
