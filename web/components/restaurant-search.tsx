'use client';

import { useState, useRef, useEffect } from 'react';

interface RestaurantSearchProps {
  value: string;
  onChange: (value: string) => void;
  onLocationRequest: () => void;
}

export function RestaurantSearch({ value, onChange, onLocationRequest }: RestaurantSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for restaurants..."
          className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 pl-11 text-base shadow-sm transition-all focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-violet-600 dark:focus:ring-violet-950"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        {!isFocused && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <kbd className="hidden rounded-md border border-zinc-300 bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 md:inline">
              ⌘K
            </kbd>
          </div>
        )}
      </div>
      <button
        onClick={onLocationRequest}
        className="mt-3 w-full rounded-xl border-2 border-violet-200 bg-gradient-to-r from-violet-50 to-pink-50 px-4 py-2.5 text-sm font-medium text-violet-700 transition-all hover:border-violet-300 hover:from-violet-100 hover:to-pink-100 dark:border-violet-900 dark:from-violet-950 dark:to-pink-950 dark:text-violet-300 dark:hover:border-violet-800"
      >
        📍 Use my location
      </button>
    </div>
  );
}

