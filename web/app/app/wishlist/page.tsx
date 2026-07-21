'use client';

import { useState } from 'react';
import { Plus, X, Star } from 'lucide-react';
import { useDineAroundStore } from '@/lib/local-store';
import { seedRestaurants } from '@/lib/seed-data';
import { RestaurantCard } from '@/components/restaurant-card';

export default function WishlistPage() {
  const wishlistIds = useDineAroundStore((s) => s.wishlistIds);
  const toggleWishlist = useDineAroundStore((s) => s.toggleWishlist);
  const [showAddForm, setShowAddForm] = useState(false);

  const wishlisted = seedRestaurants.filter((r) => wishlistIds.includes(r.id));
  const candidates = seedRestaurants.filter((r) => !wishlistIds.includes(r.id));

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-extrabold" style={{ color: 'var(--foreground)' }}>
            Wishlist
          </h2>
          <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">Places you want to try next</p>
        </div>
        <button onClick={() => setShowAddForm((v) => !v)} className="btn-gold flex items-center gap-1.5 px-4 py-2.5 text-sm text-white">
          {showAddForm ? <X size={13} strokeWidth={2.8} /> : <Plus size={13} strokeWidth={2.8} />}
          {showAddForm ? 'Cancel' : 'Add'}
        </button>
      </div>

      {showAddForm && (
        <div className="card-surface mb-5 space-y-2.5 p-5">
          {candidates.length === 0 ? (
            <p className="text-sm font-semibold text-[var(--text-secondary)]">All restaurants are already on your wishlist.</p>
          ) : (
            candidates.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 truncate text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                  <span className="text-lg">{r.emoji}</span> {r.name}
                </span>
                <button
                  onClick={() => toggleWishlist(r.id)}
                  className="btn-gold flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                >
                  <Plus size={15} strokeWidth={3} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {wishlisted.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'color-mix(in srgb, var(--accent-gold) 14%, transparent)' }}>
            <Star size={28} strokeWidth={1.8} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <p className="mt-1 text-base font-extrabold" style={{ color: 'var(--foreground)' }}>
            Your wishlist is empty
          </p>
          <p className="max-w-xs text-sm font-semibold text-[var(--text-secondary)]">
            Add restaurants you want to visit and they&apos;ll show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {wishlisted.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}
