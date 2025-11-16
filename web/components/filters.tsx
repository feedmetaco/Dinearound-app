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
        className="rounded-2xl border-2 border-[#E8D5BC]/50 bg-[#FAF8F5] px-4 py-2.5 text-sm font-bold text-[#3D3935] shadow-md transition-all focus:border-[#D4A59A] focus:outline-none focus:ring-4 focus:ring-[#D4A59A]/20 hover:border-[#D4A59A] dark:border-[#524D47]/50 dark:bg-[#3D3935] dark:text-[#F2EFE9] dark:focus:border-[#D4A59A]"
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
        className="rounded-2xl border-2 border-[#E8D5BC]/50 bg-[#FAF8F5] px-4 py-2.5 text-sm font-bold text-[#3D3935] shadow-md transition-all focus:border-[#D4A59A] focus:outline-none focus:ring-4 focus:ring-[#D4A59A]/20 hover:border-[#D4A59A] dark:border-[#524D47]/50 dark:bg-[#3D3935] dark:text-[#F2EFE9] dark:focus:border-[#D4A59A]"
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
          className="rounded-2xl border-2 border-[#D69B9B]/50 bg-[#FAF8F5] px-4 py-2.5 text-sm font-bold text-[#C08F84] shadow-md transition-all hover:bg-[#D69B9B] hover:text-white hover:scale-105 active:scale-95 dark:border-[#D69B9B]/40 dark:bg-[#3D3935] dark:hover:bg-[#D69B9B]"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}

