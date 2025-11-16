/**
 * Restaurant caching utilities
 * Caches Google Places results in Supabase to reduce API calls
 */

import { createClient } from '@/lib/supabase/server';
import { RestaurantSearchResult } from '@/lib/google-places';

/**
 * Cache restaurant in database (or return existing if cached recently)
 */
export async function cacheOrGetRestaurant(
  restaurant: RestaurantSearchResult
): Promise<RestaurantSearchResult> {
  const supabase = await createClient();

  if (!restaurant.google_place_id) {
    return restaurant;
  }

  // Check if already cached (within 24 hours)
  const { data: existing } = await supabase
    .from('restaurants')
    .select('*')
    .eq('google_place_id', restaurant.google_place_id)
    .gte('cached_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .single();

  if (existing) {
    return {
      id: existing.id,
      google_place_id: existing.google_place_id,
      name: existing.name,
      address: existing.address,
      lat: existing.lat,
      lng: existing.lng,
      rating: existing.rating,
      price_level: existing.price_level,
      photo_url: existing.photo_url,
      cuisine_type: existing.cuisine_type,
    };
  }

  // Insert or update restaurant
  const { data: inserted, error } = await supabase
    .from('restaurants')
    .upsert(
      {
        google_place_id: restaurant.google_place_id,
        name: restaurant.name,
        address: restaurant.address,
        lat: restaurant.lat,
        lng: restaurant.lng,
        rating: restaurant.rating,
        price_level: restaurant.price_level,
        photo_url: restaurant.photo_url,
        cuisine_type: restaurant.cuisine_type,
        cached_at: new Date().toISOString(),
      },
      {
        onConflict: 'google_place_id',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error caching restaurant:', error);
    return restaurant; // Return original if caching fails
  }

  return {
    id: inserted.id,
    google_place_id: inserted.google_place_id,
    name: inserted.name,
    address: inserted.address,
    lat: inserted.lat,
    lng: inserted.lng,
    rating: inserted.rating,
    price_level: inserted.price_level,
    photo_url: inserted.photo_url,
    cuisine_type: inserted.cuisine_type,
  };
}

