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
          className="w-full rounded-2xl border-2 border-[#FFD23F]/40 bg-white px-4 py-4 pl-12 text-base font-medium text-[#1A1A1A] shadow-lg transition-all focus:border-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 dark:border-[#FFD23F]/30 dark:bg-[#262626] dark:text-[#FFF8F0] dark:focus:border-[#FFD23F]"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        {!isFocused && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <kbd className="hidden rounded-lg border-2 border-[#FFD23F]/40 bg-gradient-to-r from-[#FFD23F]/20 to-[#FF6B35]/20 px-2.5 py-1 text-xs font-bold text-[#FF6B35] shadow-sm dark:border-[#FFD23F]/30 dark:from-[#FFD23F]/10 dark:to-[#FF6B35]/10 dark:text-[#FFD23F] md:inline">
              ⌘K
            </kbd>
          </div>
        )}
      </div>
      <button
        onClick={onLocationRequest}
        className="mt-3 w-full rounded-2xl border-2 border-[#06D6A0]/40 bg-gradient-to-r from-[#06D6A0]/20 to-[#FFD23F]/20 px-4 py-3 text-sm font-bold text-[#06D6A0] shadow-md transition-all hover:border-[#06D6A0] hover:from-[#06D6A0]/30 hover:to-[#FFD23F]/30 hover:scale-105 active:scale-95 dark:border-[#06D6A0]/30 dark:from-[#06D6A0]/10 dark:to-[#FFD23F]/10 dark:text-[#06D6A0] dark:hover:border-[#06D6A0]/50"
      >
        📍 Use my location
      </button>
    </div>
  );
}

