export const VALID_COFFEE_BLENDS = [
  'espresso',
  'americano',
  'latte',
  'cappuccino',
  'macchiato',
  'mocha',
  'cold_brew',
  'frappuccino',
] as const;

export type CoffeeBlend = typeof VALID_COFFEE_BLENDS[number];
