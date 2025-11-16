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
        className="rounded-xl border-2 border-[#6a994e]/30 bg-white/70 px-4 py-2 text-sm font-medium text-[#386641] backdrop-blur-md transition-all focus:border-[#6a994e] focus:outline-none focus:ring-4 focus:ring-[#a7c957]/30 dark:border-[#6a994e]/40 dark:bg-[#386641]/20 dark:text-[#f2e8cf] dark:focus:border-[#a7c957]"
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
        className="rounded-xl border-2 border-[#6a994e]/30 bg-white/70 px-4 py-2 text-sm font-medium text-[#386641] backdrop-blur-md transition-all focus:border-[#6a994e] focus:outline-none focus:ring-4 focus:ring-[#a7c957]/30 dark:border-[#6a994e]/40 dark:bg-[#386641]/20 dark:text-[#f2e8cf] dark:focus:border-[#a7c957]"
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
          className="rounded-xl border-2 border-[#bc4749]/40 bg-white/70 px-4 py-2 text-sm font-medium text-[#bc4749] backdrop-blur-md transition-all hover:border-[#bc4749] hover:bg-[#bc4749]/10 dark:border-[#bc4749]/40 dark:bg-[#bc4749]/10 dark:text-[#bc4749] dark:hover:bg-[#bc4749]/20"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}

