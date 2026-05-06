import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './index.ts'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        pt: {
          bg: '#FAFAF8',
          'bg-alt': '#F4F2EE',
          surface: '#FFFFFF',
          border: '#E8E4DC',
          'border-strong': '#D4CEC1',
          ink: '#1A1816',
          'ink-soft': '#5A554D',
          'ink-muted': '#8B857A',
          primary: '#9333EA',
          'primary-deep': '#7C3AED',
          'primary-soft': '#FCE7F3',
          'primary-ink': '#2A0E40',
          accent: '#FF6B35',
          green: '#10B981',
          'green-soft': '#D1FAE5',
          red: '#EF4444',
          'red-soft': '#FEE2E2',
          star: '#F59E0B',
          'star-soft': '#FEF3C7',
        },
      },
      fontFamily: {
        'jakarta-regular': ['PlusJakartaSans_400Regular'],
        'jakarta-medium': ['PlusJakartaSans_500Medium'],
        'jakarta-semibold': ['PlusJakartaSans_600SemiBold'],
        'jakarta-bold': ['PlusJakartaSans_700Bold'],
        'jakarta-extrabold': ['PlusJakartaSans_800ExtraBold'],
        'jetbrains': ['JetBrainsMono_400Regular'],
        'jetbrains-medium': ['JetBrainsMono_500Medium'],
      },
      borderRadius: {
        'pt-sm': '8px',
        'pt-md': '10px',
        'pt-lg': '12px',
        'pt-xl': '14px',
        'pt-2xl': '16px',
        'pt-3xl': '18px',
      },
      spacing: {
        'pt-1': '4px',
        'pt-2': '6px',
        'pt-3': '8px',
        'pt-4': '10px',
        'pt-5': '12px',
        'pt-6': '14px',
        'pt-7': '16px',
        'pt-8': '18px',
        'pt-9': '20px',
        'pt-10': '24px',
        'pt-12': '32px',
        'pt-screen': '18px',
      },
    },
  },
  plugins: [],
};

export default config;
