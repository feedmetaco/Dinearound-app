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
    <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FFD23F]/30 bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#FF6B35]/50 dark:border-[#FFD23F]/20 dark:bg-[#262626]">
      {restaurant.photo_url && (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-[#FFD23F]/20 to-[#FF6B35]/20">
          <img
            src={restaurant.photo_url}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/50 to-transparent"></div>
        </div>
      )}
      {!restaurant.photo_url && (
        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-[#FFD23F] via-[#FF6B35] to-[#EF476F]">
          <span className="text-6xl">🍽️</span>
        </div>
      )}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-black text-[#1A1A1A] dark:text-[#FFF8F0] line-clamp-1">{restaurant.name}</h3>
        {restaurant.address && (
          <p className="mb-3 text-sm font-medium text-[#737373] dark:text-[#A3A3A3] line-clamp-1">📍 {restaurant.address}</p>
        )}
        <div className="mb-4 flex items-center gap-2 text-sm">
          {restaurant.rating && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FFD23F] to-[#FF6B35] px-3 py-1.5 font-bold text-white shadow-md">
              ⭐ {restaurant.rating.toFixed(1)}
            </span>
          )}
          {restaurant.price_level && (
            <span className="rounded-full bg-[#06D6A0]/20 px-3 py-1.5 font-bold text-[#06D6A0] dark:bg-[#06D6A0]/30">
              {'$'.repeat(restaurant.price_level)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/app/log?restaurant=${encodeURIComponent(restaurant.name)}`)}
            className="flex-1 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#EF476F] px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Log Visit
          </button>
          <button
            onClick={handleAddToWishlist}
            disabled={isAdding}
            className="rounded-2xl border-2 border-[#FFD23F] bg-white px-4 py-3 text-sm font-bold text-[#FFD23F] shadow-md transition-all duration-200 hover:bg-[#FFD23F] hover:text-white hover:scale-105 disabled:opacity-50 dark:bg-[#262626] dark:hover:bg-[#FFD23F] active:scale-95"
            aria-label="Add to wishlist"
          >
            {isAdding ? '...' : '⭐'}
          </button>
        </div>
      </div>
    </div>
  );
}

