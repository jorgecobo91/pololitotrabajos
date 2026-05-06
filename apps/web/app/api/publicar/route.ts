import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { publicacionSchema } from '@/lib/validations';

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
 * POST /api/publicar
 * Permite que cliente anónimo cree una publicación.
 * Valida con Zod, genera token_acceso, dispara email de confirmación.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar input con schema canónico
    const parsed = publicacionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        error: 'Datos inválidos',
        issues: parsed.error.issues,
      }, { status: 400 });
    }

    const data = parsed.data;
    const admin = getSupabaseAdmin();
    const tokenAcceso = crypto.randomUUID();

    // Limpiar teléfono: dejar solo dígitos
    const telefonoLimpio = data.telefono_cliente.replace(/\D/g, '');

    const { data: inserted, error } = await admin.from('publicaciones').insert({
      autor_id: null,
      titulo: data.titulo,
      descripcion: data.descripcion,
      especialidad: data.especialidad,
      ubicacion: data.ubicacion,
      region: data.region,
      comuna: data.comuna,
      urgente: data.urgente,
      nombre_cliente: data.nombre_cliente,
      email_cliente: data.email_cliente,
      telefono_cliente: telefonoLimpio,
      mostrar_email: !!data.mostrar_email,
      mostrar_telefono: !!data.mostrar_telefono,
      accepted_terms: data.accepted_terms,
      presupuesto_min: data.presupuesto_min ?? null,
      presupuesto_max: data.presupuesto_max ?? null,
      estado: 'abierta',
      token_acceso: tokenAcceso,
      fotos: data.fotos || [],
    }).select('id, token_acceso').single();

    if (error || !inserted) {
      console.error('[api/publicar] insert error:', error?.message);
      return NextResponse.json({ error: 'No se pudo crear la publicación' }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

    // Email de confirmación al cliente (best-effort)
    if (appUrl) {
      try {
        await fetch(`${appUrl}/api/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'publicacion_confirmacion',
            publicacion_id: inserted.id,
            token_acceso: inserted.token_acceso,
            email_cliente: data.email_cliente,
            nombre_cliente: data.nombre_cliente,
            titulo: data.titulo,
          }),
        });
      } catch (emailErr: any) {
        console.error('[api/publicar] email cliente failed:', emailErr?.message);
      }

      // Notificación a maestros que matchean oficio + comuna (best-effort, no bloquea)
      try {
        await fetch(`${appUrl}/api/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'notificar_maestros_zona',
            publicacion_id: inserted.id,
          }),
        });
      } catch (notifErr: any) {
        console.error('[api/publicar] notif maestros failed:', notifErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      id: inserted.id,
      token_acceso: inserted.token_acceso,
    });
  } catch (err: any) {
    console.error('[api/publicar]', err?.message || err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
