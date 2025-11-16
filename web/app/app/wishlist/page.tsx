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
        <h2 className="text-2xl font-bold text-foreground">Wishlist</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          {showAddForm ? 'Cancel' : '+ Add Restaurant'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">
            TODO: Add restaurant search form here
          </p>
        </div>
      )}

      {isLoading && (
        <div className="text-center text-zinc-600 dark:text-zinc-400">Loading wishlist...</div>
      )}

      {wishlist && wishlist.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            Your wishlist is empty. Add restaurants you want to visit!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Add Your First Restaurant
          </button>
        </div>
      )}

      {wishlist && wishlist.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div key={item.id} className="relative">
              <RestaurantCard restaurant={item.restaurant || { name: 'Unknown' }} />
              <button
                onClick={() => removeMutation.mutate(item.id)}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
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

