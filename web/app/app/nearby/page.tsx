'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RestaurantCard } from '@/components/restaurant-card';
import { RestaurantSearch } from '@/components/restaurant-search';
import { Filters } from '@/components/filters';
import { useFilterStore } from '@/stores/filter-store';

async function searchRestaurants(query: string, location?: { lat: number; lng: number }) {
  const params = new URLSearchParams({
    q: query || 'restaurant',
  });
  
  if (location) {
    params.append('lat', location.lat.toString());
    params.append('lng', location.lng.toString());
    params.append('radius', '5000'); // 5km radius
  }
  
  const response = await fetch(`/api/restaurants/search?${params.toString()}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to search restaurants' }));
    throw new Error(error.error || 'Failed to search restaurants');
  }
  return response.json();
}

export default function NearbyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { cuisine, priceLevel } = useFilterStore();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // User denied or error getting location
        }
      );
    }
  }, []);

  const { data: restaurants, isLoading, error } = useQuery({
    queryKey: ['restaurants', searchQuery, cuisine, priceLevel, userLocation?.lat, userLocation?.lng],
    queryFn: () => searchRestaurants(searchQuery || 'restaurant', userLocation || undefined),
    enabled: !!searchQuery || userLocation !== null,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <h2 className="mb-2 bg-gradient-to-r from-[#FF6B35] via-[#FFD23F] to-[#06D6A0] bg-clip-text text-4xl font-black tracking-tight text-transparent">
          Discover Restaurants
        </h2>
        <p className="mb-6 text-base font-medium text-[#737373] dark:text-[#A3A3A3]">
          Find and explore amazing dining experiences near you
        </p>
        <RestaurantSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onLocationRequest={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  });
                }
              );
            }
          }}
        />
        <Filters />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#FFD23F]/30 border-t-[#FF6B35]"></div>
          <p className="text-base font-bold text-[#FF6B35] dark:text-[#FFD23F]">Finding restaurants...</p>
        </div>
      )}

      {error && (
        <div className="rounded-3xl border-2 border-[#EF476F]/40 bg-[#EF476F]/10 p-6 shadow-lg dark:border-[#EF476F]/30 dark:bg-[#EF476F]/20">
          <p className="font-bold text-[#EF476F] dark:text-[#EF476F]">
            ⚠️ Failed to load restaurants. Please try again.
          </p>
        </div>
      )}

      {restaurants && restaurants.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-[#FFD23F]/30 bg-white/50 py-16 text-center shadow-lg dark:border-[#FFD23F]/20 dark:bg-[#262626]/50">
          <span className="mb-4 text-6xl">🔍</span>
          <p className="text-xl font-black text-[#1A1A1A] dark:text-[#FFF8F0]">No restaurants found</p>
          <p className="mt-2 text-base font-medium text-[#737373] dark:text-[#A3A3A3]">Try a different search or location</p>
        </div>
      )}

      {restaurants && restaurants.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant: any) => (
            <RestaurantCard key={restaurant.id || restaurant.place_id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}

