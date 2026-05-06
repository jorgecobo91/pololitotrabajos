export const palettes = {
  atardecer: {
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #C53AC8 60%, #7C3AED 100%)',
    gradientStrong: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)',
    gradientStops: ['#FF6B35', '#C53AC8', '#7C3AED'] as const,
    primary: '#9333EA',
    primaryDeep: '#7C3AED',
    primarySoft: '#FCE7F3',
    primaryInk: '#2A0E40',
    accent: '#FF6B35',
  },
  fuego: {
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 50%, #FFB07A 100%)',
    gradientStrong: 'linear-gradient(135deg, #E84A1F 0%, #FF6B35 100%)',
    gradientStops: ['#FF6B35', '#FF8E53', '#FFB07A'] as const,
    primary: '#FF6B35',
    primaryDeep: '#E84A1F',
    primarySoft: '#FFE6DA',
    primaryInk: '#3D1A0A',
    accent: '#FFB07A',
  },
  pololo: {
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)',
    gradientStrong: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
    gradientStops: ['#7C3AED', '#A855F7', '#C084FC'] as const,
    primary: '#7C3AED',
    primaryDeep: '#5B21B6',
    primarySoft: '#EDE4FE',
    primaryInk: '#1E0E40',
    accent: '#C084FC',
  },
} as const;

export const light = {
  bg: '#FAFAF8',
  bgAlt: '#F4F2EE',
  surface: '#FFFFFF',
  border: '#E8E4DC',
  borderStrong: '#D4CEC1',
  ink: '#1A1816',
  inkSoft: '#5A554D',
  inkMuted: '#8B857A',
} as const;

export const dark = {
  bg: '#0E0D0C',
  bgAlt: '#161513',
  surface: '#1C1A18',
  border: '#2A2724',
  borderStrong: '#3A3631',
  ink: '#F4F2EE',
  inkSoft: '#A8A39A',
  inkMuted: '#6B665D',
} as const;

export const states = {
  green: { light: '#10B981', dark: '#34D399', softLight: '#D1FAE5', softDark: '#064E3B' },
  red: { light: '#EF4444', dark: '#F87171', softLight: '#FEE2E2', softDark: '#7F1D1D' },
  yellow: { light: '#F59E0B', dark: '#FBBF24', softLight: '#FEF3C7', softDark: '#78350F' },
  star: '#F59E0B',
} as const;

export const landing = {
  neutrals: {
    white: '#FFFFFF',
    offWhite: '#F7F7F9',
    border: '#E8E6EF',
    ink: '#0F0B1A',
  },
  violet: {
    primary: '#7C3AED',
    deep: '#5B21B6',
    soft: '#EDE4FE',
    darkBg: '#1E0E40',
  },
  gradient: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)',
} as const;
