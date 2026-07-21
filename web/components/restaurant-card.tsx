'use client';

import Link from 'next/link';
import { Star, BookOpen } from 'lucide-react';
import { LocalRestaurant, priceSymbols } from '@/lib/seed-data';
import { useDineAroundStore } from '@/lib/local-store';
import { syncWishlistToggle } from '@/lib/sync-service';

interface RestaurantCardProps {
  restaurant: LocalRestaurant;
  showDistance?: boolean;
}

export function RestaurantCard({ restaurant, showDistance }: RestaurantCardProps) {
  const isWishlisted = useDineAroundStore((s) => s.wishlistIds.includes(restaurant.id));
  const toggleWishlist = useDineAroundStore((s) => s.toggleWishlist);

  return (
    <div className="card-surface flex items-center gap-3 p-3 transition-transform hover:-translate-y-0.5">
      <Link
        href={`/app/restaurant/${restaurant.id}`}
        className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[18px] text-3xl"
        style={{ background: 'linear-gradient(135deg, var(--accent-coral), var(--brand-green))' }}
      >
        {restaurant.emoji}
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={`/app/restaurant/${restaurant.id}`}>
          <h3 className="truncate text-[15px] font-extrabold" style={{ color: 'var(--foreground)' }}>
            {restaurant.name}
          </h3>
        </Link>
        <p className="truncate text-[11px] font-semibold text-[var(--text-secondary)]">
          {restaurant.cuisine} · {priceSymbols(restaurant.priceLevel)}
          {showDistance && ` · ${restaurant.distanceKm.toFixed(1)} km away`}
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          <span
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={{ background: 'color-mix(in srgb, var(--accent-gold) 18%, transparent)', color: 'var(--accent-gold-dark)' }}
          >
            <Star size={10} strokeWidth={2.6} fill="currentColor" />
            {restaurant.rating.toFixed(1)}
          </span>

          <div className="flex-1" />

          <Link
            href={`/app/log?restaurant=${encodeURIComponent(restaurant.name)}&id=${restaurant.id}`}
            className="btn-primary flex items-center gap-1 px-3 py-2 text-[11px]"
          >
            <BookOpen size={11} strokeWidth={2.6} />
            Log Visit
          </Link>

          <button
            onClick={async () => {
              const wasWishlisted = isWishlisted;
              toggleWishlist(restaurant.id);
              try {
                await syncWishlistToggle(restaurant.id, !wasWishlisted);
              } catch {
                toggleWishlist(restaurant.id);
              }
            }}
            aria-label="Toggle wishlist"
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-transform hover:scale-105"
            style={{
              background: isWishlisted ? 'var(--accent-gold)' : 'var(--chip-fill)',
              color: isWishlisted ? 'white' : 'var(--accent-gold)',
              border: isWishlisted ? 'none' : '2px solid var(--accent-gold)',
            }}
          >
            <Star size={14} strokeWidth={2.4} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
