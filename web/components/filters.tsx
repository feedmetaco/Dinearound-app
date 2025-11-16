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
        className="rounded-2xl border-2 border-[#FFD23F]/40 bg-white px-4 py-2.5 text-sm font-bold text-[#1A1A1A] shadow-md transition-all focus:border-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 hover:border-[#FF6B35] dark:border-[#FFD23F]/30 dark:bg-[#262626] dark:text-[#FFF8F0] dark:focus:border-[#FFD23F]"
      >
        <option value="">🍴 All Cuisines</option>
        {cuisines.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={priceLevel || ''}
        onChange={(e) => setPriceLevel(e.target.value ? Number(e.target.value) : null)}
        className="rounded-2xl border-2 border-[#FFD23F]/40 bg-white px-4 py-2.5 text-sm font-bold text-[#1A1A1A] shadow-md transition-all focus:border-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 hover:border-[#FF6B35] dark:border-[#FFD23F]/30 dark:bg-[#262626] dark:text-[#FFF8F0] dark:focus:border-[#FFD23F]"
      >
        <option value="">💰 All Prices</option>
        <option value="1">$ - Budget</option>
        <option value="2">$$ - Moderate</option>
        <option value="3">$$$ - Pricey</option>
        <option value="4">$$$$ - Luxury</option>
      </select>

      {(cuisine || priceLevel) && (
        <button
          onClick={reset}
          className="rounded-2xl border-2 border-[#EF476F]/40 bg-white px-4 py-2.5 text-sm font-bold text-[#EF476F] shadow-md transition-all hover:bg-[#EF476F] hover:text-white hover:scale-105 active:scale-95 dark:border-[#EF476F]/30 dark:bg-[#262626] dark:hover:bg-[#EF476F]"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}

