import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// ============================================================
// Hardening: throw if env vars missing. No silent fallbacks.
// ============================================================

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function getResend(): Resend {
  return new Resend(requireEnv('RESEND_API_KEY'));
}

function getSupabaseAdmin() {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

function getAppUrl(): string {
  return requireEnv('NEXT_PUBLIC_APP_URL');
}

// Default usa el dominio gratis de Resend (onboarding@resend.dev) para que
// los emails funcionen sin requerir verificación de dominio. Cuando el usuario
// verifique pololitotrabajos.cl en Resend dashboard, sobrescribir con
// EMAIL_FROM env var (ej: "pololitotrabajos <noreply@pololitotrabajos.cl>").
const FROM_EMAIL = process.env.EMAIL_FROM || 'pololitotrabajos <onboarding@resend.dev>';

// Email validation regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================================
// JWT verification helper — server-side validation of caller's session
// ============================================================

/**
 * Returns the authenticated user_id from the request's Authorization Bearer
 * token, or null if no valid token. Uses the public Supabase URL + anon key
 * to validate the JWT against Supabase Auth.
 */
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

// ============================================================
// POST handler — dispatch by `type`
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;

    if (type === 'maestro_respuesta') return handleMaestroRespuesta(body, req);
    if (type === 'publicacion_confirmacion') return handlePublicacionConfirmacion(body);
    if (type === 'recuperar_publicacion') return handleRecuperarPublicacion(body);
    if (type === 'invitacion_calificar') return handleInvitacionCalificar(body);
    if (type === 'notificar_maestros_zona') return handleNotificarMaestrosZona(body);

    return NextResponse.json({ error: 'Unknown email type' }, { status: 400 });
  } catch (err: any) {
    // Server-side log for Vercel; do not leak details to client
    console.error('[email-api]', err?.message || err);
    return NextResponse.json({ error: 'Email service error' }, { status: 500 });
  }
}

// ============================================================
// Type 1: maestro_respuesta
// Hardening: validate ownership server-side. Body fields with
// sensitive data (maestro_nombre, maestro_oficio, cliente_email)
// are IGNORED. Everything is fetched from DB by trusted IDs.
// ============================================================

