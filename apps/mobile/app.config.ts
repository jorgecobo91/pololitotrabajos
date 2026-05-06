import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'POLOLITOTRABAJOS',
  slug: 'pololitotrabajos',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#FAFAF8',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'cl.pololitotrabajos.app',
    buildNumber: '1.0.0',
    infoPlist: {
      NSCameraUsageDescription: 'Necesitamos tu cámara para subir fotos de trabajos',
      NSPhotoLibraryUsageDescription: 'Necesitamos acceso a tu galería para subir fotos',
      NSLocationWhenInUseUsageDescription: 'Necesitamos tu ubicación para mostrar maestros cerca tuyo',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#9333EA',
    },
    package: 'cl.pololitotrabajos.app',
    permissions: [
      'CAMERA',
      'READ_MEDIA_IMAGES',
      'ACCESS_FINE_LOCATION',
      'POST_NOTIFICATIONS',
    ],
    softwareKeyboardLayoutMode: 'pan',
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  scheme: 'pololitotrabajos',
  plugins: ['expo-font', 'expo-secure-store'],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    APP_URL: process.env.EXPO_PUBLIC_APP_URL || 'https://web-lac-six-99.vercel.app',
  },
});
