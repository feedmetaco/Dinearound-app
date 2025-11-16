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
          className="w-full rounded-2xl border-2 border-[#6a994e]/30 bg-white/70 px-4 py-3 pl-11 text-base shadow-md backdrop-blur-md transition-all focus:border-[#6a994e] focus:outline-none focus:ring-4 focus:ring-[#a7c957]/30 dark:border-[#6a994e]/40 dark:bg-[#386641]/20 dark:text-[#f2e8cf] dark:focus:border-[#a7c957] dark:focus:ring-[#a7c957]/20"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        {!isFocused && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <kbd className="hidden rounded-lg border border-[#6a994e]/30 bg-[#f2e8cf]/80 px-2 py-1 text-xs font-semibold text-[#386641] shadow-sm backdrop-blur-sm dark:border-[#6a994e]/40 dark:bg-[#386641]/40 dark:text-[#a7c957] md:inline">
              ⌘K
            </kbd>
          </div>
        )}
      </div>
      <button
        onClick={onLocationRequest}
        className="mt-3 w-full rounded-2xl border-2 border-[#a7c957]/40 bg-gradient-to-r from-[#a7c957]/20 to-[#6a994e]/20 px-4 py-2.5 text-sm font-semibold text-[#386641] backdrop-blur-md transition-all hover:border-[#a7c957] hover:from-[#a7c957]/30 hover:to-[#6a994e]/30 dark:border-[#a7c957]/30 dark:from-[#a7c957]/10 dark:to-[#6a994e]/10 dark:text-[#a7c957] dark:hover:border-[#a7c957]/50"
      >
        📍 Use my location
      </button>
    </div>
  );
}