async function handleMaestroRespuesta(body: {
  respuesta_id?: string;
  maestro_id?: string;
  publicacion_id?: string;
}, req: NextRequest) {
  const { respuesta_id, maestro_id, publicacion_id } = body;

  if (!respuesta_id || !maestro_id || !publicacion_id) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
  }

  // Hardening: caller must be authenticated AND match maestro_id
  const callerId = await getAuthUserId(req);
  if (!callerId) {
    return NextResponse.json({ error: 'Sesión requerida' }, { status: 401 });
  }
  if (callerId !== maestro_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const admin = getSupabaseAdmin();

  // Validate ownership: respuesta must exist and belong to (maestro_id, publicacion_id)
  const { data: respuesta, error: respErr } = await admin
    .from('respuestas_maestro')
    .select('id, maestro_id, publicacion_id, presupuesto, tiempo_entrega, mensaje')
    .eq('id', respuesta_id)
    .single();

  if (respErr || !respuesta) {
    return NextResponse.json({ error: 'Respuesta no encontrada' }, { status: 404 });
  }

  if (respuesta.maestro_id !== maestro_id || respuesta.publicacion_id !== publicacion_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  // Fetch trusted maestro data
  const [userRes, profileRes] = await Promise.all([
    admin.from('users').select('nombre').eq('id', maestro_id).single(),
    admin.from('maestro_profiles').select('oficio, rating_promedio').eq('user_id', maestro_id).single(),
  ]);

  const maestro_nombre = userRes.data?.nombre || 'Maestro';
  const maestro_oficio = profileRes.data?.oficio || '';
  const maestro_rating = profileRes.data?.rating_promedio ?? 0;

  // Fetch trusted publicacion data
  const { data: pub } = await admin
    .from('publicaciones')
    .select('titulo, autor_id, email_cliente, token_acceso, nombre_cliente')
    .eq('id', publicacion_id)
    .single();

  if (!pub) {
    return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 });
  }

  let cliente_email = pub.email_cliente || '';
  let cliente_nombre = pub.nombre_cliente || '';

  if (!cliente_email && pub.autor_id) {
    const { data: { user: authUser } } = await admin.auth.admin.getUserById(pub.autor_id);
    if (authUser?.email) cliente_email = authUser.email;
    if (!cliente_nombre) {
      const { data: clienteUser } = await admin.from('users').select('nombre').eq('id', pub.autor_id).single();
      cliente_nombre = clienteUser?.nombre || 'Cliente';
    }
  } else if (pub.autor_id && !cliente_nombre) {
    const { data: clienteUser } = await admin.from('users').select('nombre').eq('id', pub.autor_id).single();
    cliente_nombre = clienteUser?.nombre || 'Cliente';
  }
  if (!cliente_nombre) cliente_nombre = 'Cliente';

  if (!cliente_email || !EMAIL_RE.test(cliente_email)) {
    return NextResponse.json({ error: 'Email del cliente inválido' }, { status: 400 });
  }

  const publicacion_titulo = pub.titulo || 'Tu solicitud';
  const publicacion_token = pub.token_acceso || '';
  const presupuesto: number | null = respuesta.presupuesto ?? null;
  const tiempo_entrega = respuesta.tiempo_entrega;
  const mensaje = respuesta.mensaje || '';

  // Generate rating token with explicit TTL
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error: tokenErr } = await admin.from('rating_tokens').insert({
    respuesta_id,
    maestro_id,
    cliente_email,
    token,
    expires_at: expiresAt,
  });

  if (tokenErr) {
    console.error('[email-api] rating_tokens insert error:', tokenErr.message);
    return NextResponse.json({ error: 'No se pudo crear token de calificación' }, { status: 500 });
  }

  const appUrl = getAppUrl();
  const ratingUrl = `${appUrl}/calificar/${token}`;
  const publicacionUrl = publicacion_token
    ? `${appUrl}/mi-publicacion/${publicacion_token}`
    : `${appUrl}/app/publicaciones/${publicacion_id}`;

  const presupuestoFormatted = presupuesto !== null
    ? `$${presupuesto.toLocaleString('es-CL')}`
    : 'A convenir';
  const ratingFormatted = maestro_rating > 0 ? `${maestro_rating.toFixed(1)} ⭐` : 'Nuevo';

  const html = renderMaestroRespuestaEmail({
    cliente_nombre,
    publicacion_titulo,
    maestro_nombre,
    maestro_oficio,
    ratingFormatted,
    presupuestoFormatted,
    tiempo_entrega,
    mensaje,
    publicacionUrl,
    ratingUrl,
  });

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: cliente_email,
    subject: presupuesto !== null
      ? `${maestro_nombre} quiere hacer tu pololito - ${presupuestoFormatted}`
      : `${maestro_nombre} quiere hacer tu pololito`,
    html,
  });

  if (error) {
    console.error('[email-api] resend error:', error.message);
    return NextResponse.json({ error: 'No se pudo enviar el correo' }, { status: 500 });
  }

  return NextResponse.json({ success: true, ratingToken: token });
}

// ============================================================
// Type 2: publicacion_confirmacion
// ============================================================

