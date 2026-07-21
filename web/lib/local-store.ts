'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isApiEnabled } from '@/lib/api-client';
import { syncWishlistToggle, syncDeleteVisitFromServer } from '@/lib/sync-service';

export interface LocalVisit {
  id: string;
  restaurantId: string;
  restaurantName: string;
  visitDate: string; // ISO date (yyyy-mm-dd)
  rating: number;
  notes: string;
  createdAt: string;
}

export interface LocalMenuItem {
  id: string;
  restaurantId: string;
  category: string;
  name: string;
  price: string;
}

interface DineAroundStore {
  isAuthenticated: boolean;
  isGuest: boolean;
  userEmail: string;
  wishlistIds: string[];
  visits: LocalVisit[];
  menuItems: LocalMenuItem[];

  signInEmail: (email: string) => void;
  continueAsGuest: () => void;
  signOut: () => void;

  toggleWishlist: (restaurantId: string) => void;
  isWishlisted: (restaurantId: string) => boolean;

  upsertVisit: (visit: Omit<LocalVisit, 'id' | 'createdAt'> & { id?: string }) => string;
  deleteVisit: (id: string) => void;

  setMenuItems: (restaurantId: string, items: Omit<LocalMenuItem, 'id' | 'restaurantId'>[]) => void;
}

function uid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useDineAroundStore = create<DineAroundStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isGuest: false,
      userEmail: '',
      wishlistIds: [],
      visits: [],
      menuItems: [],

      signInEmail: (email) =>
        set({ isAuthenticated: true, isGuest: false, userEmail: email || 'guest@dinearound.app' }),

      continueAsGuest: () => set({ isAuthenticated: true, isGuest: true, userEmail: 'Guest' }),

      signOut: () => set({ isAuthenticated: false, isGuest: false, userEmail: '' }),

      toggleWishlist: (restaurantId) =>
        set((state) => {
          const adding = !state.wishlistIds.includes(restaurantId);
          const wishlistIds = adding
            ? [...state.wishlistIds, restaurantId]
            : state.wishlistIds.filter((id) => id !== restaurantId);
          if (isApiEnabled() && state.isAuthenticated && !state.isGuest) {
            syncWishlistToggle(restaurantId, adding).catch(() => {});
          }
          return { wishlistIds };
        }),

      isWishlisted: (restaurantId) => get().wishlistIds.includes(restaurantId),

      upsertVisit: (visit) => {
        const existingId = visit.id;
        if (existingId) {
          set((state) => ({
            visits: state.visits.map((v) => (v.id === existingId ? { ...v, ...visit, id: existingId } : v)),
          }));
          return existingId;
        }
        const id = uid();
        set((state) => ({
          visits: [{ ...visit, id, createdAt: new Date().toISOString() }, ...state.visits],
        }));
        return id;
      },

      deleteVisit: (id) => {
        const state = get();
        if (isApiEnabled() && state.isAuthenticated && !state.isGuest) {
          syncDeleteVisitFromServer(id).catch(() => {});
        }
        set({ visits: state.visits.filter((v) => v.id !== id) });
      },

      setMenuItems: (restaurantId, items) =>
        set((state) => ({
          menuItems: [
            ...state.menuItems.filter((m) => m.restaurantId !== restaurantId),
            ...items.map((item) => ({ ...item, id: uid(), restaurantId })),
          ],
        })),
    }),
    { name: 'dinearound-store' }
  )
);
