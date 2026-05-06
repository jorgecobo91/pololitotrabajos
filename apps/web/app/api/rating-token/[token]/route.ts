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
 * GET /api/rating-token/[token]
 * Devuelve datos del rating token + maestro + publicación para la página
 * /calificar/[token]. Usa service role para que rating_tokens pueda tener
 * RLS cerrado (no public read).
 */
export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const token = params.token;
    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    const { data: tk, error: tkErr } = await admin
      .from('rating_tokens')
      .select('id, maestro_id, respuesta_id, rating_status, expires_at')
      .eq('token', token)
      .maybeSingle();

    if (tkErr || !tk) {
      return NextResponse.json({ error: 'Token no válido' }, { status: 404 });
    }

    if (tk.rating_status === 'completed') {
      return NextResponse.json({ error: 'Ya calificaste este trabajo' }, { status: 400 });
    }

    if (tk.expires_at && new Date(tk.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Este enlace ha expirado' }, { status: 400 });
    }

    const [userRes, profileRes] = await Promise.all([
      admin.from('users').select('nombre').eq('id', tk.maestro_id).maybeSingle(),
      admin.from('maestro_profiles').select('oficio').eq('user_id', tk.maestro_id).maybeSingle(),
    ]);

    let pubTitulo: string | null = null;
    if (tk.respuesta_id) {
      const { data: resp } = await admin
        .from('respuestas_maestro')
        .select('publicacion:publicaciones(titulo)')
        .eq('id', tk.respuesta_id)
        .maybeSingle();
      pubTitulo = (resp?.publicacion as any)?.titulo || null;
    }

    return NextResponse.json({
      id: tk.id,
      maestro_id: tk.maestro_id,
      respuesta_id: tk.respuesta_id,
      maestro_nombre: userRes.data?.nombre || 'Maestro',
      maestro_oficio: profileRes.data?.oficio || null,
      publicacion_titulo: pubTitulo,
    });
  } catch (err: any) {
    console.error('[api/rating-token]', err?.message || err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/rating-token/[token]
 * Body: { calidad?, puntualidad?, comunicacion?, precio?, comentario?, no_concretado? }
 * Inserta el rating con service role y marca el token como completed.
 */
export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const token = params.token;
    if (!token) return NextResponse.json({ error: 'Token requerido' }, { status: 400 });

    const body = await req.json();
    const {
      calidad, puntualidad, comunicacion, precio, comentario, no_concretado,
    } = body as {
      calidad?: number; puntualidad?: number; comunicacion?: number; precio?: number;
      comentario?: string; no_concretado?: boolean;
    };

    const admin = getSupabaseAdmin();

    const { data: tk, error: tkErr } = await admin
      .from('rating_tokens')
      .select('id, maestro_id, respuesta_id, rating_status, expires_at')
      .eq('token', token)
      .maybeSingle();

    if (tkErr || !tk) return NextResponse.json({ error: 'Token no válido' }, { status: 404 });
    if (tk.rating_status === 'completed') return NextResponse.json({ error: 'Ya calificado' }, { status: 400 });
    if (tk.expires_at && new Date(tk.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 400 });
    }

    if (!no_concretado) {
      const stars = [calidad, puntualidad, comunicacion, precio];
      if (stars.some((s) => !s || s < 1 || s > 5)) {
        return NextResponse.json({ error: 'Calificaciones inválidas' }, { status: 400 });
      }
      const { error: rErr } = await admin.from('ratings').insert({
        from_id: null,
        to_id: tk.maestro_id,
        respuesta_id: tk.respuesta_id || null,
        calidad: calidad!,
        puntualidad: puntualidad!,
        comunicacion: comunicacion!,
        precio: precio!,
        comentario: comentario || null,
      });
      if (rErr) {
        console.error('[api/rating-token] insert rating error:', rErr.message);
        return NextResponse.json({ error: 'No se pudo guardar la calificación' }, { status: 500 });
      }
    }

    await admin.from('rating_tokens').update({ rating_status: 'completed' }).eq('id', tk.id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[api/rating-token POST]', err?.message || err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
