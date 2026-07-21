import {
  corsHeaders,
  createToken,
  getBearerToken,
  hashPassword,
  json,
  requireAuth,
  rowToRestaurant,
  uid,
  verifyPassword,
  withCors,
} from './auth.js';

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method;

    try {
      const response = await route(request, env, ctx, path, method, url);
      return withCors(response, request, env);
    } catch (err) {
      console.error(err);
      return withCors(json({ success: false, error: 'Internal server error' }, 500), request, env);
    }
  },
};

async function route(request, env, ctx, path, method, url) {
  // Health
  if (method === 'GET' && path === '/api/health') {
    return json({ success: true, version: env.API_VERSION || '1' });
  }

  // Auth — public
  if (method === 'POST' && path === '/api/auth/register') {
    return handleRegister(request, env);
  }
  if (method === 'POST' && path === '/api/auth/login') {
    return handleLogin(request, env);
  }
  if (method === 'POST' && path === '/api/auth/logout') {
    return json(
      { success: true },
      200,
      { 'Set-Cookie': 'da_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0' }
    );
  }

  const user = await requireAuth(request, env);
  if (!user) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  // Visits
  if (method === 'GET' && path === '/api/visits') {
    return listVisits(env, user);
  }
  if (method === 'POST' && path === '/api/visits') {
    return createVisit(request, env, user);
  }
  const visitMatch = path.match(/^\/api\/visits\/([^/]+)$/);
  if (visitMatch) {
    const visitId = visitMatch[1];
    if (method === 'PATCH') return updateVisit(request, env, user, visitId);
    if (method === 'DELETE') return deleteVisit(env, user, visitId);
  }

  // Wishlist
  if (method === 'GET' && path === '/api/wishlist') {
    return listWishlist(env, user);
  }
  if (method === 'POST' && path === '/api/wishlist') {
    return addWishlist(request, env, user);
  }
  const wishMatch = path.match(/^\/api\/wishlist\/([^/]+)$/);
  if (wishMatch && method === 'DELETE') {
    return removeWishlist(env, user, wishMatch[1]);
  }

  // Restaurants
  if (method === 'GET' && path === '/api/restaurants/nearby') {
    return nearbyRestaurants(url, env);
  }
  const restaurantMatch = path.match(/^\/api\/restaurants\/([^/]+)$/);
  if (restaurantMatch && method === 'GET') {
    return getRestaurant(env, restaurantMatch[1], url);
  }

  const menuMatch = path.match(/^\/api\/restaurants\/([^/]+)\/menu-items$/);
  if (menuMatch) {
    const restaurantId = menuMatch[1];
    if (method === 'GET') return listMenuItems(env, restaurantId);
    if (method === 'POST') return upsertMenuItems(request, env, user, restaurantId);
  }

  const restaurantMediaMatch = path.match(/^\/api\/restaurants\/([^/]+)\/media$/);
  if (restaurantMediaMatch && method === 'GET') {
    return listRestaurantMedia(env, user, restaurantMediaMatch[1], url);
  }

  // Media
  if (method === 'POST' && path === '/api/media/upload') {
    return uploadMedia(request, env, user);
  }
  const mediaMatch = path.match(/^\/api\/media\/([^/]+)$/);
  if (mediaMatch && method === 'GET') {
    return getMedia(env, user, mediaMatch[1]);
  }

  return json({ success: false, error: 'Not found' }, 404);
}

async function handleRegister(request, env) {
  const body = await request.json();
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';
  const displayName = (body.displayName || body.display_name || email.split('@')[0] || 'User').trim();

  if (!email || !password || password.length < 6) {
    return json({ success: false, error: 'Email and password (6+ chars) required' }, 400);
  }

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) {
    return json({ success: false, error: 'Email already registered' }, 409);
  }

  const id = uid();
  const passwordHash = await hashPassword(password);
  await env.DB.prepare(
    'INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)'
  )
    .bind(id, email, passwordHash, displayName)
    .run();

  const token = await createToken(id, email, env.AUTH_SECRET);
  return json(
    {
      success: true,
      token,
      user: { id, email, displayName },
    },
    201,
    authCookieHeader(token)
  );
}

