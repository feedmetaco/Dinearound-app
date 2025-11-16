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
        <h2 className="mb-2 bg-gradient-to-r from-[#386641] to-[#6a994e] bg-clip-text text-3xl font-black tracking-tight text-transparent">
          Discover Restaurants
        </h2>
        <p className="mb-6 text-[#6a994e] dark:text-[#a7c957]">
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
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#a7c957]/30 border-t-[#386641] dark:border-[#6a994e]/30 dark:border-t-[#a7c957]"></div>
          <p className="text-[#6a994e] dark:text-[#a7c957]">Finding restaurants...</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border-2 border-[#bc4749]/40 bg-[#bc4749]/10 p-6 backdrop-blur-md dark:border-[#bc4749]/30 dark:bg-[#bc4749]/20">
          <p className="font-medium text-[#bc4749] dark:text-[#bc4749]">
            ⚠️ Failed to load restaurants. Please try again.
          </p>
        </div>
      )}

      {restaurants && restaurants.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="mb-4 text-6xl">🔍</span>
          <p className="text-lg font-medium text-[#386641] dark:text-[#f2e8cf]">No restaurants found</p>
          <p className="mt-2 text-sm text-[#6a994e] dark:text-[#a7c957]">Try a different search or location</p>
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

