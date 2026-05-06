export const fontFamilies = {
  display: 'PlusJakartaSans',
  body: 'PlusJakartaSans',
  mono: 'JetBrainsMono',
} as const;

export const typeScale = {
  'display.h1': { size: 24, weight: '800', letterSpacing: -0.7, lineHeight: 1.15 },
  'display.h2': { size: 22, weight: '800', letterSpacing: -0.5, lineHeight: 1.2 },
  'display.h3': { size: 20, weight: '800', letterSpacing: -0.4, lineHeight: 1.2 },
  'display.h4': { size: 18, weight: '800', letterSpacing: -0.3, lineHeight: 1.25 },
  'display.title': { size: 16, weight: '800', letterSpacing: -0.3, lineHeight: 1.3 },
  'display.cardTitle': { size: 15.5, weight: '700', letterSpacing: -0.2, lineHeight: 1.25 },
  'body.lg': { size: 14, weight: '600', letterSpacing: 0, lineHeight: 1.4 },
  'body.md': { size: 13.5, weight: '400', letterSpacing: 0, lineHeight: 1.45 },
  'body.sm': { size: 12.5, weight: '400', letterSpacing: 0, lineHeight: 1.45 },
  'body.xs': { size: 12, weight: '600', letterSpacing: 0.1, lineHeight: 1.4 },
  'label.lg': { size: 11.5, weight: '700', letterSpacing: 0.4, lineHeight: 1.3 },
  'label.sm': { size: 11, weight: '600', letterSpacing: 0.4, lineHeight: 1.3 },
  'caption': { size: 10.5, weight: '600', letterSpacing: 0.2, lineHeight: 1.3 },
  'tiny': { size: 10, weight: '700', letterSpacing: 0.4, lineHeight: 1.3 },
} as const;
