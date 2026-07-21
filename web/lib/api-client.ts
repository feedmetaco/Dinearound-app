/**
 * DineAround API client — shared Cloudflare Worker backend (D1 + R2).
 * Falls back gracefully when NEXT_PUBLIC_API_URL is unset (local-only mode).
 */

const TOKEN_KEY = 'dinearound-auth-token';

export function getApiBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
  return url || null;
}

export function isApiEnabled(): boolean {
  return Boolean(getApiBaseUrl());
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export interface ApiUser {
  id: string;
  email: string;
  displayName?: string;
}

export interface ApiVisit {
  id: string;
  user_id: string;
  restaurant_id: string | null;
  restaurant_name: string;
  visit_date: string;
  rating: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ApiRestaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  rating: number;
  priceLevel: number;
  priceSymbols?: string;
  emoji: string;
  lat?: number | null;
  lng?: number | null;
  distanceKm?: number | null;
}

export interface ApiMedia {
  id: string;
  restaurant_id: string;
  visit_id?: string | null;
  kind: string;
  content_type?: string;
  url: string;
  created_at?: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const base = getApiBaseUrl();
  if (!base) throw new ApiError('API URL not configured', 0);

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth !== false) {
    const token = getAuthToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${base}${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(json.error || res.statusText || 'Request failed', res.status);
  }
  return json as T;
}

export async function apiRegister(email: string, password: string, displayName?: string) {
  const result = await apiFetch<{ success: boolean; token: string; user: ApiUser }>(
    '/api/auth/register',
    {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, password, displayName }),
    }
  );
  setAuthToken(result.token);
  return result;
}

export async function apiLogin(email: string, password: string) {
  const result = await apiFetch<{ success: boolean; token: string; user: ApiUser }>(
    '/api/auth/login',
    { method: 'POST', auth: false, body: JSON.stringify({ email, password }) }
  );
  setAuthToken(result.token);
  return result;
}

export async function apiLogout() {
  const base = getApiBaseUrl();
  if (base) {
    await fetch(`${base}/api/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
  }
  setAuthToken(null);
}

export async function apiGetVisits() {
  const result = await apiFetch<{ success: boolean; data: ApiVisit[] }>('/api/visits');
  return result.data;
}

export async function apiCreateVisit(visit: {
  id?: string;
  restaurantId?: string;
  restaurantName: string;
  visitDate: string;
  rating: number;
  notes: string;
}) {
  const result = await apiFetch<{ success: boolean; data: ApiVisit }>('/api/visits', {
    method: 'POST',
    body: JSON.stringify({
      id: visit.id,
      restaurantId: visit.restaurantId,
      restaurantName: visit.restaurantName,
      visitDate: visit.visitDate,
      rating: visit.rating,
      notes: visit.notes,
    }),
  });
  return result.data;
}

export async function apiUpdateVisit(
  id: string,
  visit: Partial<{
    restaurantId: string;
    restaurantName: string;
    visitDate: string;
    rating: number;
    notes: string;
  }>
) {
  const result = await apiFetch<{ success: boolean; data: ApiVisit }>(`/api/visits/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(visit),
  });
  return result.data;
}

export async function apiDeleteVisit(id: string) {
  await apiFetch<{ success: boolean }>(`/api/visits/${id}`, { method: 'DELETE' });
}

export async function apiGetWishlistIds() {
  const result = await apiFetch<{ success: boolean; ids: string[] }>('/api/wishlist');
  return result.ids;
}

export async function apiAddWishlist(restaurantId: string) {
  await apiFetch('/api/wishlist', {
    method: 'POST',
    body: JSON.stringify({ restaurantId }),
  });
}

export async function apiRemoveWishlist(restaurantId: string) {
  await apiFetch(`/api/wishlist/${restaurantId}`, { method: 'DELETE' });
}

export async function apiGetNearby(params?: {
  lat?: number;
  lng?: number;
  q?: string;
  cuisine?: string;
  price?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.lat != null) qs.set('lat', String(params.lat));
  if (params?.lng != null) qs.set('lng', String(params.lng));
  if (params?.q) qs.set('q', params.q);
  if (params?.cuisine) qs.set('cuisine', params.cuisine);
  if (params?.price) qs.set('price', String(params.price));
  const query = qs.toString() ? `?${qs}` : '';
  const result = await apiFetch<{ success: boolean; data: ApiRestaurant[] }>(
    `/api/restaurants/nearby${query}`,
    { auth: false }
  );
  return result.data;
}

export async function apiGetMenuItems(restaurantId: string) {
  const result = await apiFetch<{
    success: boolean;
    data: { id: string; category: string; name: string; price: string }[];
  }>(`/api/restaurants/${restaurantId}/menu-items`, { auth: false });
  return result.data;
}

export async function apiSaveMenuItems(
  restaurantId: string,
  items: { category: string; name: string; price: string }[]
) {
  const result = await apiFetch<{
    success: boolean;
    data: { id: string; category: string; name: string; price: string }[];
  }>(`/api/restaurants/${restaurantId}/menu-items`, {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
  return result.data;
}

export async function apiUploadMedia(params: {
  file: Blob;
  fileName: string;
  restaurantId: string;
  visitId?: string;
  kind: 'food_photo' | 'menu_photo' | 'menu_pdf';
}) {
  const form = new FormData();
  form.append('file', params.file, params.fileName);
  form.append('restaurantId', params.restaurantId);
  if (params.visitId) form.append('visitId', params.visitId);
  form.append('kind', params.kind);

  const result = await apiFetch<{ success: boolean; data: ApiMedia }>('/api/media/upload', {
    method: 'POST',
    body: form,
  });
  return result.data;
}

export function apiMediaUrl(mediaId: string): string | null {
  const base = getApiBaseUrl();
  if (!base) return null;
  return `${base}/api/media/${mediaId}`;
}

export async function apiListMedia(restaurantId: string, visitId?: string, kind?: string) {
  const qs = new URLSearchParams();
  if (visitId) qs.set('visitId', visitId);
  if (kind) qs.set('kind', kind);
  const query = qs.toString() ? `?${qs}` : '';
  const result = await apiFetch<{ success: boolean; data: ApiMedia[] }>(
    `/api/restaurants/${restaurantId}/media${query}`
  );
  return result.data;
}

/** Map API visit row → local store shape */
export function apiVisitToLocal(v: ApiVisit) {
  return {
    id: v.id,
    restaurantId: v.restaurant_id || '',
    restaurantName: v.restaurant_name,
    visitDate: v.visit_date,
    rating: v.rating,
    notes: v.notes,
    createdAt: v.created_at,
  };
}
