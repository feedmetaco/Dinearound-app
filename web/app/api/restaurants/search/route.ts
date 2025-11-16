import { NextResponse } from 'next/server';
import { searchRestaurants } from '@/lib/google-places';
import { cacheOrGetRestaurant } from '@/lib/supabase/restaurants';
import { z } from 'zod';

const searchQuerySchema = z.object({
  q: z.string().min(1).max(200).trim(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  radius: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    // Authentication disabled for now - allow all requests
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParam = searchParams.get('q');
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius');

    const validation = searchQuerySchema.safeParse({
      q: queryParam,
      lat: latParam,
      lng: lngParam,
      radius: radiusParam,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { q, lat, lng, radius } = validation.data;

    // Build location if provided
    const location =
      lat && lng
        ? {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
          }
        : undefined;

    const radiusMeters = radius ? parseInt(radius) : 5000; // Default 5km

    // Search Google Places API
    const places = await searchRestaurants(q, location, radiusMeters);

    // Cache results in database
    const cachedRestaurants = await Promise.all(
      places.map((place) => cacheOrGetRestaurant(place))
    );

    return NextResponse.json(cachedRestaurants);
  } catch (error) {
    console.error('Error in restaurant search:', error);

    // Return user-friendly error
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Google Places API not configured. Please add GOOGLE_PLACES_API_KEY to .env.local' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to search restaurants. Please try again.' },
      { status: 500 }
    );
  }
}

