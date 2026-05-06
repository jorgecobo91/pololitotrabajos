import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MAX_BYTES = 5 * 1024 * 1024;

async function getAuthUserId(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get('Authorization') || req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice('Bearer '.length).trim();
  if (!token) return null;
  try {
    const client = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    );
    const { data } = await client.auth.getUser(token);
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * POST /api/upload-maestro-foto
 * FormData: file=<imagen>, kind="avatar" | "portfolio"
 * Header: Authorization: Bearer <jwt> del maestro
 *
 * - "avatar": guarda en maestro-fotos/<userId>/avatar.<ext>, actualiza users.foto_url
 * - "portfolio": guarda en maestro-fotos/<userId>/portfolio/<uuid>.<ext>, inserta en portfolio_items
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Sesión requerida' }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get('file');
    const kind = String(form.get('kind') || '');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Falta archivo' }, { status: 400 });
    }
    if (!ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido (JPG, PNG, WebP)' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Máximo 5MB' }, { status: 400 });
    }
    if (kind !== 'avatar' && kind !== 'portfolio') {
      return NextResponse.json({ error: 'kind inválido' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';

    const admin = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    let fileName: string;
    if (kind === 'avatar') {
      // Avatar: nombre fijo para sobreescribir
      fileName = `${userId}/avatar-${crypto.randomUUID()}.${ext}`;
    } else {
      fileName = `${userId}/portfolio/${crypto.randomUUID()}.${ext}`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadErr } = await admin.storage
      .from('maestro-fotos')
      .upload(fileName, arrayBuffer, { contentType: file.type, upsert: false });

    if (uploadErr) {
      console.error('[upload-maestro-foto]', uploadErr.message);
      return NextResponse.json({ error: 'No se pudo subir' }, { status: 500 });
    }

    const { data: pub } = admin.storage.from('maestro-fotos').getPublicUrl(fileName);
    const url = pub.publicUrl;

    if (kind === 'avatar') {
      // Actualizar users.foto_url
      const { error: updErr } = await admin.from('users').update({ foto_url: url }).eq('id', userId);
      if (updErr) {
        console.error('[upload-maestro-foto] users update:', updErr.message);
      }
    } else {
      // portfolio_items.maestro_id apunta a maestro_profiles.id, no users.id
      const { data: profile } = await admin
        .from('maestro_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!profile) {
        return NextResponse.json({ error: 'Perfil de maestro no existe' }, { status: 400 });
      }

      const { error: insErr } = await admin.from('portfolio_items').insert({
        maestro_id: profile.id,
        image_url: url,
      });
      if (insErr) {
        console.error('[upload-maestro-foto] portfolio insert:', insErr.message);
      }
    }

    return NextResponse.json({ url });
  } catch (err: any) {
    console.error('[upload-maestro-foto]', err?.message || err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/upload-maestro-foto?id=<portfolio_item_id>
 * Elimina un item de portafolio (solo del maestro autenticado)
 */
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) return NextResponse.json({ error: 'Sesión requerida' }, { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const admin = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data: profile } = await admin
      .from('maestro_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    if (!profile) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    const { error } = await admin
      .from('portfolio_items')
      .delete()
      .eq('id', id)
      .eq('maestro_id', profile.id);

    if (error) {
      return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[upload-maestro-foto DELETE]', err?.message || err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
