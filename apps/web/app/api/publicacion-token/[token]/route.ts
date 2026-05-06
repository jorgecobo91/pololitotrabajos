import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function getSupabaseAdmin() {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/**
 * GET /api/publicacion-token/[token]
 *
 * Devuelve la publicación + respuestas + datos públicos del maestro.
 * Acceso anónimo por token único (cliente sin cuenta).
 * Reemplaza la query client-side a respuestas_maestro que ahora
 * está bloqueada por RLS tightening.
 */
export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const token = params.token;
    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    // Direct REST call con no-store headers para evitar cualquier cache intermedio
    const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
    const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
    const directRes = await fetch(
      `${supabaseUrl}/rest/v1/publicaciones?select=id,titulo,descripcion,especialidad,ubicacion,comuna,region,urgente,estado,created_at,maestro_ganador_id,presupuesto_min,presupuesto_max&token_acceso=eq.${encodeURIComponent(token)}`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Cache-Control': 'no-store',
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );
    const pubArr = await directRes.json().catch(() => []);
    const pub = Array.isArray(pubArr) && pubArr.length > 0 ? pubArr[0] : null;

    if (!pub) {
      return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 });
    }

    // Sin .order(): hay un bug con PostgREST + .order('created_at') que devuelve 0 rows.
    // Ordenamos en JS abajo.
    const { data: respuestasRaw, error: respErr } = await admin
      .from('respuestas_maestro')
      .select('id, presupuesto, tiempo_entrega, mensaje, created_at, maestro_id')
      .eq('publicacion_id', pub.id);

    const respuestas = (respuestasRaw || []).sort((a: any, b: any) => {
      const da = new Date(a.created_at || 0).getTime();
      const db = new Date(b.created_at || 0).getTime();
      return db - da;
    });

    if (respErr) console.error('[api/publicacion-token] respuestas error:', respErr.message);

    const maestroIds = (respuestas || []).map((r: any) => r.maestro_id);
    let maestrosMap: Record<string, any> = {};
    if (maestroIds.length) {
      const [usersRes, profilesRes] = await Promise.all([
        admin.from('users').select('id, nombre, foto_url, comuna, telefono').in('id', maestroIds),
        admin.from('maestro_profiles').select('user_id, oficio, rating_promedio, experiencia_anios, telefono_publico').in('user_id', maestroIds),
      ]);
      for (const u of usersRes.data || []) maestrosMap[u.id] = { ...maestrosMap[u.id], ...u };
      for (const p of profilesRes.data || []) {
        const existing = maestrosMap[p.user_id] || {};
        // Solo expongo telefono si telefono_publico=true
        if (!p.telefono_publico) delete existing.telefono;
        maestrosMap[p.user_id] = { ...existing, ...p };
      }
    }

    return NextResponse.json({
      ...pub,
      respuestas: (respuestas || []).map((r: any) => ({
        ...r,
        maestro: maestrosMap[r.maestro_id] || null,
      })),
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error('[api/publicacion-token]', err?.message || err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
