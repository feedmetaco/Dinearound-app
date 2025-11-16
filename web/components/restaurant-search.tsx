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
          className="w-full rounded-2xl border-2 border-[#E8D5BC]/50 bg-[#FAF8F5] px-4 py-4 pl-12 text-base font-medium text-[#3D3935] shadow-lg transition-all focus:border-[#D4A59A] focus:outline-none focus:ring-4 focus:ring-[#D4A59A]/20 dark:border-[#524D47]/50 dark:bg-[#3D3935] dark:text-[#F2EFE9] dark:focus:border-[#D4A59A]"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        {!isFocused && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <kbd className="hidden rounded-lg border-2 border-[#E8D5BC]/50 bg-gradient-to-r from-[#F5E6D3]/30 to-[#E5C4BA]/30 px-2.5 py-1 text-xs font-bold text-[#D4A59A] shadow-sm dark:border-[#524D47]/50 dark:from-[#E8D5BC]/15 dark:to-[#D4A59A]/15 dark:text-[#E5C4BA] md:inline">
              ⌘K
            </kbd>
          </div>
        )}
      </div>
      <button
        onClick={onLocationRequest}
        className="mt-3 w-full rounded-2xl border-2 border-[#A8C4A5]/50 bg-gradient-to-r from-[#A8C4A5]/25 to-[#C8DCC5]/25 px-4 py-3 text-sm font-bold text-[#8FB08C] shadow-md transition-all hover:border-[#A8C4A5] hover:from-[#A8C4A5]/35 hover:to-[#C8DCC5]/35 hover:scale-105 active:scale-95 dark:border-[#A8C4A5]/40 dark:from-[#A8C4A5]/15 dark:to-[#C8DCC5]/15 dark:text-[#A8C4A5] dark:hover:border-[#A8C4A5]/60"
      >
        📍 Use my location
      </button>
    </div>
  );
}

