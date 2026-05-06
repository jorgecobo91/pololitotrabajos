import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  foto_url: string | null;
  roles: string[];
  comuna: string | null;
  region: string | null;
}

/**
 * Robust role check.
 * Handles native arrays and Postgres array string form like "{maestro,cliente}".
 */
function hasRole(roles: string[] | string | null | undefined, role: string): boolean {
  if (!roles) return false;
  if (Array.isArray(roles)) return roles.includes(role);
  if (typeof roles === 'string') {
    const parsed = roles
      .replace(/^\{/, '')
      .replace(/\}$/, '')
      .split(',')
      .map((r) => r.trim().replace(/^"(.*)"$/, '$1'));
    return parsed.includes(role);
  }
  return false;
}

interface AuthState {
  session: Session | null;
  user: UserProfile | null;
  isProvider: boolean;
  isLoading: boolean;
  setSession: (s: Session | null) => void;
  setUser: (u: UserProfile | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isProvider: false,
  isLoading: true,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user, isProvider: hasRole(user?.roles, 'maestro') }),

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session });

      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (data) {
          set({ user: data as UserProfile, isProvider: hasRole(data.roles, 'maestro') });
        }
      }
    } finally {
      set({ isLoading: false });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session });
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (data) {
          set({ user: data as UserProfile, isProvider: hasRole(data.roles, 'maestro') });
        }
      } else {
        set({ user: null, isProvider: false });
      }
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isProvider: false });
  },
}));
