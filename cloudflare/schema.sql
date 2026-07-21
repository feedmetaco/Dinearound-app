-- DineAround D1 Schema
-- Apply: npx wrangler d1 execute dinearound --file=schema.sql --remote
-- Local:  npx wrangler d1 execute dinearound --file=schema.sql --local

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL DEFAULT '',
    cuisine TEXT NOT NULL DEFAULT '',
    rating REAL NOT NULL DEFAULT 0,
    price_symbols INTEGER NOT NULL DEFAULT 2,
    emoji TEXT NOT NULL DEFAULT '🍽️',
    lat REAL,
    lng REAL,
    google_place_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    restaurant_id TEXT,
    restaurant_name TEXT NOT NULL,
    visit_date TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS wishlist (
    user_id TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, restaurant_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    name TEXT NOT NULL,
    price TEXT NOT NULL DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL,
    visit_id TEXT,
    user_id TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('food_photo', 'menu_photo', 'menu_pdf')),
    r2_key TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'image/jpeg',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_visits_user ON visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_media_restaurant ON media(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_media_visit ON media(visit_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_geo ON restaurants(lat, lng);
