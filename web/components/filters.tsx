'use client';

import { useFilterStore } from '@/stores/filter-store';

const cuisines = [
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'French',
  'American',
  'Mediterranean',
  'Korean',
];

export function Filters() {
  const { cuisine, priceLevel, setCuisine, setPriceLevel, reset } = useFilterStore();

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <select
        value={cuisine || ''}
        onChange={(e) => setCuisine(e.target.value || null)}
        className="rounded-lg border-2 border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-foreground transition-all focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-violet-600 dark:focus:ring-violet-950"
      >
        <option value="">All Cuisines</option>
        {cuisines.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={priceLevel || ''}
        onChange={(e) => setPriceLevel(e.target.value ? Number(e.target.value) : null)}
        className="rounded-lg border-2 border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-foreground transition-all focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-violet-600 dark:focus:ring-violet-950"
      >
        <option value="">All Prices</option>
        <option value="1">$ - Budget</option>
        <option value="2">$$ - Moderate</option>
        <option value="3">$$$ - Pricey</option>
        <option value="4">$$$$ - Luxury</option>
      </select>

      {(cuisine || priceLevel) && (
        <button
          onClick={reset}
          className="rounded-lg border-2 border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}

