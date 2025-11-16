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
    <div className="group relative overflow-hidden rounded-2xl border border-[#6a994e]/30 bg-white/80 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-[#6a994e]/40 dark:bg-[#386641]/20">
      {restaurant.photo_url && (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-[#a7c957]/20 to-[#6a994e]/20">
          <img
            src={restaurant.photo_url}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#386641]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>
      )}
      {!restaurant.photo_url && (
        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-[#a7c957]/30 to-[#6a994e]/30">
          <span className="text-6xl">🍽️</span>
        </div>
      )}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-bold text-[#386641] dark:text-[#f2e8cf] line-clamp-1">{restaurant.name}</h3>
        {restaurant.address && (
          <p className="mb-3 text-sm text-[#6a994e] dark:text-[#a7c957] line-clamp-1">📍 {restaurant.address}</p>
        )}
        <div className="mb-4 flex items-center gap-3 text-sm">
          {restaurant.rating && (
            <span className="flex items-center gap-1 rounded-full bg-[#a7c957]/30 px-2.5 py-1 font-medium text-[#386641] backdrop-blur-sm dark:bg-[#a7c957]/20 dark:text-[#a7c957]">
              ⭐ {restaurant.rating.toFixed(1)}
            </span>
          )}
          {restaurant.price_level && (
            <span className="font-medium text-[#386641] dark:text-[#f2e8cf]">
              {'$'.repeat(restaurant.price_level)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/app/log?restaurant=${encodeURIComponent(restaurant.name)}`)}
            className="flex-1 rounded-lg bg-gradient-to-r from-[#386641] to-[#6a994e] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-[#2d5034] hover:to-[#5a8842] hover:shadow-lg active:scale-95"
          >
            Log Visit
          </button>
          <button
            onClick={handleAddToWishlist}
            disabled={isAdding}
            className="rounded-lg border-2 border-[#bc4749]/40 bg-white/50 px-3 py-2.5 text-sm font-medium text-[#bc4749] backdrop-blur-sm transition-all duration-200 hover:border-[#bc4749] hover:bg-[#bc4749]/10 disabled:opacity-50 dark:bg-[#bc4749]/10 dark:hover:bg-[#bc4749]/20 active:scale-95"
            aria-label="Add to wishlist"
          >
            {isAdding ? '...' : '⭐'}
          </button>
        </div>
      </div>
    </div>
  );
}

