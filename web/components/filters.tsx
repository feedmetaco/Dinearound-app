'use client';

import { ChevronDown, X } from 'lucide-react';
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

/** Single-row filter bar: scrollable cuisine pills + a price dropdown (no second heavy pill row). */
export function Filters({ cuisine, priceLevel, onCuisineChange, onPriceChange, onReset }: FiltersProps) {
  const isFiltered = cuisine !== 'All Cuisines' || priceLevel !== null;

  return (
    <div className="flex items-center gap-2">
      <div className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none]">
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

      <div className="relative shrink-0">
        <select
          value={priceLevel ?? ''}
          onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : null)}
          className="filter-pill appearance-none pr-7"
          data-active={priceLevel !== null}
          aria-label="Filter by price"
        >
          <option value="">Any price</option>
          {priceOptions.map((p) => (
            <option key={p.level} value={p.level}>
              {p.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          strokeWidth={2.4}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
          style={{ color: priceLevel !== null ? 'white' : 'var(--text-secondary)' }}
        />
      </div>

      {isFiltered && (
        <button
          onClick={onReset}
          aria-label="Clear filters"
          className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-2 text-xs font-bold"
          style={{ color: 'var(--accent-coral)' }}
        >
          <X size={12} strokeWidth={2.6} />
        </button>
      )}
    </div>
  );
}
