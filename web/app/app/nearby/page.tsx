'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, Search as SearchIcon, Loader2, Star, BookOpen, X } from 'lucide-react';
import { RestaurantSearch } from '@/components/restaurant-search';
import { Filters } from '@/components/filters';
import { LocalRestaurant, priceSymbols, seedRestaurants } from '@/lib/seed-data';

/**
 * Deterministic pseudo-position for a restaurant pin on the stylized map card.
 * There is no lat/lng in the current seed dataset — closer restaurants (lower
 * distanceKm) cluster nearer the center pin ("you"), farther ones sit toward
 * the edges. Swap for live coordinates + Google Maps AdvancedMarkerElement
 * once Places integration lands (see web-light.md §6).
 */
function pinPosition(id: string, distanceKm: number, maxDistance: number) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 360;
  const angle = (hash / 360) * Math.PI * 2;
  const radiusPct = 12 + (Math.min(distanceKm / (maxDistance || 1), 1) * 34);
  const x = 50 + radiusPct * Math.cos(angle);
  const y = 50 + radiusPct * Math.sin(angle) * 0.72; // flatten vertically for a wider card
  return { left: `${Math.min(92, Math.max(8, x))}%`, top: `${Math.min(88, Math.max(12, y))}%` };
}

export default function NearbyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisine, setCuisine] = useState('All Cuisines');
  const [priceLevel, setPriceLevel] = useState<number | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const maxDistance = useMemo(() => Math.max(...seedRestaurants.map((r) => r.distanceKm)), []);
  const selected: LocalRestaurant | undefined = restaurants.find((r) => r.id === selectedId) ?? restaurants[0];
  const isFiltered = cuisine !== 'All Cuisines' || priceLevel !== null || Boolean(searchQuery);

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 md:px-6">
      {/* Compact top row — no hero headline, no marketing copy */}
      <div className="mb-3">
        <p className="label-caps mb-2">Nearby</p>
        <RestaurantSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Map — flat light-grey surface, Lucide pins only, ~40vh max (web-light.md §6) */}
      <div
        className="relative h-[38vh] max-h-72 min-h-[200px] overflow-hidden rounded-2xl"
        style={{ background: 'var(--map-bg)' }}
      >
        {/* "You are here" center marker */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="relative flex h-3.5 w-3.5 rounded-full border-2 border-white" style={{ background: 'var(--accent-coral)' }} />
        </div>

        {restaurants.map((r) => {
          const pos = pinPosition(r.id, r.distanceKm, maxDistance);
          const isSelected = selected?.id === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              aria-label={`Show ${r.name}`}
              className="absolute flex -translate-x-1/2 -translate-y-full items-center justify-center transition-transform"
              style={{ left: pos.left, top: pos.top, zIndex: isSelected ? 10 : 1 }}
            >
              <MapPin
                size={isSelected ? 28 : 22}
                strokeWidth={2.2}
                fill={isSelected ? 'var(--accent-coral)' : 'white'}
                style={{ color: isSelected ? 'var(--accent-coral)' : 'var(--map-pin)' }}
              />
            </button>
          );
        })}

        <button
          onClick={requestLocation}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm"
          style={{ background: 'white', color: sortByDistance ? 'var(--accent-coral)' : 'var(--foreground)' }}
        >
          {isLocating ? <Loader2 size={12} className="animate-spin" strokeWidth={2.6} /> : <MapPin size={12} strokeWidth={2.6} />}
          {isLocating ? 'Locating…' : sortByDistance ? 'Sorted by distance' : 'Use my location'}
        </button>

        {/* Floating preview card for the selected pin — white, minimal, one restaurant */}
        {selected && (
          <div className="absolute inset-x-3 bottom-3">
            <Link
              href={`/app/restaurant/${selected.id}`}
              className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-md transition-transform hover:-translate-y-0.5"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl"
                style={{ background: 'var(--chip-fill)' }}
              >
                {selected.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                  {selected.name}
                </h3>
                <div className="mt-0.5 flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
                  <span className="flex items-center gap-0.5" style={{ color: 'var(--accent-gold-dark)' }}>
                    <Star size={10} strokeWidth={2.8} fill="currentColor" />
                    {selected.rating.toFixed(1)}
                  </span>
                  <span>{priceSymbols(selected.priceLevel)}</span>
                  <span>· {selected.distanceKm.toFixed(1)} km</span>
                </div>
              </div>
              <span className="btn-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <BookOpen size={13} strokeWidth={2.4} />
              </span>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-3">
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

      {/* Demo data notice — a single subtle text line, not an alert box */}
      <p className="mt-2 px-1 text-xs font-medium text-[var(--text-secondary)]">
        Showing 9 demo restaurants. Live Google Places search is coming next.
      </p>

      <div className="mt-4 space-y-2.5">
        {restaurants.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 rounded-2xl p-10 text-center"
            style={{ border: '1.5px dashed var(--border-soft)' }}
          >
            <SearchIcon size={32} strokeWidth={1.8} className="text-[var(--text-secondary)]" />
            <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
              No restaurants found
            </p>
            <p className="text-sm text-[var(--text-secondary)]">Try a different filter, or clear search</p>
            {isFiltered && (
              <button
                onClick={() => {
                  setCuisine('All Cuisines');
                  setPriceLevel(null);
                  setSearchQuery('');
                }}
                className="btn-outline mt-1 flex items-center gap-1.5 px-4 py-2 text-xs"
              >
                <X size={12} strokeWidth={2.6} />
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          restaurants.map((r) => (
            <button key={r.id} onClick={() => setSelectedId(r.id)} className="block w-full text-left">
              <RestaurantCardRow restaurant={r} selected={selected?.id === r.id} showDistance={sortByDistance} />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function RestaurantCardRow({
  restaurant,
  selected,
  showDistance,
}: {
  restaurant: LocalRestaurant;
  selected: boolean;
  showDistance?: boolean;
}) {
  return (
    <div
      className="card-surface flex items-center gap-3 p-3"
      style={{ borderColor: selected ? 'var(--accent-coral)' : 'var(--border-soft)' }}
    >
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-2xl" style={{ background: 'var(--chip-fill)' }}>
        {restaurant.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="label-caps">{restaurant.cuisine}</p>
        <h3 className="truncate text-[15px] font-bold" style={{ color: 'var(--foreground)' }}>
          {restaurant.name}
        </h3>
        <div className="mt-0.5 flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
          <span className="flex items-center gap-0.5" style={{ color: 'var(--accent-gold-dark)' }}>
            <Star size={10} strokeWidth={2.8} fill="currentColor" />
            {restaurant.rating.toFixed(1)}
          </span>
          <span>{priceSymbols(restaurant.priceLevel)}</span>
          {showDistance && <span>· {restaurant.distanceKm.toFixed(1)} km</span>}
        </div>
      </div>
    </div>
  );
}