async function handleLogin(request, env) {
  const body = await request.json();
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  const row = await env.DB.prepare('SELECT id, email, password_hash, display_name FROM users WHERE email = ?')
    .bind(email)
    .first();
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    return json({ success: false, error: 'Invalid email or password' }, 401);
  }

  const token = await createToken(row.id, row.email, env.AUTH_SECRET);
  return json(
    {
      success: true,
      token,
      user: { id: row.id, email: row.email, displayName: row.display_name },
    },
    200,
    authCookieHeader(token)
  );
}

function authCookieHeader(token) {
  return {
    'Set-Cookie': `da_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 24 * 3600}`,
  };
}

async function ensureRestaurant(env, restaurantId, restaurantName) {
  if (!restaurantId) return null;
  const existing = await env.DB.prepare('SELECT id FROM restaurants WHERE id = ?').bind(restaurantId).first();
  if (existing) return restaurantId;

  await env.DB.prepare(
    `INSERT INTO restaurants (id, name, address, cuisine, rating, price_symbols, emoji)
     VALUES (?, ?, '', 'Custom', 0, 2, '🍽️')`
  )
    .bind(restaurantId, restaurantName || 'Custom Restaurant')
    .run();
  return restaurantId;
}

async function listVisits(env, user) {
  const rows = await env.DB.prepare(
    `SELECT id, user_id, restaurant_id, restaurant_name, visit_date, rating, notes, created_at, updated_at
     FROM visits WHERE user_id = ? ORDER BY visit_date DESC, created_at DESC`
  )
    .bind(user.id)
    .all();
  return json({ success: true, data: rows.results || [] });
}

