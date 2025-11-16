'use client';

import { Restaurant } from '@/types';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface RestaurantCardProps {
  restaurant: Restaurant | any;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToWishlist = async () => {
    setIsAdding(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    // TODO: Implement add to wishlist API
    setIsAdding(false);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800/60 dark:bg-zinc-900">
      {restaurant.photo_url && (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-950 dark:to-pink-950">
          <img
            src={restaurant.photo_url}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>
      )}
      {!restaurant.photo_url && (
        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-950 dark:to-pink-950">
          <span className="text-6xl">🍽️</span>
        </div>
      )}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-bold text-foreground line-clamp-1">{restaurant.name}</h3>
        {restaurant.address && (
          <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">📍 {restaurant.address}</p>
        )}
        <div className="mb-4 flex items-center gap-3 text-sm">
          {restaurant.rating && (
            <span className="flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              ⭐ {restaurant.rating.toFixed(1)}
            </span>
          )}
          {restaurant.price_level && (
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {'$'.repeat(restaurant.price_level)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/app/log?restaurant=${encodeURIComponent(restaurant.name)}`)}
            className="flex-1 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-violet-700 hover:to-pink-700 hover:shadow-lg active:scale-95"
          >
            Log Visit
          </button>
          <button
            onClick={handleAddToWishlist}
            disabled={isAdding}
            className="rounded-lg border-2 border-violet-200 px-3 py-2.5 text-sm font-medium text-violet-600 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 disabled:opacity-50 dark:border-violet-800 dark:text-violet-400 dark:hover:border-violet-700 dark:hover:bg-violet-950 active:scale-95"
            aria-label="Add to wishlist"
          >
            {isAdding ? '...' : '⭐'}
          </button>
        </div>
      </div>
    </div>
  );
}

