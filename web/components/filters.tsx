'use client';

import { Utensils, DollarSign, X } from 'lucide-react';
import { cuisines } from '@/lib/seed-data';

interface FiltersProps {
  cuisine: string;
  priceLevel: number | null;
  onCuisineChange: (cuisine: string) => void;
  onPriceChange: (level: number | null) => void;
  onReset: () => void;
}

export function Filters({ cuisine, priceLevel, onCuisineChange, onPriceChange, onReset }: FiltersProps) {
  const isFiltered = cuisine !== 'All Cuisines' || priceLevel !== null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Utensils size={13} strokeWidth={2.4} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <select
          value={cuisine}
          onChange={(e) => onCuisineChange(e.target.value)}
          className="input-field appearance-none py-2.5 pl-9 pr-4 text-sm font-bold"
        >
          <option value="All Cuisines">All Cuisines</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <DollarSign size={13} strokeWidth={2.4} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <select
          value={priceLevel ?? ''}
          onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : null)}
          className="input-field appearance-none py-2.5 pl-9 pr-4 text-sm font-bold"
        >
          <option value="">All Prices</option>
          <option value="1">$ Budget</option>
          <option value="2">$$ Moderate</option>
          <option value="3">$$$ Pricey</option>
          <option value="4">$$$$ Luxury</option>
        </select>
      </div>

      {isFiltered && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 rounded-full px-3 py-2 text-xs font-bold transition-colors"
          style={{ color: 'var(--accent-coral)' }}
        >
          <X size={12} strokeWidth={2.6} />
          Clear
        </button>
      )}
    </div>
  );
}