async function handlePublicacionConfirmacion(body: {
  publicacion_id?: string;
  token_acceso?: string;
  email_cliente?: string;
  nombre_cliente?: string;
  titulo?: string;
}) {
  const { publicacion_id, token_acceso, email_cliente, nombre_cliente, titulo } = body;

  if (!email_cliente || !token_acceso || !publicacion_id) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  if (!EMAIL_RE.test(email_cliente)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
  }

  // Validate that publicacion exists and matches token + email
  const admin = getSupabaseAdmin();
  const { data: pub } = await admin
    .from('publicaciones')
    .select('id, titulo, email_cliente, token_acceso')
    .eq('id', publicacion_id)
    .eq('token_acceso', token_acceso)
    .single();

  if (!pub) {
    return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 });
  }

  // If email_cliente is registered in publicacion, must match
  if (pub.email_cliente && pub.email_cliente !== email_cliente) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const safeTitle = pub.titulo || titulo || 'Tu solicitud';
  const safeName = nombre_cliente?.trim() || '';
  const appUrl = getAppUrl();
  const magicUrl = `${appUrl}/mi-publicacion/${token_acceso}`;

  const html = renderPublicacionConfirmacionEmail({ titulo: safeTitle, magicUrl, nombre: safeName });

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: email_cliente,
    subject: `Tu publicación "${safeTitle}" está activa`,
    html,
  });

  if (error) {
    console.error('[email-api] resend error:', error.message);
    return NextResponse.json({ error: 'No se pudo enviar el correo' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// ============================================================
// Type 3: recuperar_publicacion
// ============================================================

async function handleRecuperarPublicacion(body: { email?: string }) {
  const { email } = body;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: pubs } = await admin
    .from('publicaciones')
    .select('id, titulo, token_acceso, estado, created_at')
    .eq('email_cliente', email)
    .eq('estado', 'abierta')
    .order('created_at', { ascending: false })
    .limit(5);

  // Always return success to prevent email enumeration
  if (!pubs || pubs.length === 0) {
    return NextResponse.json({ success: true });
  }

  const appUrl = getAppUrl();
  const html = renderRecuperarEmail({ pubs, appUrl });

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Tus publicaciones en pololitotrabajos',
    html,
  });

  if (error) {
    console.error('[email-api] resend error:', error.message);
    return NextResponse.json({ error: 'No se pudo enviar el correo' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// ============================================================
// Type 4: invitacion_calificar (cliente cierra publicacion -> califica maestro)
// ============================================================

async function handleInvitacionCalificar(body: {
  email_cliente?: string;
  nombre_cliente?: string;
  titulo?: string;
  maestro_id?: string;
  rating_url?: string;
}) {
  const { email_cliente, nombre_cliente, titulo, maestro_id, rating_url } = body;

  if (!email_cliente || !EMAIL_RE.test(email_cliente) || !maestro_id || !rating_url) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: maestro } = await admin
    .from('users')
    .select('nombre')
    .eq('id', maestro_id)
    .maybeSingle();

  const safeMaestroNombre = maestro?.nombre || 'el maestro';
  const safeNombre = nombre_cliente?.trim() || '';
  const safeTitulo = titulo || 'tu solicitud';

  const html = renderInvitacionCalificarEmail({
    nombre: safeNombre,
    maestroNombre: safeMaestroNombre,
    titulo: safeTitulo,
    ratingUrl: rating_url,
  });

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: email_cliente,
    subject: `Califica tu experiencia con ${safeMaestroNombre}`,
    html,
  });

  if (error) {
    console.error('[email-api] resend error:', error.message);
    return NextResponse.json({ error: 'No se pudo enviar el correo' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// ============================================================
// Type 5: notificar_maestros_zona
// ============================================================

async function handleNotificarMaestrosZona(body: { publicacion_id?: string }) {
  const { publicacion_id } = body;
  if (!publicacion_id) return NextResponse.json({ error: 'Falta publicacion_id' }, { status: 400 });

  const admin = getSupabaseAdmin();

  const { data: pub } = await admin
    .from('publicaciones')
    .select('id, titulo, descripcion, especialidad, comuna, region, urgente, token_acceso')
    .eq('id', publicacion_id)
    .maybeSingle();

  if (!pub) return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 });

  // Buscar maestros que matchean oficio (publicacion.especialidad) y están disponibles + accepted_terms
  // Filtramos por oficio principal o que tengan la especialidad en su array
  const { data: profiles } = await admin
    .from('maestro_profiles')
    .select('user_id, oficio, especialidades, zona_cobertura, disponible')
    .eq('accepted_terms', true);

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ success: true, sent: 0 });
  }

  const matching = profiles.filter((p: any) => {
    if (p.disponible === false) return false;
    const oficioMatch = p.oficio === pub.especialidad
      || (Array.isArray(p.especialidades) && p.especialidades.includes(pub.especialidad));
    if (!oficioMatch) return false;

    // Filtrar por comuna (zona_cobertura es JSON string con array de comunas)
    if (pub.comuna && p.zona_cobertura) {
      try {
        const zonas: string[] = JSON.parse(p.zona_cobertura);
        if (!zonas.includes(pub.comuna)) return false;
      } catch {
        // si no se puede parsear, dejarlo pasar (mejor enviar de más que de menos)
      }
    }
    return true;
  });

  if (matching.length === 0) {
    return NextResponse.json({ success: true, sent: 0 });
  }

  // Obtener emails de los maestros matching (auth.users)
  const userIds = matching.map((p: any) => p.user_id);
  const emails: { email: string; nombre: string }[] = [];

  // Supabase Auth no permite getMany en una sola call, hay que iterar (cap a 50 para evitar abuso)
  const cap = Math.min(userIds.length, 50);
  for (let i = 0; i < cap; i++) {
    const { data } = await admin.auth.admin.getUserById(userIds[i]);
    if (data.user?.email) {
      const { data: u } = await admin.from('users').select('nombre').eq('id', userIds[i]).maybeSingle();
      emails.push({ email: data.user.email, nombre: u?.nombre || 'Maestro' });
    }
  }

  if (emails.length === 0) {
    return NextResponse.json({ success: true, sent: 0 });
  }

  const appUrl = getAppUrl();
  const verUrl = `${appUrl}/app/publicaciones/${pub.id}`;

  // Enviar batch (Resend permite hasta 100 emails, en serie con pequeño throttle)
  let sent = 0;
  for (const m of emails) {
    try {
      const html = renderNotifMaestroEmail({
        nombre: m.nombre,
        titulo: pub.titulo,
        descripcion: pub.descripcion,
        especialidad: pub.especialidad,
        comuna: pub.comuna || '',
        urgente: !!pub.urgente,
        verUrl,
      });
      const { error } = await getResend().emails.send({
        from: FROM_EMAIL,
        to: m.email,
        subject: pub.urgente
          ? `🚨 Pololito urgente en ${pub.comuna || 'tu zona'}: ${pub.titulo}`
          : `Nuevo pololito en ${pub.comuna || 'tu zona'}: ${pub.titulo}`,
        html,
      });
      if (!error) sent++;
    } catch (e: any) {
      console.error('[notif-maestros] send error:', e?.message);
    }
  }

  return NextResponse.json({ success: true, sent });
}

