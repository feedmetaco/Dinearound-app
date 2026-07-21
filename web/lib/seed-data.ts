// Local demo catalog — mirrors ios/Dinearound-app/Dinearound-app/Data/SeedData.swift
// so both platforms show the same 9 sample restaurants until a live Places
// integration replaces this (see design-handoff + tasks/todo.md).

export interface LocalRestaurant {
  id: string;
  name: string;
  cuisine: string;
  emoji: string;
  address: string;
  rating: number;
  priceLevel: number; // 1-4
  distanceKm: number;
}

export const cuisines = [
  'Italian',
  'Mexican',
  'Japanese',
  'Indian',
  'Thai',
  'French',
  'American',
  'Mediterranean',
  'Korean',
];

export const seedRestaurants: LocalRestaurant[] = [
  { id: 'r1', name: 'Nonna Rosa', cuisine: 'Italian', emoji: '🍝', address: '214 Mulberry St', rating: 4.7, priceLevel: 3, distanceKm: 0.6 },
  { id: 'r2', name: 'Casa Verde', cuisine: 'Mexican', emoji: '🌮', address: '88 Alvarado Ave', rating: 4.4, priceLevel: 2, distanceKm: 1.4 },
  { id: 'r3', name: 'Sakura Table', cuisine: 'Japanese', emoji: '🍣', address: '19 Cherry Ln', rating: 4.8, priceLevel: 4, distanceKm: 2.1 },
  { id: 'r4', name: 'Saffron & Clove', cuisine: 'Indian', emoji: '🍛', address: '502 Spice Market Rd', rating: 4.5, priceLevel: 2, distanceKm: 0.9 },
  { id: 'r5', name: 'Bangkok Basil', cuisine: 'Thai', emoji: '🍜', address: '77 Riverside Dr', rating: 4.3, priceLevel: 2, distanceKm: 3.2 },
  { id: 'r6', name: 'Le Petit Four', cuisine: 'French', emoji: '🥐', address: '10 Rue Fictive', rating: 4.6, priceLevel: 4, distanceKm: 1.8 },
  { id: 'r7', name: 'The Griddle House', cuisine: 'American', emoji: '🍔', address: '345 Main St', rating: 4.2, priceLevel: 1, distanceKm: 0.3 },
  { id: 'r8', name: 'Olive & Sea', cuisine: 'Mediterranean', emoji: '🥙', address: '61 Harbor Walk', rating: 4.6, priceLevel: 3, distanceKm: 2.7 },
  { id: 'r9', name: 'Seoul Garden', cuisine: 'Korean', emoji: '🍢', address: '129 Baekdu Ave', rating: 4.5, priceLevel: 2, distanceKm: 1.1 },
];

export interface MenuSeedItem {
  category: string;
  name: string;
  price: string;
}

const menuSeeds: Record<string, MenuSeedItem[]> = {
  r1: [
    { category: 'Appetizers', name: 'Burrata al Pomodoro', price: '14' },
    { category: 'Mains', name: 'Tagliatelle al Tartufo', price: '26' },
    { category: 'Mains', name: 'Osso Buco', price: '32' },
    { category: 'Dolci', name: 'Tiramisù', price: '9' },
  ],
  r2: [
    { category: 'Starters', name: 'Guacamole & Chips', price: '8' },
    { category: 'Tacos', name: 'Al Pastor (3)', price: '12' },
    { category: 'Tacos', name: 'Barbacoa (3)', price: '13' },
    { category: 'Postres', name: 'Churros', price: '6' },
  ],
  r3: [
    { category: 'Nigiri', name: 'Otoro', price: '9' },
    { category: 'Rolls', name: 'Rainbow Roll', price: '18' },
    { category: 'Rolls', name: 'Spicy Tuna Roll', price: '14' },
    { category: 'Soup', name: 'Miso Soup', price: '5' },
  ],
};

export function menuSeed(restaurantId: string): MenuSeedItem[] {
  return menuSeeds[restaurantId] ?? [
    { category: "Chef's picks", name: 'House Special', price: '18' },
    { category: 'Mains', name: 'Seasonal Plate', price: '24' },
  ];
}

export function priceSymbols(priceLevel: number): string {
  return '$'.repeat(Math.min(Math.max(priceLevel, 1), 4));
}

/** Resolve a stable restaurant id for a free-typed restaurant name (Log Visit flow). */
export function resolveRestaurantId(name: string, explicitId?: string | null): string {
  if (explicitId) return explicitId;
  const match = seedRestaurants.find((r) => r.name.toLowerCase() === name.toLowerCase());
  if (match) return match.id;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug ? `custom-${slug}` : 'custom-unknown';
}
