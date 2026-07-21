-- Seed restaurants (mirrors web/ios SeedData)
-- Run after schema: npx wrangler d1 execute dinearound --file=seed.sql --remote

INSERT OR IGNORE INTO restaurants (id, name, address, cuisine, rating, price_symbols, emoji, lat, lng) VALUES
('r1', 'Nonna Rosa', '214 Mulberry St', 'Italian', 4.7, 3, '🍝', 37.7749, -122.4194),
('r2', 'Casa Verde', '88 Alvarado Ave', 'Mexican', 4.4, 2, '🌮', 37.7755, -122.4180),
('r3', 'Sakura Table', '19 Cherry Ln', 'Japanese', 4.8, 4, '🍣', 37.7760, -122.4170),
('r4', 'Saffron & Clove', '502 Spice Market Rd', 'Indian', 4.5, 2, '🍛', 37.7730, -122.4200),
('r5', 'Bangkok Basil', '77 Riverside Dr', 'Thai', 4.3, 2, '🍜', 37.7720, -122.4210),
('r6', 'Le Petit Four', '10 Rue Fictive', 'French', 4.6, 4, '🥐', 37.7770, -122.4160),
('r7', 'The Griddle House', '345 Main St', 'American', 4.2, 1, '🍔', 37.7710, -122.4220),
('r8', 'Olive & Sea', '61 Harbor Walk', 'Mediterranean', 4.6, 3, '🥙', 37.7780, -122.4150),
('r9', 'Seoul Garden', '129 Baekdu Ave', 'Korean', 4.5, 2, '🍢', 37.7740, -122.4185);

INSERT OR IGNORE INTO menu_items (id, restaurant_id, category, name, price) VALUES
('m-r1-1', 'r1', 'Appetizers', 'Burrata al Pomodoro', '14'),
('m-r1-2', 'r1', 'Mains', 'Tagliatelle al Tartufo', '26'),
('m-r1-3', 'r1', 'Mains', 'Osso Buco', '32'),
('m-r1-4', 'r1', 'Dolci', 'Tiramisù', '9'),
('m-r2-1', 'r2', 'Starters', 'Guacamole & Chips', '8'),
('m-r2-2', 'r2', 'Tacos', 'Al Pastor (3)', '12'),
('m-r2-3', 'r2', 'Tacos', 'Barbacoa (3)', '13'),
('m-r2-4', 'r2', 'Postres', 'Churros', '6'),
('m-r3-1', 'r3', 'Nigiri', 'Otoro', '9'),
('m-r3-2', 'r3', 'Rolls', 'Rainbow Roll', '18'),
('m-r3-3', 'r3', 'Rolls', 'Spicy Tuna Roll', '14'),
('m-r3-4', 'r3', 'Soup', 'Miso Soup', '5');
