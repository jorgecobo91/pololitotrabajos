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
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * POST /api/upload-foto
 * Body: multipart/form-data con campo "file"
 * Sube la foto al bucket público "publicacion-fotos" usando service role.
 * Devuelve { url } pública.
 *
 * Pensado para el formulario de publicar (cliente anónimo).
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Falta archivo' }, { status: 400 });
    }
    if (!ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido (JPG, PNG, WebP)' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Máximo 5MB por foto' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `anon/${crypto.randomUUID()}.${ext}`;

    const admin = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadErr } = await admin.storage
      .from('publicacion-fotos')
      .upload(fileName, arrayBuffer, { contentType: file.type, upsert: false });

    if (uploadErr) {
      console.error('[upload-foto]', uploadErr.message);
      return NextResponse.json({ error: 'No se pudo subir' }, { status: 500 });
    }

    const { data: pub } = admin.storage.from('publicacion-fotos').getPublicUrl(fileName);

    return NextResponse.json({ url: pub.publicUrl });
  } catch (err: any) {
    console.error('[upload-foto]', err?.message || err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