// ============================================================
// Email templates
// ============================================================

function renderMaestroRespuestaEmail(d: {
  cliente_nombre: string; publicacion_titulo: string; maestro_nombre: string;
  maestro_oficio: string; ratingFormatted: string; presupuestoFormatted: string;
  tiempo_entrega: string; mensaje: string; publicacionUrl: string; ratingUrl: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EB;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#FFFFFF;border-radius:18px;overflow:hidden;border:1px solid #E8E0D8;">
        <tr><td style="background:linear-gradient(135deg,#FF6B35 0%,#7C3AED 100%);padding:28px 24px;text-align:center;">
          <p style="margin:0;color:white;font-size:20px;font-weight:800;letter-spacing:-0.5px;">pololitotrabajos</p>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Un maestro quiere hacer tu pololito</p>
        </td></tr>

        <tr><td style="padding:28px 24px;">
          <p style="margin:0 0 20px;font-size:14px;color:#3D3229;">Hola <strong>${escapeHtml(d.cliente_nombre)}</strong>,</p>
          <p style="margin:0 0 20px;font-size:13.5px;color:#6B5E52;line-height:1.5;">
            Un maestro vio tu publicación <strong>"${escapeHtml(d.publicacion_titulo)}"</strong> y quiere ayudarte.
          </p>

          <table width="100%" style="background:#FAF7F4;border-radius:14px;border:1px solid #E8E0D8;" cellpadding="0" cellspacing="0">
            <tr><td style="padding:16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48" style="vertical-align:top;">
                    <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#FF6B35,#7C3AED);text-align:center;line-height:48px;color:white;font-weight:700;font-size:18px;">
                      ${escapeHtml(d.maestro_nombre.charAt(0))}
                    </div>
                  </td>
                  <td style="padding-left:12px;vertical-align:top;">
                    <p style="margin:0;font-size:15px;font-weight:700;color:#3D3229;">${escapeHtml(d.maestro_nombre)}</p>
                    <p style="margin:2px 0 0;font-size:12px;color:#7C3AED;font-weight:600;text-transform:uppercase;">${escapeHtml(d.maestro_oficio)}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#6B5E52;">${d.ratingFormatted}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" style="margin-top:16px;border-top:1px solid #E8E0D8;padding-top:12px;" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding:4px 0;">
                    <p style="margin:0;font-size:11px;color:#6B5E52;text-transform:uppercase;font-weight:700;">Presupuesto</p>
                    <p style="margin:4px 0 0;font-size:18px;font-weight:800;color:#3D3229;">${d.presupuestoFormatted}</p>
                  </td>
                  <td width="50%" style="padding:4px 0;">
                    <p style="margin:0;font-size:11px;color:#6B5E52;text-transform:uppercase;font-weight:700;">Tiempo</p>
                    <p style="margin:4px 0 0;font-size:18px;font-weight:800;color:#3D3229;">${escapeHtml(d.tiempo_entrega)}</p>
                  </td>
                </tr>
              </table>

              ${d.mensaje ? `
              <div style="margin-top:12px;padding-top:12px;border-top:1px solid #E8E0D8;">
                <p style="margin:0;font-size:12.5px;color:#6B5E52;line-height:1.45;font-style:italic;">"${escapeHtml(d.mensaje)}"</p>
              </div>
              ` : ''}
            </td></tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
            <tr><td align="center">
              <a href="${d.publicacionUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#FF6B35 0%,#7C3AED 100%);color:white;font-size:14px;font-weight:700;text-decoration:none;border-radius:14px;">
                Ver propuesta completa
              </a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:20px 24px;border-top:1px solid #E8E0D8;text-align:center;">
          <p style="margin:0;font-size:11px;color:#A89C91;">
            pololitotrabajos · Conectando con maestros de confianza
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderPublicacionConfirmacionEmail(d: { titulo: string; magicUrl: string; nombre?: string }): string {
  const greeting = d.nombre ? `¡Hola ${escapeHtml(d.nombre)}! ` : '';
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EB;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#FFFFFF;border-radius:18px;overflow:hidden;border:1px solid #E8E0D8;">
        <tr><td style="background:linear-gradient(135deg,#FF6B35 0%,#7C3AED 100%);padding:28px 24px;text-align:center;">
          <p style="margin:0;color:white;font-size:20px;font-weight:800;letter-spacing:-0.5px;">pololitotrabajos</p>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Tu publicación está activa</p>
        </td></tr>

        <tr><td style="padding:28px 24px;">
          <p style="margin:0 0 16px;font-size:14px;color:#3D3229;">${greeting}Tu solicitud ya está publicada:</p>

          <table width="100%" style="background:#FAF7F4;border-radius:14px;border:1px solid #E8E0D8;" cellpadding="0" cellspacing="0">
            <tr><td style="padding:16px;">
              <p style="margin:0;font-size:16px;font-weight:800;color:#3D3229;">${escapeHtml(d.titulo)}</p>
              <p style="margin:8px 0 0;font-size:12.5px;color:#6B5E52;">Los maestros de tu zona ya pueden verla y enviarte propuestas.</p>
            </td></tr>
          </table>

          <p style="margin:20px 0 8px;font-size:13px;color:#6B5E52;line-height:1.5;">
            Cuando un maestro responda, te avisaremos por email. Mientras tanto, puedes revisar el estado de tu publicación con este enlace:
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr><td align="center">
              <a href="${d.magicUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#FF6B35 0%,#7C3AED 100%);color:white;font-size:14px;font-weight:700;text-decoration:none;border-radius:14px;">
                Ver mi publicación
              </a>
            </td></tr>
          </table>

          <div style="margin-top:24px;padding:14px;background:#ECFDF5;border-radius:12px;">
            <p style="margin:0;font-size:12px;color:#10B981;font-weight:600;">
              Guarda este correo: es tu acceso directo a tu publicación y las propuestas que recibas.
            </p>
          </div>
        </td></tr>

        <tr><td style="padding:20px 24px;border-top:1px solid #E8E0D8;text-align:center;">
          <p style="margin:0;font-size:11px;color:#A89C91;">
            pololitotrabajos · Conectando con maestros de confianza
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderRecuperarEmail(d: { pubs: any[]; appUrl: string }): string {
  const pubRows = d.pubs.map((p: any) => {
    const fecha = new Date(p.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
    const url = `${d.appUrl}/mi-publicacion/${p.token_acceso}`;
    return `
      <tr><td style="padding:12px 16px;border-bottom:1px solid #E8E0D8;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:top;">
              <p style="margin:0;font-size:14px;font-weight:700;color:#3D3229;">${escapeHtml(p.titulo)}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#6B5E52;">Publicada el ${fecha}</p>
            </td>
            <td width="100" style="text-align:right;vertical-align:middle;">
              <a href="${url}" style="display:inline-block;padding:8px 16px;background:linear-gradient(135deg,#FF6B35 0%,#7C3AED 100%);color:white;font-size:12px;font-weight:700;text-decoration:none;border-radius:10px;">
                Ver
              </a>
            </td>
          </tr>
        </table>
      </td></tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EB;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#FFFFFF;border-radius:18px;overflow:hidden;border:1px solid #E8E0D8;">
        <tr><td style="background:linear-gradient(135deg,#FF6B35 0%,#7C3AED 100%);padding:28px 24px;text-align:center;">
          <p style="margin:0;color:white;font-size:20px;font-weight:800;letter-spacing:-0.5px;">pololitotrabajos</p>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Tus publicaciones activas</p>
        </td></tr>

        <tr><td style="padding:24px;">
          <p style="margin:0 0 16px;font-size:14px;color:#3D3229;">Aquí están tus publicaciones activas:</p>
          <table width="100%" style="background:#FAF7F4;border-radius:14px;border:1px solid #E8E0D8;" cellpadding="0" cellspacing="0">
            ${pubRows}
          </table>
        </td></tr>

        <tr><td style="padding:20px 24px;border-top:1px solid #E8E0D8;text-align:center;">
          <p style="margin:0;font-size:11px;color:#A89C91;">
            pololitotrabajos · Conectando con maestros de confianza
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderInvitacionCalificarEmail(d: { nombre: string; maestroNombre: string; titulo: string; ratingUrl: string }): string {
  const greeting = d.nombre ? `Hola ${escapeHtml(d.nombre)},` : 'Hola,';
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EB;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#FFFFFF;border-radius:18px;overflow:hidden;border:1px solid #E8E0D8;">
        <tr><td style="background:linear-gradient(135deg,#FF6B35 0%,#7C3AED 100%);padding:28px 24px;text-align:center;">
          <p style="margin:0;color:white;font-size:20px;font-weight:800;letter-spacing:-0.5px;">pololitotrabajos</p>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">¿Cómo te fue con tu maestro?</p>
        </td></tr>

        <tr><td style="padding:28px 24px;">
          <p style="margin:0 0 16px;font-size:14px;color:#3D3229;">${greeting}</p>
          <p style="margin:0 0 16px;font-size:13.5px;color:#6B5E52;line-height:1.5;">
            Marcaste tu trabajo <strong>"${escapeHtml(d.titulo)}"</strong> como completado con <strong>${escapeHtml(d.maestroNombre)}</strong>.
            Tu calificación ayuda a otros clientes a confiar en buenos maestros.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr><td align="center">
              <a href="${d.ratingUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#FF6B35 0%,#7C3AED 100%);color:white;font-size:14px;font-weight:700;text-decoration:none;border-radius:14px;">
                Calificar a ${escapeHtml(d.maestroNombre)}
              </a>
            </td></tr>
          </table>

          <p style="margin:18px 0 0;font-size:11.5px;color:#A89C91;line-height:1.45;text-align:center;">
            Tarda menos de un minuto. El enlace expira en 14 días.
          </p>
        </td></tr>

        <tr><td style="padding:20px 24px;border-top:1px solid #E8E0D8;text-align:center;">
          <p style="margin:0;font-size:11px;color:#A89C91;">
            pololitotrabajos · Conectando con maestros de confianza
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderNotifMaestroEmail(d: {
  nombre: string; titulo: string; descripcion: string; especialidad: string;
  comuna: string; urgente: boolean; verUrl: string;
}): string {
  const greeting = d.nombre ? `Hola ${escapeHtml(d.nombre)},` : 'Hola maestro,';
  const urgenteBanner = d.urgente
    ? `<div style="background:#FEF2F2;border:1px solid #EF4444;padding:8px 12px;border-radius:10px;margin-bottom:14px;text-align:center;">
        <strong style="color:#EF4444;font-size:12px;letter-spacing:0.5px;">🚨 URGENTE</strong>
       </div>` : '';
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EB;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#FFFFFF;border-radius:18px;overflow:hidden;border:1px solid #E8E0D8;">
        <tr><td style="background:linear-gradient(135deg,#FF6B35 0%,#7C3AED 100%);padding:28px 24px;text-align:center;">
          <p style="margin:0;color:white;font-size:20px;font-weight:800;letter-spacing:-0.5px;">pololitotrabajos</p>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Nuevo pololito en tu zona</p>
        </td></tr>

        <tr><td style="padding:28px 24px;">
          ${urgenteBanner}
          <p style="margin:0 0 12px;font-size:14px;color:#3D3229;">${greeting}</p>
          <p style="margin:0 0 16px;font-size:13.5px;color:#6B5E52;line-height:1.5;">
            Un cliente publicó un trabajo de <strong>${escapeHtml(d.especialidad)}</strong>${d.comuna ? ` en <strong>${escapeHtml(d.comuna)}</strong>` : ''} y matchea con tu perfil.
          </p>

          <table width="100%" style="background:#FAF7F4;border-radius:14px;border:1px solid #E8E0D8;" cellpadding="0" cellspacing="0">
            <tr><td style="padding:16px;">
              <p style="margin:0;font-size:15px;font-weight:800;color:#3D3229;">${escapeHtml(d.titulo)}</p>
              <p style="margin:8px 0 0;font-size:12.5px;color:#6B5E52;line-height:1.45;">
                ${escapeHtml(d.descripcion).slice(0, 200)}${d.descripcion.length > 200 ? '...' : ''}
              </p>
            </td></tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr><td align="center">
              <a href="${d.verUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#FF6B35 0%,#7C3AED 100%);color:white;font-size:14px;font-weight:700;text-decoration:none;border-radius:14px;">
                Ver y postular al tiro
              </a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:20px 24px;border-top:1px solid #E8E0D8;text-align:center;">
          <p style="margin:0 0 6px;font-size:11px;color:#A89C91;">
            Recibes este correo porque tu perfil matchea oficio + comuna.
          </p>
          <p style="margin:0;font-size:11px;color:#A89C91;">
            pololitotrabajos · Sin comisiones, sin intermediarios
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Minimal HTML escaping for user-provided content in templates
function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
