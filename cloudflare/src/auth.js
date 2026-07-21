/** @typedef {{ id: string; email: string }} AuthUser */

const TOKEN_TTL_SEC = 30 * 24 * 3600;

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    key,
    256
  );
  const saltHex = [...salt].map((b) => b.toString(16).padStart(2, '0')).join('');
  const hashHex = [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map((h) => parseInt(h, 16)));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    key,
    256
  );
  const computed = [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return computed === hashHex;
}

export async function createToken(userId, email, secret) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '');
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SEC;
  const payload = btoa(JSON.stringify({ sub: userId, email, exp })).replace(/=/g, '');
  const data = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return `${data}.${sigB64}`;
}

export async function verifyToken(token, secret) {
  try {
    const [header, payload, sig] = token.split('.');
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const sigBytes = Uint8Array.from(atob(sig.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(`${header}.${payload}`));
    if (!valid) return null;
    const claims = JSON.parse(atob(payload));
    if (claims.exp <= Math.floor(Date.now() / 1000)) return null;
    return { id: claims.sub, email: claims.email };
  } catch {
    return null;
  }
}

export function getBearerToken(request) {
  const auth = request.headers.get('Authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  const cookies = request.headers.get('Cookie') || '';
  const match = cookies.match(/(?:^|;\s*)da_session=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function requireAuth(request, env) {
  const token = getBearerToken(request);
  if (!token || !env.AUTH_SECRET) return null;
  return verifyToken(token, env.AUTH_SECRET);
}

export function uid() {
  return crypto.randomUUID();
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

export function corsHeaders(request, env) {
  const allowed = (env.ALLOWED_ORIGINS || '*').split(',').map((s) => s.trim());
  const origin = request.headers.get('Origin') || '';
  const allowOrigin = allowed.includes('*') || allowed.includes(origin) ? (allowed.includes('*') ? '*' : origin) : allowed[0] || '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(corsHeaders(request, env))) {
    headers.set(k, v);
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function rowToRestaurant(row, userLat, userLng) {
  const distanceKm =
    userLat != null && userLng != null && row.lat != null && row.lng != null
      ? Math.round(haversineKm(userLat, userLng, row.lat, row.lng) * 10) / 10
      : null;
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    cuisine: row.cuisine,
    rating: row.rating,
    priceLevel: row.price_symbols,
    priceSymbols: '$'.repeat(Math.min(Math.max(row.price_symbols || 1, 1), 4)),
    emoji: row.emoji,
    lat: row.lat,
    lng: row.lng,
    googlePlaceId: row.google_place_id,
    distanceKm,
  };
}
