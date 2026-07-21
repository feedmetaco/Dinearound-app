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

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <div className="mb-4">
        <h2 className="font-display text-3xl font-extrabold tracking-tight" style={{ color: 'var(--foreground)' }}>
          Find your next <span style={{ color: 'var(--accent-coral)' }}>table</span>
        </h2>
        <p className="mt-1.5 text-sm font-medium text-[var(--text-secondary)]">
          Discover and explore restaurants near you
        </p>
      </div>

      <RestaurantSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Map-first area — stylized pin field + floating preview card (web-light.md §6) */}
      <div className="relative mt-3 h-72 overflow-hidden rounded-[24px]" style={{ background: 'var(--green-tint)' }}>
        <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none" viewBox="0 0 400 300">
          <path d="M0 60 Q120 20 200 70 T400 40" stroke="var(--brand-green)" strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M0 180 Q140 220 240 170 T400 210" stroke="var(--brand-green)" strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M60 0 Q30 150 80 300" stroke="var(--brand-green)" strokeWidth="3" fill="none" opacity="0.35" />
          <path d="M320 0 Q360 150 300 300" stroke="var(--brand-green)" strokeWidth="3" fill="none" opacity="0.35" />
        </svg>

        {/* "You are here" center marker */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-0 -m-2 animate-ping rounded-full" style={{ background: 'color-mix(in srgb, var(--brand-green) 40%, transparent)' }} />
          <span className="relative flex h-4 w-4 rounded-full border-2 border-white" style={{ background: 'var(--brand-green)' }} />
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
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-base shadow-lg transition-transform"
                style={{
                  background: isSelected ? 'var(--accent-coral)' : 'white',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                  border: isSelected ? 'none' : '2px solid var(--accent-coral)',
                }}
              >
                {isSelected ? <MapPin size={16} className="text-white" strokeWidth={2.6} /> : r.emoji}
              </span>
            </button>
          );
        })}

        <button
          onClick={requestLocation}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold shadow-md"
          style={{ background: 'white', color: sortByDistance ? 'var(--brand-green-dark)' : 'var(--foreground)' }}
        >
          {isLocating ? <Loader2 size={13} className="animate-spin" strokeWidth={2.6} /> : <MapPin size={13} strokeWidth={2.6} />}
          {isLocating ? 'Locating…' : sortByDistance ? 'Sorted by distance' : 'Use my location'}
        </button>

        {/* Floating preview card for the selected pin */}
        {selected && (
          <div className="absolute inset-x-3 bottom-3">
            <Link
              href={`/app/restaurant/${selected.id}`}
              className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl transition-transform hover:-translate-y-0.5"
            >
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl"
                style={{ background: 'var(--accent-coral-tint)' }}
              >
                {selected.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="label-caps">{selected.cuisine}</p>
                <h3 className="truncate text-sm font-extrabold" style={{ color: 'var(--foreground)' }}>
                  {selected.name}
                </h3>
                <div className="mt-0.5 flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
                  <span className="flex items-center gap-0.5" style={{ color: 'var(--accent-gold-dark)' }}>
                    <Star size={10} strokeWidth={2.8} fill="currentColor" />
                    {selected.rating.toFixed(1)}
                  </span>
                  <span>{priceSymbols(selected.priceLevel)}</span>
                  <span>· {selected.distanceKm.toFixed(1)} km</span>
                </div>
              </div>
              <span className="btn-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                <BookOpen size={15} strokeWidth={2.4} />
              </span>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
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

        <div
          className="flex items-start gap-2 rounded-2xl p-3 text-xs font-semibold"
          style={{ background: 'var(--chip-fill)', color: 'var(--text-secondary)' }}
        >
          <MapPin size={14} strokeWidth={2.4} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-coral)' }} />
          Demo catalog (9 sample spots). Real restaurants need Google Places — coming next. Clear search to see all
          samples.
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {restaurants.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 rounded-[24px] p-10 text-center"
            style={{ border: '2px dashed var(--border-soft)' }}
          >
            <SearchIcon size={36} strokeWidth={1.8} className="text-[var(--text-secondary)]" />
            <p className="text-base font-extrabold" style={{ color: 'var(--foreground)' }}>
              No restaurants found
            </p>
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Try a different filter, or clear search</p>
            {(cuisine !== 'All Cuisines' || priceLevel !== null || searchQuery) && (
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
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{ background: 'var(--accent-coral-tint)' }}>
        {restaurant.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="label-caps">{restaurant.cuisine}</p>
        <h3 className="truncate text-[15px] font-extrabold" style={{ color: 'var(--foreground)' }}>
          {restaurant.name}
        </h3>
        <div className="mt-0.5 flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
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
