'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { usePublicacionDetail, useRespuestas, useMiRespuesta, useMutateRespuesta } from '@/lib/hooks';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Clock, Zap, Send, User, CheckCircle,
  DollarSign, Calendar, MessageSquare, Star, X, AlertCircle, MessageCircle, Mail,
} from 'lucide-react';

const TIEMPOS = [
  { label: 'Hoy mismo', value: 'hoy' },
  { label: '1-2 días', value: '1-2 dias' },
  { label: '3-5 días', value: '3-5 dias' },
  { label: '1 semana', value: '1 semana' },
  { label: '2+ semanas', value: '2+ semanas' },
];

function ResponseModal({ publicacionId, publicacionTitulo, onClose }: { publicacionId: string; publicacionTitulo: string; onClose: () => void }) {
  const { user } = useAuthStore();
  const mutation = useMutateRespuesta();
  const [presupuesto, setPresupuesto] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presupuestoNum = presupuesto ? parseInt(presupuesto) : null;
  const canSubmit = !!user && tiempo && !mutation.isPending && (presupuesto === '' || (presupuestoNum !== null && presupuestoNum > 0));

  const handleSubmit = async () => {
    if (!canSubmit || !user) return;
    setErrorMsg(null);
    try {
      const respuesta = await mutation.mutateAsync({
        publicacion_id: publicacionId,
        maestro_id: user.id,
        presupuesto: presupuestoNum,
        tiempo_entrega: tiempo,
        mensaje: mensaje || '',
      });

      try {
        // Get caller's access token to authenticate with /api/email
        const { supabase } = await import('@/lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        await fetch('/api/email', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            type: 'maestro_respuesta',
            publicacion_id: publicacionId,
            respuesta_id: respuesta.id,
            maestro_id: user.id,
          }),
        });
      } catch {
        // Email is best-effort, don't block the success flow
      }

      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (e: any) {
      const code = e?.code;
      if (code === '23505') {
        setErrorMsg('Ya enviaste una propuesta para este trabajo.');
      } else if (code === '42501') {
        setErrorMsg('No tienes permiso. Inicia sesión nuevamente.');
      } else {
        setErrorMsg(e?.message || 'No se pudo enviar la propuesta. Intenta de nuevo.');
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-4 top-[10%] lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[480px] bg-surface rounded-[20px] z-[70] shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border px-5 py-4 flex items-center justify-between rounded-t-[20px]">
          <h2 className="text-[16px] font-extrabold text-ink tracking-tight">Me interesa este trabajo</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-bg-alt flex items-center justify-center">
            <X size={16} className="text-ink-muted" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-soft flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green" />
            </div>
            <p className="text-[16px] font-extrabold text-ink">Respuesta enviada</p>
            <p className="text-[13px] text-ink-muted mt-2">El cliente será notificado de tu interés</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <div className="flex justify-between items-baseline mb-[7px]">
                <label className="text-[11.5px] font-bold text-ink uppercase tracking-wide">
                  Presupuesto estimado ($)
                </label>
                <span className="text-[11px] text-ink-muted">Opcional</span>
              </div>
              <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-surface">
                <DollarSign size={14} className="text-violet shrink-0" />
                <input
                  type="number"
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  placeholder="A convenir"
                  className="flex-1 h-full border-none bg-transparent outline-none text-[13.5px] text-ink placeholder:text-ink-soft"
                />
              </div>
              {presupuesto && parseInt(presupuesto) > 0 ? (
                <p className="text-[11px] text-ink-muted mt-1">
                  ${parseInt(presupuesto).toLocaleString('es-CL')} CLP
                </p>
              ) : (
                <p className="text-[10.5px] text-ink-muted mt-1">Si no pones, aparece "A convenir"</p>
              )}
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-ink uppercase tracking-wide block mb-[7px]">
                Tiempo estimado
              </label>
              <div className="flex flex-wrap gap-[6px]">
                {TIEMPOS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTiempo(t.value)}
                    className={`px-[14px] py-[7px] rounded-full text-[12.5px] font-semibold transition-colors ${
                      tiempo === t.value
                        ? 'bg-violet text-white'
                        : 'bg-bg-alt text-ink-soft hover:bg-border'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-[7px]">
                <label className="text-[11.5px] font-bold text-ink uppercase tracking-wide">
                  Mensaje al cliente
                </label>
                <span className="text-[11px] text-ink-muted">{mensaje.length}/300</span>
              </div>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value.slice(0, 300))}
                placeholder="Preséntate y describe cómo harías el trabajo..."
                rows={3}
                className="w-full px-[14px] py-3 rounded-xl border border-border bg-surface text-[13.5px] text-ink outline-none resize-none leading-[1.4] focus:ring-2 focus:ring-violet/30 focus:border-violet placeholder:text-ink-soft"
              />
            </div>

            {(errorMsg || mutation.isError) && (
              <div className="flex items-center gap-2 p-3 bg-red-soft rounded-xl text-[12.5px] text-red font-semibold">
                <AlertCircle size={14} /> {errorMsg || 'Error al enviar. Intenta de nuevo.'}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-[14px] rounded-[14px] bg-grad-cta text-white font-bold text-[14px] hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)] flex items-center justify-center gap-2"
            >
              <Send size={14} />
              {mutation.isPending ? 'Enviando...' : 'Enviar propuesta'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function RespuestaCard({ r }: { r: any }) {
  return (
    <div className="bg-surface rounded-[16px] border border-border p-[14px]">
      <div className="flex gap-[10px] items-center mb-3">
        <div className="w-[40px] h-[40px] rounded-full bg-primary-soft flex items-center justify-center text-violet text-sm font-bold shrink-0 overflow-hidden">
          {r.maestro?.foto_url ? (
            <img src={r.maestro.foto_url} alt="" className="w-full h-full object-cover" />
          ) : (
            r.maestro?.nombre?.charAt(0) || '?'
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-ink">{r.maestro?.nombre || 'Maestro'}</p>
          <p className="text-[11px] text-ink-muted">{r.maestro?.comuna || 'Sin ubicación'}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[15px] font-extrabold text-ink">{r.presupuesto ? `$${r.presupuesto.toLocaleString('es-CL')}` : 'A convenir'}</p>
          <p className="text-[10.5px] text-ink-muted">{r.tiempo_entrega}</p>
        </div>
      </div>
      {r.mensaje && (
        <p className="text-[12.5px] text-ink-soft leading-[1.4] line-clamp-3">{r.mensaje}</p>
      )}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <span className="text-[10.5px] text-ink-muted">
          <Clock size={10} className="inline mr-1" />
          {new Date(r.created_at).toLocaleDateString('es-CL')}
        </span>
      </div>
    </div>
  );
}

export default function PublicacionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, viewMode } = useAuthStore();
  const id = params.id as string;

  const { data: pub, isLoading } = usePublicacionDetail(id);
  const { data: respuestas } = useRespuestas(id);
  const { data: miRespuesta } = useMiRespuesta(id, user?.id || '');
  const [showModal, setShowModal] = useState(false);

  const isMaestro = viewMode === 'maestro';
  const yaRespondio = !!miRespuesta;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-[18px] lg:px-6 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-bg-alt rounded w-32" />
          <div className="h-8 bg-bg-alt rounded w-64" />
          <div className="h-4 bg-bg-alt rounded w-full" />
          <div className="h-4 bg-bg-alt rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!pub) {
    return (
      <div className="max-w-3xl mx-auto px-[18px] lg:px-6 py-16 text-center">
        <p className="font-extrabold text-ink text-[16px]">Publicación no encontrada</p>
        <button onClick={() => router.back()} className="text-[13px] text-violet font-semibold mt-2">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="lg:max-w-5xl lg:mx-auto px-[18px] lg:px-6 py-4">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[13px] font-semibold text-ink-muted hover:text-ink mb-4">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="lg:flex lg:gap-7">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header card */}
          <div className="bg-surface rounded-[18px] border border-border p-5">
            <div className="flex items-center gap-[10px] mb-4">
              <div className="w-[44px] h-[44px] rounded-full bg-primary-soft flex items-center justify-center text-violet text-sm font-bold shrink-0">
                {pub.autor?.foto_url ? (
                  <img src={pub.autor.foto_url} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  (pub.nombre_cliente || pub.autor?.nombre)?.charAt(0)?.toUpperCase() || <User size={18} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-ink">{pub.nombre_cliente || pub.autor?.nombre || 'Cliente'}</p>
                <div className="text-[11px] text-ink-muted flex items-center gap-1 flex-wrap">
                  <Clock size={10} />
                  {new Date(pub.created_at).toLocaleDateString('es-CL')}
                  {(pub.comuna || pub.ubicacion) && (
                    <>
                      <span className="opacity-50 mx-0.5">·</span>
                      <MapPin size={10} />
                      {pub.comuna || pub.ubicacion}
                    </>
                  )}
                </div>
              </div>
              {pub.urgente && (
                <div className="inline-flex items-center gap-1 bg-red-soft text-red px-2 py-[3px] rounded-full text-[10px] font-extrabold">
                  <Zap size={10} className="fill-red" /> URGENTE
                </div>
              )}
            </div>

            <h1 className="text-[20px] lg:text-[22px] font-extrabold text-ink tracking-tight leading-[1.2]">
              {pub.titulo}
            </h1>
            <p className="mt-3 text-[13.5px] text-ink-soft leading-[1.5]">{pub.descripcion}</p>

            <div className="flex items-center gap-[6px] mt-4 flex-wrap">
              {pub.especialidad && (
                <span className="px-[12px] py-[6px] rounded-full text-[11.5px] font-semibold bg-primary-soft text-primary-deep">
                  {pub.especialidad}
                </span>
              )}
              {pub.ubicacion && (
                <span className="px-[12px] py-[6px] rounded-full text-[11.5px] font-semibold bg-bg-alt text-ink-soft flex items-center gap-1">
                  <MapPin size={10} /> {pub.ubicacion}
                </span>
              )}
              <span className="px-[12px] py-[6px] rounded-full text-[11.5px] font-semibold bg-bg-alt text-ink-soft">
                {pub.estado === 'abierta' ? 'Abierta' : pub.estado === 'cerrada' ? 'Cerrada' : 'Vencida'}
              </span>
            </div>

            {(pub.presupuesto_min || pub.presupuesto_max) && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[11.5px] font-bold text-ink uppercase tracking-wide mb-1">Presupuesto esperado</p>
                <p className="text-[15px] font-extrabold text-ink">
                  {pub.presupuesto_min && pub.presupuesto_max
                    ? `$${pub.presupuesto_min.toLocaleString('es-CL')} - $${pub.presupuesto_max.toLocaleString('es-CL')}`
                    : pub.presupuesto_min
                    ? `Desde $${pub.presupuesto_min.toLocaleString('es-CL')}`
                    : `Hasta $${pub.presupuesto_max!.toLocaleString('es-CL')}`
                  }
                </p>
              </div>
            )}

            {/* Fotos */}
            {pub.fotos && pub.fotos.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[11.5px] font-bold text-ink uppercase tracking-wide mb-2">Fotos del trabajo</p>
                <div className="grid grid-cols-3 gap-2">
                  {pub.fotos.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-xl overflow-hidden border border-border bg-bg-alt hover:opacity-90">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Contacto público (solo si maestro Y cliente eligió mostrar) */}
            {isMaestro && (pub.mostrar_telefono || pub.mostrar_email) && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[11.5px] font-bold text-ink uppercase tracking-wide mb-2">Contacto directo</p>
                <div className="flex flex-col gap-2">
                  {pub.mostrar_telefono && pub.telefono_cliente && (
                    <a
                      href={`https://wa.me/56${pub.telefono_cliente.replace(/\D/g,'')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-soft border border-green/20 text-green text-[13px] font-bold hover:bg-green/10 transition-colors"
                    >
                      <MessageCircle size={14} /> WhatsApp +56 {pub.telefono_cliente}
                    </a>
                  )}
                  {pub.mostrar_email && pub.email_cliente && (
                    <a
                      href={`mailto:${pub.email_cliente}`}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary-soft border border-violet/20 text-primary-deep text-[13px] font-bold hover:bg-violet/10 transition-colors"
                    >
                      <Mail size={14} /> {pub.email_cliente}
                    </a>
                  )}
                </div>
                <p className="text-[10.5px] text-ink-muted mt-2 leading-[1.4]">
                  Aún así, recomendamos enviar tu propuesta para que quede registrada.
                </p>
              </div>
            )}
          </div>

          {/* Responses section */}
          {respuestas && respuestas.length > 0 && (
            <div className="mt-5">
              <h2 className="text-[14px] font-extrabold text-ink tracking-tight mb-3">
                {respuestas.length} {respuestas.length === 1 ? 'maestro interesado' : 'maestros interesados'}
              </h2>
              <div className="space-y-3">
                {respuestas.map((r: any) => (
                  <RespuestaCard key={r.id} r={r} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (desktop) / Bottom CTA (mobile) */}
        {isMaestro && (
          <div className="lg:w-[320px] shrink-0 mt-5 lg:mt-0">
            <div className="lg:sticky lg:top-[80px]">
              <div className="bg-surface rounded-[18px] border border-border p-5">
                {yaRespondio ? (
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-green-soft flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={24} className="text-green" />
                    </div>
                    <p className="text-[14px] font-extrabold text-ink">Ya enviaste tu propuesta</p>
                    <p className="text-[12.5px] text-ink-muted mt-1">
                      Presupuesto: {miRespuesta.presupuesto ? `$${miRespuesta.presupuesto.toLocaleString('es-CL')}` : 'A convenir'}
                    </p>
                    <p className="text-[12.5px] text-ink-muted">
                      Tiempo: {miRespuesta.tiempo_entrega}
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-[14px] font-extrabold text-ink mb-2">¿Te interesa?</h3>
                    <p className="text-[12.5px] text-ink-muted leading-[1.4] mb-4">
                      Envía tu propuesta con presupuesto y tiempo estimado. El cliente será notificado.
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full py-[13px] rounded-[14px] bg-grad-cta text-white font-bold text-[14px] hover:opacity-90 transition-opacity shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)] flex items-center justify-center gap-2"
                    >
                      <Send size={14} /> Me interesa este trabajo
                    </button>
                  </>
                )}
              </div>

              {respuestas && respuestas.length > 0 && (
                <div className="bg-surface rounded-[18px] border border-border p-5 mt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare size={14} className="text-violet" />
                    <p className="text-[12px] font-bold text-ink">{respuestas.length} propuestas enviadas</p>
                  </div>
                  <p className="text-[11.5px] text-ink-muted">Compites con otros maestros interesados</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile fixed CTA for maestro */}
      {isMaestro && !yaRespondio && (
        <div className="lg:hidden fixed bottom-[72px] left-0 right-0 bg-surface border-t border-border p-4 z-40">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-[13px] rounded-[14px] bg-grad-cta text-white font-bold text-[14px] shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)] flex items-center justify-center gap-2"
          >
            <Send size={14} /> Me interesa este trabajo
          </button>
        </div>
      )}

      {showModal && (
        <ResponseModal publicacionId={id} publicacionTitulo={pub.titulo || ''} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
