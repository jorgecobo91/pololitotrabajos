export const spacing = {
  0: 0,
  1: 4,
  2: 6,
  3: 8,
  4: 10,
  5: 12,
  6: 14,
  7: 16,
  8: 18,
  9: 20,
  10: 24,
  12: 32,
} as const;

export const radii = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 16,
  '3xl': 18,
  pill: 999,
} as const;

export const shadows = {
  none: 'none',
  card: '0 1px 2px rgba(0,0,0,0.04)',
  buttonPrimary: '0 6px 18px -6px rgba(0,0,0,0.28)',
  toast: '0 12px 30px -12px rgba(0,0,0,0.25)',
  modal: '0 16px 40px -12px rgba(0,0,0,0.3)',
} as const;

export const motion = {
  fast: { duration: 100, easing: 'ease-out' },
  base: { duration: 150, easing: 'ease-out' },
  slide: { duration: 250, easing: 'cubic-bezier(.2,.7,.3,1)' },
  page: { duration: 300, easing: 'ease-in-out' },
} as const;
