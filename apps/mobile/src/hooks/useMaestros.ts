import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface MaestroRow {
  id: string;
  user_id: string;
  oficio: string;
  especialidades: string[];
  bio: string;
  experiencia_anios: number;
  zona_cobertura: string;
  telefono_publico: boolean;
  disponible: boolean;
  rating_promedio: number;
  total_trabajos: number;
  total_ratings: number;
  users: {
    nombre: string;
    email: string;
    foto_url: string | null;
    comuna: string | null;
    region: string | null;
    telefono: string | null;
  };
}

export function useMaestros(filters?: { especialidad?: string; search?: string }) {
  return useQuery({
    queryKey: ['maestros', filters],
    queryFn: async () => {
      let query = supabase
        .from('maestro_profiles')
        .select('*, users!inner(nombre, email, foto_url, comuna, region, telefono)')
        .order('rating_promedio', { ascending: false });

      if (filters?.especialidad) {
        query = query.eq('oficio', filters.especialidad);
      }

      const { data, error } = await query;
      if (error) throw error;

      let results = data as MaestroRow[];

      if (filters?.search) {
        const lower = filters.search.toLowerCase();
        results = results.filter((m) => {
          const nombreMatch = m.users?.nombre?.toLowerCase().includes(lower);
          const oficioMatch = m.oficio?.toLowerCase().includes(lower);
          const especialidadesMatch = m.especialidades?.some(
            (esp) => esp.toLowerCase().includes(lower)
          );
          return nombreMatch || oficioMatch || especialidadesMatch;
        });
      }

      return results;
    },
  });
}

export function useMaestroDetail(userId: string) {
  return useQuery({
    queryKey: ['maestro', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maestro_profiles')
        .select('*, users!inner(nombre, email, foto_url, comuna, region, telefono), portfolio_items(*)')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      const { data: ratings } = await supabase
        .from('ratings')
        .select('calidad, puntualidad, comunicacion, precio')
        .eq('to_id', userId);

      const ratingSummary = ratings && ratings.length > 0
        ? {
            total: ratings.length,
            calidad_avg: ratings.reduce((s, r) => s + r.calidad, 0) / ratings.length,
            puntualidad_avg: ratings.reduce((s, r) => s + r.puntualidad, 0) / ratings.length,
            comunicacion_avg: ratings.reduce((s, r) => s + r.comunicacion, 0) / ratings.length,
            precio_avg: ratings.reduce((s, r) => s + r.precio, 0) / ratings.length,
            promedio: ratings.reduce((s, r) => s + (r.calidad + r.puntualidad + r.comunicacion + r.precio) / 4, 0) / ratings.length,
          }
        : null;

      return { ...data, ratingSummary };
    },
    enabled: !!userId,
  });
}
