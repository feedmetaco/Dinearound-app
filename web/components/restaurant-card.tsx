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

/** DONESKI-style card: square thumbnail left, small-caps category label, bold title, price/rating row. */
export function RestaurantCard({ restaurant, showDistance }: RestaurantCardProps) {
  const isWishlisted = useDineAroundStore((s) => s.wishlistIds.includes(restaurant.id));
  const toggleWishlist = useDineAroundStore((s) => s.toggleWishlist);

  return (
    <div className="card-surface flex items-center gap-3 p-3 hover:shadow-[var(--shadow-card-hover)]">
      <Link
        href={`/app/restaurant/${restaurant.id}`}
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-3xl"
        style={{ background: 'var(--chip-fill)' }}
      >
        {restaurant.emoji}
      </Link>

      <div className="min-w-0 flex-1">
        <p className="label-caps">{restaurant.cuisine}</p>
        <Link href={`/app/restaurant/${restaurant.id}`}>
          <h3 className="truncate text-[15px] font-extrabold leading-tight" style={{ color: 'var(--foreground)' }}>
            {restaurant.name}
          </h3>
        </Link>
        <p className="mt-0.5 truncate text-[12px] font-semibold text-[var(--text-secondary)]">
          {priceSymbols(restaurant.priceLevel)}
          {showDistance && ` · ${restaurant.distanceKm.toFixed(1)} km away`}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={{ background: 'color-mix(in srgb, var(--accent-gold) 16%, transparent)', color: 'var(--accent-gold-dark)' }}
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
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:scale-105"
            style={{
              background: isWishlisted ? 'var(--accent-gold)' : 'var(--chip-fill)',
              color: isWishlisted ? 'white' : 'var(--accent-gold)',
            }}
          >
            <Star size={15} strokeWidth={2.4} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
