// POLOLITOTRABAJOS — Design tokens
// Color palettes, gradients, type scale, spacing.

window.PT_PALETTES = {
  naranja: {
    name: 'Fuego',
    grad: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 50%, #FFB07A 100%)',
    gradStrong: 'linear-gradient(135deg, #E84A1F 0%, #FF6B35 100%)',
    primary: '#FF6B35',
    primaryDeep: '#E84A1F',
    primarySoft: '#FFE6DA',
    primaryInk: '#3D1A0A',
    accent: '#FFB07A',
  },
  violeta: {
    name: 'Pololo',
    grad: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)',
    gradStrong: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
    primary: '#7C3AED',
    primaryDeep: '#5B21B6',
    primarySoft: '#EDE4FE',
    primaryInk: '#1E0E40',
    accent: '#C084FC',
  },
  duo: {
    name: 'Atardecer',
    grad: 'linear-gradient(135deg, #FF6B35 0%, #C53AC8 60%, #7C3AED 100%)',
    gradStrong: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)',
    primary: '#9333EA',
    primaryDeep: '#7C3AED',
    primarySoft: '#FCE7F3',
    primaryInk: '#2A0E40',
    accent: '#FF6B35',
  },
};

window.PT_LIGHT = {
  bg: '#FAFAF8',
  bgAlt: '#F4F2EE',
  surface: '#FFFFFF',
  border: '#E8E4DC',
  borderStrong: '#D4CEC1',
  ink: '#1A1816',
  inkSoft: '#5A554D',
  inkMuted: '#8B857A',
  green: '#10B981',
  greenSoft: '#D1FAE5',
  red: '#EF4444',
  redSoft: '#FEE2E2',
  yellow: '#F59E0B',
  yellowSoft: '#FEF3C7',
};

window.PT_DARK = {
  bg: '#0E0D0C',
  bgAlt: '#161513',
  surface: '#1C1A18',
  border: '#2A2724',
  borderStrong: '#3A3631',
  ink: '#F4F2EE',
  inkSoft: '#A8A39A',
  inkMuted: '#6B665D',
  green: '#34D399',
  greenSoft: '#064E3B',
  red: '#F87171',
  redSoft: '#7F1D1D',
  yellow: '#FBBF24',
  yellowSoft: '#78350F',
};

window.PT_FONT = {
  display: '"Plus Jakarta Sans", -apple-system, system-ui, sans-serif',
  body: '"Plus Jakarta Sans", -apple-system, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
};

// Build full theme object given palette key + dark mode
window.PT_THEME = function(paletteKey, dark) {
  const pal = window.PT_PALETTES[paletteKey] || window.PT_PALETTES.naranja;
  const base = dark ? window.PT_DARK : window.PT_LIGHT;
  return { ...base, ...pal, dark, paletteKey };
};
