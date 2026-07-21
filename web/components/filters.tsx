'use client';

import { X } from 'lucide-react';
import { cuisines } from '@/lib/seed-data';

interface FiltersProps {
  cuisine: string;
  priceLevel: number | null;
  onCuisineChange: (cuisine: string) => void;
  onPriceChange: (level: number | null) => void;
  onReset: () => void;
}

const priceOptions = [
  { level: 1, label: '$' },
  { level: 2, label: '$$' },
  { level: 3, label: '$$$' },
  { level: 4, label: '$$$$' },
];

/** Horizontal pill filter rows (DONESKI "All / Cuisine" chip pattern) replacing native <select>s. */
export function Filters({ cuisine, priceLevel, onCuisineChange, onPriceChange, onReset }: FiltersProps) {
  const isFiltered = cuisine !== 'All Cuisines' || priceLevel !== null;

  return (
    <div className="space-y-2.5">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        <button
          onClick={() => onCuisineChange('All Cuisines')}
          data-active={cuisine === 'All Cuisines'}
          className="filter-pill"
        >
          All
        </button>
        {cuisines.map((c) => (
          <button key={c} onClick={() => onCuisineChange(c)} data-active={cuisine === c} className="filter-pill">
            {c}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        <button onClick={() => onPriceChange(null)} data-active={priceLevel === null} className="filter-pill">
          Any price
        </button>
        {priceOptions.map((p) => (
          <button
            key={p.level}
            onClick={() => onPriceChange(p.level)}
            data-active={priceLevel === p.level}
            className="filter-pill"
          >
            {p.label}
          </button>
        ))}

        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-full px-3 py-2 text-xs font-bold"
            style={{ color: 'var(--accent-coral)' }}
          >
            <X size={12} strokeWidth={2.6} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
