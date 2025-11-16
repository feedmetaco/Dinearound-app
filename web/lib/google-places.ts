/**
 * Google Places API utilities
 * Handles restaurant search and caching in Supabase
 */

export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  price_level?: number;
  photos?: Array<{
    photo_reference: string;
  }>;
  types?: string[];
}

export interface RestaurantSearchResult {
  id?: string;
  google_place_id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  rating?: number;
  price_level?: number;
  photo_url?: string;
  cuisine_type?: string;
}

/**
 * Search restaurants using Google Places API Text Search
 */
export async function searchRestaurants(
  query: string,
  location?: { lat: number; lng: number },
  radius?: number
): Promise<RestaurantSearchResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error('Google Places API key not configured');
  }

  // Build search query
  let searchQuery = query;
  if (location) {
    searchQuery = `${query} restaurant`;
  }

  // Build API URL
  const baseUrl = 'https://places.googleapis.com/v1/places:searchText';
  const body: any = {
    textQuery: searchQuery,
    maxResultCount: 20,
    includedType: 'restaurant',
  };

  if (location && radius) {
    body.locationBias = {
      circle: {
        center: {
          latitude: location.lat,
          longitude: location.lng,
        },
        radius: radius, // in meters
      },
    };
  }

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.priceLevel,places.photos,places.types',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Places API error:', error);
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();
    const places = data.places || [];

    // Transform to our format
    return places.map((place: any) => {
      const result: RestaurantSearchResult = {
        google_place_id: place.id,
        name: place.displayName?.text || 'Unknown Restaurant',
        address: place.formattedAddress,
        lat: place.location?.latitude,
        lng: place.location?.longitude,
        rating: place.rating,
        price_level: place.priceLevel ? parseInt(place.priceLevel.replace('PRICE_LEVEL_', '')) : undefined,
      };

      // Get first photo if available
      if (place.photos && place.photos.length > 0) {
        const photoRef = place.photos[0].name;
        result.photo_url = `https://places.googleapis.com/v1/${photoRef}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`;
      }

      // Extract cuisine type from types array
      if (place.types) {
        const cuisineTypes = place.types.filter((type: string) =>
          type.startsWith('restaurant') || type.includes('food')
        );
        if (cuisineTypes.length > 0) {
          result.cuisine_type = cuisineTypes[0].replace('restaurant', '').trim() || 'Restaurant';
        }
      }

      return result;
    });
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
}

/**
 * Get place details by place_id
 */
export async function getPlaceDetails(placeId: string): Promise<RestaurantSearchResult | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error('Google Places API key not configured');
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask':
            'id,displayName,formattedAddress,location,rating,priceLevel,photos,types',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const place = await response.json();

    return {
      google_place_id: place.id,
      name: place.displayName?.text || 'Unknown Restaurant',
      address: place.formattedAddress,
      lat: place.location?.latitude,
      lng: place.location?.longitude,
      rating: place.rating,
      price_level: place.priceLevel
        ? parseInt(place.priceLevel.replace('PRICE_LEVEL_', ''))
        : undefined,
      photo_url:
        place.photos && place.photos.length > 0
          ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`
          : undefined,
    };
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
}

