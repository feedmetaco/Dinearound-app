export interface Restaurant {
  id: string;
  google_place_id?: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  cuisine_type?: string;
  price_level?: number;
  rating?: number;
  photo_url?: string;
  cached_at?: string;
}

export interface Visit {
  id: string;
  user_id: string;
  restaurant_id: string;
  visit_date: string;
  rating_overall?: number;
  rating_food?: number;
  rating_service?: number;
  rating_ambiance?: number;
  notes?: string;
  photos?: string[];
  created_at?: string;
  restaurant?: Restaurant;
}

export interface Wishlist {
  id: string;
  user_id: string;
  restaurant_id: string;
  tags?: string[];
  added_at?: string;
  restaurant?: Restaurant;
}

