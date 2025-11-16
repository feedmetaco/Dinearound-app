import { create } from 'zustand';

interface FilterStore {
  cuisine: string | null;
  priceLevel: number | null;
  setCuisine: (cuisine: string | null) => void;
  setPriceLevel: (level: number | null) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  cuisine: null,
  priceLevel: null,
  setCuisine: (cuisine) => set({ cuisine }),
  setPriceLevel: (priceLevel) => set({ priceLevel }),
  reset: () => set({ cuisine: null, priceLevel: null }),
}));

