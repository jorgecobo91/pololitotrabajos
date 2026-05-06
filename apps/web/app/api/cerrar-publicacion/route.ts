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
 * POST /api/cerrar-publicacion
 * Body: { token: string, maestro_ganador_id: string | null, respuesta_id: string | null }
 *
 * Acción del cliente anónimo (autenticado por token de la publicación):
 * - Marca la publicación como `cerrada`
 * - Si elige un maestro: guarda maestro_ganador_id + crea rating_token + dispara email para calificar
 * - Si elige "ninguno": solo cierra, no manda email
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, maestro_ganador_id, respuesta_id } = body as {
      token?: string;
      maestro_ganador_id?: string | null;
      respuesta_id?: string | null;
    };

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    // Validar la publicación por token
    const { data: pub, error: pubErr } = await admin
      .from('publicaciones')
      .select('id, estado, email_cliente, nombre_cliente, titulo, token_acceso')
      .eq('token_acceso', token)
      .maybeSingle();

    if (pubErr || !pub) {
      return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 });
    }

    if (pub.estado === 'cerrada') {
      return NextResponse.json({ error: 'Esta publicación ya está cerrada' }, { status: 400 });
    }

    // Si eligió un maestro, validar que esa respuesta exista y pertenezca a esta publicación + maestro
    if (maestro_ganador_id) {
      if (!respuesta_id) {
        return NextResponse.json({ error: 'respuesta_id requerido' }, { status: 400 });
      }
      const { data: resp } = await admin
        .from('respuestas_maestro')
        .select('id, publicacion_id, maestro_id')
        .eq('id', respuesta_id)
        .maybeSingle();

      if (!resp || resp.publicacion_id !== pub.id || resp.maestro_id !== maestro_ganador_id) {
        return NextResponse.json({ error: 'Respuesta inválida' }, { status: 400 });
      }
    }

    // Cerrar publicación
    const { error: updErr } = await admin
      .from('publicaciones')
      .update({
        estado: 'cerrada',
        maestro_ganador_id: maestro_ganador_id || null,
        cerrada_at: new Date().toISOString(),
      })
      .eq('id', pub.id);

    if (updErr) {
      console.error('[cerrar-publicacion] update error:', updErr.message);
      return NextResponse.json({ error: 'No se pudo cerrar' }, { status: 500 });
    }

    // Si eligió maestro: crear rating_token y mandar email (backup) para calificar
    let ratingUrl: string | null = null;
    let ratingToken: string | null = null;
    if (maestro_ganador_id && pub.email_cliente) {
      ratingToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

      const { error: tokErr } = await admin.from('rating_tokens').insert({
        respuesta_id: respuesta_id || null,
        maestro_id: maestro_ganador_id,
        cliente_email: pub.email_cliente,
        token: ratingToken,
        expires_at: expiresAt,
      });

      if (!tokErr) {
        const appUrl = requireEnv('NEXT_PUBLIC_APP_URL');
        ratingUrl = `${appUrl}/calificar/${ratingToken}`;

        // Best-effort email
        try {
          await fetch(`${appUrl}/api/email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'invitacion_calificar',
              email_cliente: pub.email_cliente,
              nombre_cliente: pub.nombre_cliente,
              titulo: pub.titulo,
              maestro_id: maestro_ganador_id,
              rating_url: ratingUrl,
            }),
          });
        } catch (e: any) {
          console.error('[cerrar-publicacion] email failed:', e?.message);
        }
      }
    }

    return NextResponse.json({ success: true, rating_url: ratingUrl, rating_token: ratingToken });
  } catch (err: any) {
    console.error('[cerrar-publicacion]', err?.message || err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
