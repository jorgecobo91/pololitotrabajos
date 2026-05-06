import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

const getWebStorage = () =>
  (globalThis as Record<string, unknown>).localStorage as
    | { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }
    | undefined;

const WebStorageAdapter = {
  getItem: (key: string) => getWebStorage()?.getItem(key) ?? null,
  setItem: (key: string, value: string) => { getWebStorage()?.setItem(key, value); },
  removeItem: (key: string) => { getWebStorage()?.removeItem(key); },
};

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const storageAdapter = Platform.OS === 'web' ? WebStorageAdapter : ExpoSecureStoreAdapter;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