async function createVisit(request, env, user) {
  const body = await request.json();
  const id = body.id || uid();
  const restaurantName = (body.restaurantName || body.restaurant_name || '').trim();
  const restaurantId = body.restaurantId || body.restaurant_id || null;
  const visitDate = body.visitDate || body.visit_date || new Date().toISOString().slice(0, 10);
  const rating = Number(body.rating) || 0;
  const notes = body.notes || '';

  if (!restaurantName) {
    return json({ success: false, error: 'restaurantName required' }, 400);
  }

  if (restaurantId) await ensureRestaurant(env, restaurantId, restaurantName);

  await env.DB.prepare(
    `INSERT INTO visits (id, user_id, restaurant_id, restaurant_name, visit_date, rating, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, user.id, restaurantId, restaurantName, visitDate, rating, notes)
    .run();

  const row = await env.DB.prepare('SELECT * FROM visits WHERE id = ?').bind(id).first();
  return json({ success: true, data: row }, 201);
}

async function updateVisit(request, env, user, visitId) {
  const owned = await env.DB.prepare('SELECT * FROM visits WHERE id = ? AND user_id = ?')
    .bind(visitId, user.id)
    .first();
  if (!owned) return json({ success: false, error: 'Visit not found' }, 404);

  const body = await request.json();
  const restaurantName = (body.restaurantName ?? body.restaurant_name ?? owned.restaurant_name).trim();
  const restaurantId = body.restaurantId ?? body.restaurant_id ?? owned.restaurant_id;
  const visitDate = body.visitDate ?? body.visit_date ?? owned.visit_date;
  const rating = body.rating != null ? Number(body.rating) : owned.rating;
  const notes = body.notes ?? owned.notes;

  if (restaurantId) await ensureRestaurant(env, restaurantId, restaurantName);

  await env.DB.prepare(
    `UPDATE visits SET restaurant_id = ?, restaurant_name = ?, visit_date = ?, rating = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ?`
  )
    .bind(restaurantId, restaurantName, visitDate, rating, notes, visitId, user.id)
    .run();

  const row = await env.DB.prepare('SELECT * FROM visits WHERE id = ?').bind(visitId).first();
  return json({ success: true, data: row });
}

async function deleteVisit(env, user, visitId) {
  const result = await env.DB.prepare('DELETE FROM visits WHERE id = ? AND user_id = ?')
    .bind(visitId, user.id)
    .run();
  if (!result.meta.changes) return json({ success: false, error: 'Visit not found' }, 404);
  return json({ success: true });
}

async function listWishlist(env, user) {
  const rows = await env.DB.prepare(
    `SELECT w.restaurant_id, w.created_at, r.name, r.cuisine, r.emoji, r.rating, r.price_symbols, r.address
     FROM wishlist w
     JOIN restaurants r ON r.id = w.restaurant_id
     WHERE w.user_id = ?
     ORDER BY w.created_at DESC`
  )
    .bind(user.id)
    .all();
  return json({
    success: true,
    data: (rows.results || []).map((r) => ({
      restaurantId: r.restaurant_id,
      createdAt: r.created_at,
      restaurant: {
        id: r.restaurant_id,
        name: r.name,
        cuisine: r.cuisine,
        emoji: r.emoji,
        rating: r.rating,
        priceLevel: r.price_symbols,
        address: r.address,
      },
    })),
    ids: (rows.results || []).map((r) => r.restaurant_id),
  });
}

async function addWishlist(request, env, user) {
  const body = await request.json();
  const restaurantId = body.restaurantId || body.restaurant_id;
  if (!restaurantId) return json({ success: false, error: 'restaurantId required' }, 400);

  const restaurant = await env.DB.prepare('SELECT id, name FROM restaurants WHERE id = ?').bind(restaurantId).first();
  if (!restaurant) return json({ success: false, error: 'Restaurant not found' }, 404);

  await env.DB.prepare(
    'INSERT OR IGNORE INTO wishlist (user_id, restaurant_id) VALUES (?, ?)'
  )
    .bind(user.id, restaurantId)
    .run();

  return json({ success: true, restaurantId }, 201);
}

async function removeWishlist(env, user, restaurantId) {
  await env.DB.prepare('DELETE FROM wishlist WHERE user_id = ? AND restaurant_id = ?')
    .bind(user.id, restaurantId)
    .run();
  return json({ success: true });
}

async function nearbyRestaurants(url, env) {
  const lat = parseFloat(url.searchParams.get('lat') || '');
  const lng = parseFloat(url.searchParams.get('lng') || '');
  const q = (url.searchParams.get('q') || '').trim().toLowerCase();
  const cuisine = url.searchParams.get('cuisine') || '';
  const price = url.searchParams.get('price');

  const rows = await env.DB.prepare('SELECT * FROM restaurants ORDER BY name').all();
  let list = (rows.results || []).map((r) => rowToRestaurant(r, Number.isFinite(lat) ? lat : null, Number.isFinite(lng) ? lng : null));

  if (q) {
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
    );
  }
  if (cuisine && cuisine !== 'All Cuisines') {
    list = list.filter((r) => r.cuisine === cuisine);
  }
  if (price) {
    const level = parseInt(price, 10);
    if (level) list = list.filter((r) => r.priceLevel === level);
  }
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    list.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }

  return json({ success: true, data: list });
}

async function getRestaurant(env, restaurantId, url) {
  const row = await env.DB.prepare('SELECT * FROM restaurants WHERE id = ?').bind(restaurantId).first();
  if (!row) return json({ success: false, error: 'Restaurant not found' }, 404);
  const lat = parseFloat(url.searchParams.get('lat') || '');
  const lng = parseFloat(url.searchParams.get('lng') || '');
  return json({
    success: true,
    data: rowToRestaurant(row, Number.isFinite(lat) ? lat : null, Number.isFinite(lng) ? lng : null),
  });
}

async function listMenuItems(env, restaurantId) {
  const rows = await env.DB.prepare(
    'SELECT id, restaurant_id, category, name, price FROM menu_items WHERE restaurant_id = ? ORDER BY category, name'
  )
    .bind(restaurantId)
    .all();
  return json({ success: true, data: rows.results || [] });
}

async function upsertMenuItems(request, env, user, restaurantId) {
  const body = await request.json();
  const items = body.items || [];
  if (!Array.isArray(items)) return json({ success: false, error: 'items array required' }, 400);

  await env.DB.prepare('DELETE FROM menu_items WHERE restaurant_id = ?').bind(restaurantId).run();

  for (const item of items) {
    const id = item.id || uid();
    await env.DB.prepare(
      'INSERT INTO menu_items (id, restaurant_id, category, name, price) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(id, restaurantId, item.category || '', item.name || '', item.price || '')
      .run();
  }

  return listMenuItems(env, restaurantId);
}

async function uploadMedia(request, env, user) {
  const form = await request.formData();
  const file = form.get('file');
  const restaurantId = form.get('restaurantId') || form.get('restaurant_id');
  const visitId = form.get('visitId') || form.get('visit_id') || null;
  const kind = form.get('kind') || 'food_photo';

  if (!(file instanceof File) || !restaurantId) {
    return json({ success: false, error: 'file and restaurantId required' }, 400);
  }

  const allowedKinds = ['food_photo', 'menu_photo', 'menu_pdf'];
  const mediaKind = allowedKinds.includes(kind) ? kind : 'food_photo';

  const ext =
    mediaKind === 'menu_pdf'
      ? 'pdf'
      : file.type === 'image/png'
        ? 'png'
        : 'jpg';
  const contentType =
    mediaKind === 'menu_pdf' ? 'application/pdf' : file.type || (ext === 'png' ? 'image/png' : 'image/jpeg');

  const mediaId = uid();
  const r2Key = `${restaurantId}/${mediaId}.${ext}`;

  await env.MEDIA.put(r2Key, file.stream(), {
    httpMetadata: { contentType },
  });

  await env.DB.prepare(
    `INSERT INTO media (id, restaurant_id, visit_id, user_id, kind, r2_key, content_type)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(mediaId, restaurantId, visitId, user.id, mediaKind, r2Key, contentType)
    .run();

  return json(
    {
      success: true,
      data: {
        id: mediaId,
        restaurantId,
        visitId,
        kind: mediaKind,
        url: `/api/media/${mediaId}`,
        r2Key,
        contentType,
      },
    },
    201
  );
}

async function getMedia(env, user, mediaId) {
  const row = await env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(mediaId).first();
  if (!row) return new Response('Not found', { status: 404 });
  if (row.user_id !== user.id) return new Response('Forbidden', { status: 403 });

  const object = await env.MEDIA.get(row.r2_key);
  if (!object) return new Response('Not found', { status: 404 });

  return new Response(object.body, {
    headers: {
      'Content-Type': row.content_type || 'application/octet-stream',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}

async function listRestaurantMedia(env, user, restaurantId, url) {
  const visitId = url.searchParams.get('visitId') || url.searchParams.get('visit_id');
  const kind = url.searchParams.get('kind');

  let query = 'SELECT id, restaurant_id, visit_id, kind, content_type, created_at FROM media WHERE restaurant_id = ? AND user_id = ?';
  const binds = [restaurantId, user.id];

  if (visitId) {
    query += ' AND visit_id = ?';
    binds.push(visitId);
  }
  if (kind) {
    query += ' AND kind = ?';
    binds.push(kind);
  }
  query += ' ORDER BY created_at DESC';

  const rows = await env.DB.prepare(query).bind(...binds).all();
  const data = (rows.results || []).map((r) => ({
    ...r,
    url: `/api/media/${r.id}`,
  }));
  return json({ success: true, data });
}
