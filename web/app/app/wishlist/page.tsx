'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Wishlist } from '@/types';
import { RestaurantCard } from '@/components/restaurant-card';

async function fetchWishlist(): Promise<Wishlist[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // TODO: Implement actual API call to fetch wishlist
  return [];
}

async function removeFromWishlist(id: string) {
  const supabase = createClient();
  // TODO: Implement actual API call to remove from wishlist
  return { id };
}

export default function WishlistPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="bg-gradient-to-r from-[#06D6A0] to-[#FFD23F] bg-clip-text text-3xl font-black text-transparent">Wishlist</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-2xl bg-gradient-to-r from-[#06D6A0] to-[#FFD23F] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
        >
          {showAddForm ? 'Cancel' : '+ Add Restaurant'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 rounded-3xl border-2 border-[#06D6A0]/30 bg-white p-6 shadow-lg dark:border-[#06D6A0]/20 dark:bg-[#262626]">
          <p className="font-medium text-[#737373] dark:text-[#A3A3A3]">
            TODO: Add restaurant search form here
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#06D6A0]/30 border-t-[#06D6A0]"></div>
          <p className="text-base font-bold text-[#06D6A0] dark:text-[#06D6A0]">Loading wishlist...</p>
        </div>
      )}

      {wishlist && wishlist.length === 0 && (
        <div className="rounded-3xl border-2 border-[#06D6A0]/30 bg-white p-10 text-center shadow-lg dark:border-[#06D6A0]/20 dark:bg-[#262626]">
          <span className="mb-4 inline-block text-6xl">⭐</span>
          <p className="mb-4 text-lg font-bold text-[#1A1A1A] dark:text-[#FFF8F0]">
            Your wishlist is empty. Add restaurants you want to visit!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded-2xl bg-gradient-to-r from-[#06D6A0] to-[#FFD23F] px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Add Your First Restaurant
          </button>
        </div>
      )}

      {wishlist && wishlist.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div key={item.id} className="relative">
              <RestaurantCard restaurant={item.restaurant || { name: 'Unknown' }} />
              <button
                onClick={() => removeMutation.mutate(item.id)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#EF476F] text-xl font-bold text-white shadow-lg transition-all hover:bg-[#E63861] hover:scale-110 active:scale-90"
                aria-label="Remove from wishlist"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

