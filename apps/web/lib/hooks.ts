'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import type { MaestroProfileFormData } from './validations';

export function useMaestros(filters?: { especialidad?: string; search?: string }) {
  return useQuery({
    queryKey: ['maestros', filters],
    queryFn: async () => {
      let query = supabase
        .from('maestro_profiles')
        .select('*, user:users(*)')
        .eq('accepted_terms', true)
        .order('rating_promedio', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      let results = data || [];
      if (filters?.especialidad) {
        results = results.filter((m: any) =>
          m.especialidades?.includes(filters.especialidad)
        );
      }
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        results = results.filter((m: any) =>
          m.user?.nombre?.toLowerCase().includes(s) ||
          m.oficio?.toLowerCase().includes(s) ||
          m.especialidades?.some((e: string) => e.toLowerCase().includes(s))
        );
      }
      return results;
    },
  });
}

export function useMaestroDetail(userId: string) {
  return useQuery({
    queryKey: ['maestro', userId],
    queryFn: async () => {
      const profileRes = await supabase
        .from('maestro_profiles')
        .select('*, user:users(*)')
        .eq('user_id', userId)
        .single();
      if (profileRes.error) throw profileRes.error;

      const profileId = profileRes.data?.id;

      const [portfolioRes, ratingsRes] = await Promise.all([
        profileId
          ? supabase.from('portfolio_items').select('*').eq('maestro_id', profileId).order('created_at', { ascending: false })
          : Promise.resolve({ data: [] as any[] }),
        supabase
          .from('ratings')
          .select('id, calidad, puntualidad, comunicacion, precio, comentario, created_at')
          .eq('to_id', userId)
          .order('created_at', { ascending: false }),
      ]);

      const ratings = ratingsRes.data || [];
      const avg = (field: string) => {
        if (!ratings.length) return 0;
        return ratings.reduce((sum: number, r: any) => sum + (r[field] || 0), 0) / ratings.length;
      };

      return {
        ...profileRes.data,
        portfolio: portfolioRes.data || [],
        ratings: {
          total: ratings.length,
          calidad: avg('calidad'),
          puntualidad: avg('puntualidad'),
          comunicacion: avg('comunicacion'),
          precio: avg('precio'),
          promedio: profileRes.data.rating_promedio || 0,
          // Lista cruda de reseñas para mostrar comentarios individuales
          list: ratings,
        },
      };
    },
    enabled: !!userId,
  });
}

export function usePublicaciones() {
  return useQuery({
    queryKey: ['publicaciones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*, autor:users!publicaciones_autor_id_fkey(*)')
        .eq('estado', 'abierta')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}


export function useMutateMaestroProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MaestroProfileFormData) => {
      const payload = {
        user_id: userId,
        oficio: data.oficio,
        especialidades: data.especialidades,
        bio: data.bio || '',
        experiencia_anios: parseInt(data.experiencia, 10),
        zona_cobertura: JSON.stringify(data.zona_cobertura),
        telefono_publico: data.telefono_publico,
        disponible: data.disponible,
        disponible_urgencias: data.disponible_urgencias,
        accepted_terms: data.accepted_terms,
        accepted_terms_at: new Date().toISOString(),
        terms_version: '1.0',
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('maestro_profiles')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maestro', userId] });
      queryClient.invalidateQueries({ queryKey: ['maestros'] });
    },
  });
}

export function usePublicacionDetail(id: string) {
  return useQuery({
    queryKey: ['publicacion', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*, autor:users!publicaciones_autor_id_fkey(nombre, foto_url, comuna, region)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useRespuestas(publicacionId: string) {
  return useQuery({
    queryKey: ['respuestas', publicacionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('respuestas_maestro')
        .select('*, maestro:users!respuestas_maestro_maestro_public_users_fkey(nombre, foto_url, comuna)')
        .eq('publicacion_id', publicacionId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!publicacionId,
  });
}

export function useMiRespuesta(publicacionId: string, maestroId: string) {
  return useQuery({
    queryKey: ['mi-respuesta', publicacionId, maestroId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('respuestas_maestro')
        .select('*')
        .eq('publicacion_id', publicacionId)
        .eq('maestro_id', maestroId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!publicacionId && !!maestroId,
  });
}

export function useMutateRespuesta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      publicacion_id: string;
      maestro_id: string;
      presupuesto: number | null;
      tiempo_entrega: string;
      mensaje: string;
    }) => {
      const { data: inserted, error } = await supabase
        .from('respuestas_maestro')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return inserted;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['respuestas', variables.publicacion_id] });
      queryClient.invalidateQueries({ queryKey: ['mi-respuesta', variables.publicacion_id, variables.maestro_id] });
      queryClient.invalidateQueries({ queryKey: ['publicaciones'] });
    },
  });
}

export function useMisPublicaciones(userId: string) {
  return useQuery({
    queryKey: ['mis-publicaciones', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*, respuestas_maestro(count)')
        .eq('autor_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function usePublicacionByToken(token: string) {
  return useQuery({
    queryKey: ['publicacion-token', token],
    queryFn: async () => {
      const res = await fetch(`/api/publicacion-token/${encodeURIComponent(token)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'No se pudo cargar la publicación');
      }
      return res.json();
    },
    enabled: !!token,
  });
}

/** Mis solicitudes = respuestas que yo (maestro) envié a publicaciones */
export function useMisSolicitudes(maestroId: string) {
  return useQuery({
    queryKey: ['mis-solicitudes', maestroId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('respuestas_maestro')
        .select('id, presupuesto, tiempo_entrega, mensaje, created_at, publicacion:publicaciones(id, titulo, descripcion, ubicacion, especialidad, estado, urgente, created_at)')
        .eq('maestro_id', maestroId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!maestroId,
  });
}

/** Mis reseñas = ratings recibidas como maestro */
export function useMisRatings(maestroId: string) {
  return useQuery({
    queryKey: ['mis-ratings', maestroId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('to_id', maestroId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!maestroId,
  });
}
