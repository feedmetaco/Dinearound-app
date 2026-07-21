// Static catalog + helpers for the DineAround prototype (mirrors web/types/index.ts shape)
window.DINEAROUND_RESTAURANTS = [
  { id: 'r1', name: 'Nonna Rosa', cuisine: 'Italian', emoji: '🍝', address: '214 Mulberry St', rating: 4.7, price_level: 3, distanceKm: 0.6 },
  { id: 'r2', name: 'Casa Verde', cuisine: 'Mexican', emoji: '🌮', address: '88 Alvarado Ave', rating: 4.4, price_level: 2, distanceKm: 1.4 },
  { id: 'r3', name: 'Sakura Table', cuisine: 'Japanese', emoji: '🍣', address: '19 Cherry Ln', rating: 4.8, price_level: 4, distanceKm: 2.1 },
  { id: 'r4', name: 'Saffron & Clove', cuisine: 'Indian', emoji: '🍛', address: '502 Spice Market Rd', rating: 4.5, price_level: 2, distanceKm: 0.9 },
  { id: 'r5', name: 'Bangkok Basil', cuisine: 'Thai', emoji: '🍜', address: '77 Riverside Dr', rating: 4.3, price_level: 2, distanceKm: 3.2 },
  { id: 'r6', name: 'Le Petit Four', cuisine: 'French', emoji: '🥐', address: '10 Rue Fictive', rating: 4.6, price_level: 4, distanceKm: 1.8 },
  { id: 'r7', name: 'The Griddle House', cuisine: 'American', emoji: '🍔', address: '345 Main St', rating: 4.2, price_level: 1, distanceKm: 0.3 },
  { id: 'r8', name: 'Olive & Sea', cuisine: 'Mediterranean', emoji: '🥙', address: '61 Harbor Walk', rating: 4.6, price_level: 3, distanceKm: 2.7 },
  { id: 'r9', name: 'Seoul Garden', cuisine: 'Korean', emoji: '🍢', address: '129 Baekdu Ave', rating: 4.5, price_level: 2, distanceKm: 1.1 },
];

window.DINEAROUND_CUISINES = ['Italian', 'Mexican', 'Japanese', 'Indian', 'Thai', 'French', 'American', 'Mediterranean', 'Korean'];

// Simple deterministic "OCR" seed data used when a menu photo is captured
window.DINEAROUND_MENU_SEEDS = {
  r1: [ { category: 'Appetizers', name: 'Burrata al Pomodoro', price: '14' }, { category: 'Mains', name: 'Tagliatelle al Tartufo', price: '26' }, { category: 'Mains', name: 'Osso Buco', price: '32' }, { category: 'Dolci', name: 'Tiramisù', price: '9' } ],
  r2: [ { category: 'Starters', name: 'Guacamole & Chips', price: '8' }, { category: 'Tacos', name: 'Al Pastor (3)', price: '12' }, { category: 'Tacos', name: 'Barbacoa (3)', price: '13' }, { category: 'Postres', name: 'Churros', price: '6' } ],
  r3: [ { category: 'Nigiri', name: 'Otoro', price: '9' }, { category: 'Rolls', name: 'Rainbow Roll', price: '18' }, { category: 'Rolls', name: 'Spicy Tuna Roll', price: '14' }, { category: 'Soup', name: 'Miso Soup', price: '5' } ],
};
