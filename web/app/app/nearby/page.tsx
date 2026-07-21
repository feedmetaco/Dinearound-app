'use client';

import { useMemo, useState } from 'react';
import { MapPin, Info, Search as SearchIcon, Loader2 } from 'lucide-react';
import { RestaurantCard } from '@/components/restaurant-card';
import { RestaurantSearch } from '@/components/restaurant-search';
import { Filters } from '@/components/filters';
import { seedRestaurants } from '@/lib/seed-data';

export default function NearbyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisine, setCuisine] = useState('All Cuisines');
  const [priceLevel, setPriceLevel] = useState<number | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const requestLocation = () => {
    if (sortByDistance) {
      setSortByDistance(false);
      return;
    }
    if (!navigator.geolocation) {
      setSortByDistance(true);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLocating(false);
        setSortByDistance(true);
      },
      () => {
        setIsLocating(false);
        setSortByDistance(true);
      },
      { timeout: 4000 }
    );
  };

  const restaurants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = seedRestaurants.filter((r) => {
      const matchesSearch =
        !q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q) || r.address.toLowerCase().includes(q);
      const matchesCuisine = cuisine === 'All Cuisines' || r.cuisine === cuisine;
      const matchesPrice = priceLevel === null || r.priceLevel === priceLevel;
      return matchesSearch && matchesCuisine && matchesPrice;
    });
    if (sortByDistance) {
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return list;
  }, [searchQuery, cuisine, priceLevel, sortByDistance]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <div className="mb-5">
        <h2 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
          Discover <span style={{ color: 'var(--accent-coral)' }}>Restaurants</span>
        </h2>
        <p className="mt-1.5 text-sm font-medium text-[var(--text-secondary)]">
          Find and explore amazing dining experiences near you
        </p>
      </div>

      <div className="space-y-3">
        <RestaurantSearch value={searchQuery} onChange={setSearchQuery} />

        <button
          onClick={requestLocation}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-all"
          style={{
            background: sortByDistance ? 'linear-gradient(90deg, #3fae68, var(--brand-green-dark))' : 'var(--chip-fill)',
            color: sortByDistance ? 'white' : 'var(--brand-green)',
            border: sortByDistance ? 'none' : '2px solid color-mix(in srgb, var(--brand-green) 40%, transparent)',
          }}
        >
          {isLocating ? <Loader2 size={14} className="animate-spin" strokeWidth={2.6} /> : <MapPin size={14} strokeWidth={2.6} />}
          {isLocating ? 'Locating…' : sortByDistance ? 'Showing nearby · sorted by distance' : 'Use my location'}
        </button>

        <div
          className="flex items-start gap-2 rounded-2xl p-3 text-xs font-semibold"
          style={{ background: 'var(--chip-fill)', border: '1px solid var(--border-soft)', color: 'var(--text-secondary)' }}
        >
          <Info size={14} strokeWidth={2.4} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-coral)' }} />
          Demo catalog (9 sample spots). Real Lynnwood restaurants need Google Places — coming next. Clear search to
          see samples.
        </div>

        <Filters
          cuisine={cuisine}
          priceLevel={priceLevel}
          onCuisineChange={setCuisine}
          onPriceChange={setPriceLevel}
          onReset={() => {
            setCuisine('All Cuisines');
            setPriceLevel(null);
          }}
        />
      </div>

      <div className="mt-5 space-y-3">
        {restaurants.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 rounded-[26px] p-10 text-center"
            style={{ border: '2px solid var(--border-soft)' }}
          >
            <SearchIcon size={36} strokeWidth={1.8} className="text-[var(--text-secondary)]" />
            <p className="text-base font-black" style={{ color: 'var(--foreground)' }}>
              No restaurants found
            </p>
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Try a different filter, or clear search</p>
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} showDistance={sortByDistance} />
          ))
        )}
      </div>
    </div>
  );
}
