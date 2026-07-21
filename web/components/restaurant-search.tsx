'use client';

import { useRef } from 'react';
import { Search, X } from 'lucide-react';

interface RestaurantSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function RestaurantSearch({ value, onChange }: RestaurantSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <Search
        size={18}
        strokeWidth={2.4}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for restaurants..."
        className="input-field w-full py-4 pl-12 pr-10 text-base font-medium"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--accent-coral)]"
        >
          <X size={16} strokeWidth={2.4} />
        </button>
      )}
    </div>
  );
}
