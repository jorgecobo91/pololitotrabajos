'use client';

import { useMaestroDetail } from '@/lib/hooks';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, MapPin, Phone, Shield, Clock, CheckCircle, Award, MessageCircle } from 'lucide-react';

function parseZonaCobertura(z: any): string[] {
  if (!z) return [];
  if (Array.isArray(z)) return z;
  try { return JSON.parse(z); } catch { return []; }
}

function RatingBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-[10px] mb-2">
      <div className="flex-1">
        <p className="text-[12.5px] font-semibold text-ink mb-1">{label}</p>
        <div className="h-[5px] bg-bg-alt rounded-full overflow-hidden">
          <div className="h-full bg-grad-cta rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className="text-[12px] font-bold text-ink w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

function ReseñasList({ ratings }: { ratings: any[] }) {
  const conComentario = ratings.filter((r) => r.comentario && r.comentario.trim().length > 0);
  if (ratings.length === 0) return null;

  return (
    <div className="mt-5">
      <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-[-0.2px] opacity-90 mb-[10px]">
        {ratings.length} {ratings.length === 1 ? 'reseña' : 'reseñas'} de clientes
      </h3>

      {conComentario.length === 0 ? (
        <div className="bg-surface rounded-[18px] border border-border p-5 text-center">
          <p className="text-[12.5px] text-ink-muted leading-[1.5]">
            Aún no hay comentarios escritos. Las {ratings.length} calificaciones se reflejan arriba en las estrellas.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {conComentario.map((r) => {
            const promedio = ((r.calidad + r.puntualidad + r.comunicacion + r.precio) / 4).toFixed(1);
            return (
              <div key={r.id} className="bg-surface rounded-[18px] border border-border p-[14px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-amber text-amber" />
                    <span className="text-[13px] font-extrabold text-ink">{promedio}</span>
                  </div>
                  <span className="text-[11px] text-ink-muted">
                    {new Date(r.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-[13px] text-ink-soft leading-[1.5] italic">
                  &ldquo;{r.comentario}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MaestroDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: maestro, isLoading } = useMaestroDetail(id as string);

  if (isLoading) {
    return (
      <div className="lg:max-w-5xl lg:mx-auto">
        <div className="animate-pulse">
          <div className="h-[120px] bg-bg-alt" />
          <div className="px-[18px] lg:px-6 -mt-14">
            <div className="bg-surface rounded-[18px] border border-border p-4">
              <div className="flex gap-4 -mt-[42px]">
                <div className="w-[84px] h-[84px] rounded-full bg-bg-alt shrink-0" />
                <div className="flex-1 pt-10 space-y-2">
                  <div className="h-3 bg-bg-alt rounded w-20" />
                  <div className="h-5 bg-bg-alt rounded w-40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!maestro) {
    return (
      <div className="lg:max-w-5xl lg:mx-auto px-[18px] py-20 text-center">
        <p className="text-ink-muted">Maestro no encontrado</p>
      </div>
    );
  }

  const m = maestro as any;

  return (
    <div className="lg:max-w-5xl lg:mx-auto">
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden">
        {/* Gradient hero */}
        <div className="relative bg-grad-cta px-[18px] pt-[14px] pb-20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="w-[38px] h-[38px] rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <button className="w-[38px] h-[38px] rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Profile card */}
        <div className="px-[18px] -mt-14 relative z-10">
          <div className="bg-surface rounded-[18px] border border-border p-4">
            <div className="flex gap-[14px] -mt-[42px] items-end">
              <div className="relative shrink-0">
                <div className="w-[84px] h-[84px] rounded-full bg-primary-soft flex items-center justify-center text-violet font-bold text-2xl overflow-hidden ring-[3px] ring-primary-soft ring-offset-2 ring-offset-surface">
                  {m.user?.foto_url ? (
                    <img src={m.user.foto_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    m.user?.nombre?.charAt(0) || '?'
                  )}
                </div>
              </div>
              <div className="flex-1 pb-1">
                <div className={`inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10.5px] font-bold ${
                  m.disponible ? 'bg-green-soft text-green' : 'bg-bg-alt text-ink-muted'
                }`}>
                  <span className={`w-[6px] h-[6px] rounded-full ${m.disponible ? 'bg-green' : 'bg-ink-muted'}`} />
                  {m.disponible ? 'Disponible al tiro' : 'No disponible'}
                </div>
              </div>
            </div>

            <div className="mt-[10px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.4px] text-violet">{m.oficio}</p>
              <h1 className="text-[22px] font-extrabold text-ink tracking-[-0.5px] mt-[2px]">{m.user?.nombre}</h1>
              <div className="flex items-center gap-[6px] mt-[6px] text-[12.5px] text-ink-soft">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={13} className={i <= Math.round(m.rating_promedio || 0) ? 'fill-amber text-amber' : 'text-border'} />
                  ))}
                </div>
                <span className="font-bold text-ink">{(m.rating_promedio || 0).toFixed(1)}</span>
                <span className="opacity-70">· {m.total_ratings || 0} reseñas</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-[14px] pt-3 border-t border-border">
              {[
                { label: 'Años', value: m.experiencia_anios || 0 },
                { label: 'Trabajos', value: m.total_trabajos || 0 },
                { label: 'Reseñas', value: m.total_ratings || 0 },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-[18px] font-extrabold text-ink tracking-[-0.3px]">{s.value}</p>
                  <p className="text-[10.5px] text-ink-muted font-semibold mt-[2px]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {m.bio && (
          <div className="px-[18px] mt-[18px]">
            <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-[-0.2px] opacity-90">Sobre mí</h3>
            <p className="mt-2 text-[13px] text-ink-soft leading-[1.5]">{m.bio}</p>
          </div>
        )}

        {m.especialidades?.length > 0 && (
          <div className="px-[18px] mt-4">
            <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-[-0.2px] opacity-90">Especialidades</h3>
            <div className="flex flex-wrap gap-[6px] mt-[10px]">
              {m.especialidades.map((e: string) => (
                <span key={e} className="px-[14px] py-[7px] rounded-full text-[12.5px] font-semibold bg-surface border border-border text-ink-soft">
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}

        {m.ratings && m.ratings.total > 0 && (
          <div className="px-[18px] mt-5">
            <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-[-0.2px] opacity-90">Calificaciones</h3>
            <div className="bg-surface rounded-[18px] border border-border p-[14px] mt-[10px]">
              <RatingBar label="Calidad" value={m.ratings.calidad} />
              <RatingBar label="Puntualidad" value={m.ratings.puntualidad} />
              <RatingBar label="Comunicación" value={m.ratings.comunicacion} />
              <RatingBar label="Precio justo" value={m.ratings.precio} />
            </div>
          </div>
        )}

        {/* Reseñas con comentarios (mobile) */}
        <div className="px-[18px]">
          <ReseñasList ratings={m.ratings?.list || []} />
        </div>

        {m.portfolio?.length > 0 && (
          <div className="px-[18px] mt-5">
            <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-[-0.2px] opacity-90">Trabajos realizados</h3>
            <div className="grid grid-cols-3 gap-[6px] mt-[10px]">
              {m.portfolio.map((p: any) => (
                <div key={p.id} className="aspect-square rounded-[10px] bg-bg-alt overflow-hidden border border-border">
                  {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sticky CTAs mobile */}
        {m.telefono_publico && m.user?.telefono && (
          <div className="sticky bottom-[72px] px-[18px] mt-6 mb-7 flex gap-[10px]">
            <a
              href={`tel:${m.user.telefono}`}
              className="flex-1 flex items-center justify-center gap-2 py-[15px] rounded-[14px] border-[1.5px] border-border-strong bg-surface font-bold text-[15px] text-ink hover:bg-bg-alt transition-colors"
            >
              <Phone size={16} /> Llamar
            </a>
            <a
              href={`https://wa.me/56${String(m.user.telefono).replace(/\D/g,'')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[2] flex items-center justify-center gap-2 py-[15px] rounded-[14px] bg-grad-cta text-white font-bold text-[15px] hover:opacity-90 transition-opacity shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)]"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[13px] font-semibold text-ink-muted hover:text-ink mb-5 transition-colors"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="flex gap-7">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            {/* Hero card */}
            <div className="bg-surface rounded-[18px] border border-border">
              <div className="h-[140px] bg-grad-cta relative rounded-t-[18px] overflow-hidden">
                <div className="absolute -right-8 -top-8 w-[160px] h-[160px] rounded-full bg-white/10" />
              </div>
              <div className="px-6 pb-5">
                <div className="flex gap-5 -mt-[50px] items-end relative z-10">
                  <div className="w-[100px] h-[100px] rounded-full bg-primary-soft flex items-center justify-center text-violet font-bold text-3xl overflow-hidden ring-4 ring-surface shrink-0">
                    {m.user?.foto_url ? (
                      <img src={m.user.foto_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      m.user?.nombre?.charAt(0) || '?'
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className={`inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10.5px] font-bold ${
                      m.disponible ? 'bg-green-soft text-green' : 'bg-bg-alt text-ink-muted'
                    }`}>
                      <span className={`w-[6px] h-[6px] rounded-full ${m.disponible ? 'bg-green' : 'bg-ink-muted'}`} />
                      {m.disponible ? 'Disponible al tiro' : 'No disponible'}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.4px] text-violet">{m.oficio}</p>
                  <h1 className="text-[26px] font-extrabold text-ink tracking-[-0.5px] mt-1">{m.user?.nombre}</h1>
                  <div className="flex items-center gap-[6px] mt-2 text-[13px] text-ink-soft">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={14} className={i <= Math.round(m.rating_promedio || 0) ? 'fill-amber text-amber' : 'text-border'} />
                      ))}
                    </div>
                    <span className="font-bold text-ink">{(m.rating_promedio || 0).toFixed(1)}</span>
                    <span className="opacity-70">· {m.total_ratings || 0} reseñas</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-border">
                  {[
                    { label: 'Años exp.', value: m.experiencia_anios || 0 },
                    { label: 'Reseñas', value: m.total_ratings || 0 },
                    { label: 'Comunas', value: parseZonaCobertura(m.zona_cobertura).length },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-[20px] font-extrabold text-ink tracking-[-0.3px]">{s.value}</p>
                      <p className="text-[11px] text-ink-muted font-semibold mt-[2px]">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio */}
            {m.bio && (
              <div className="mt-5">
                <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-[-0.2px] opacity-90">Sobre mí</h3>
                <p className="mt-2 text-[13.5px] text-ink-soft leading-[1.6]">{m.bio}</p>
              </div>
            )}

            {/* Especialidades */}
            {m.especialidades?.length > 0 && (
              <div className="mt-5">
                <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-[-0.2px] opacity-90">Especialidades</h3>
                <div className="flex flex-wrap gap-[6px] mt-[10px]">
                  {m.especialidades.map((e: string) => (
                    <span key={e} className="px-[14px] py-[7px] rounded-full text-[12.5px] font-semibold bg-surface border border-border text-ink-soft">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {m.portfolio?.length > 0 && (
              <div className="mt-5">
                <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-[-0.2px] opacity-90">Trabajos realizados</h3>
                <div className="grid grid-cols-4 gap-[8px] mt-[10px]">
                  {m.portfolio.map((p: any) => (
                    <div key={p.id} className="aspect-square rounded-[12px] bg-bg-alt overflow-hidden border border-border hover:opacity-80 transition-opacity cursor-pointer">
                      {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings */}
            {m.ratings && m.ratings.total > 0 && (
              <div className="mt-5">
                <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-[-0.2px] opacity-90">Calificaciones</h3>
                <div className="bg-surface rounded-[18px] border border-border p-[18px] mt-[10px]">
                  <RatingBar label="Calidad" value={m.ratings.calidad} />
                  <RatingBar label="Puntualidad" value={m.ratings.puntualidad} />
                  <RatingBar label="Comunicación" value={m.ratings.comunicacion} />
                  <RatingBar label="Precio justo" value={m.ratings.precio} />
                </div>
              </div>
            )}

            {/* Reseñas con comentarios */}
            <ReseñasList ratings={m.ratings?.list || []} />
          </div>

          {/* Right column — sticky contact card */}
          <div className="w-[380px] shrink-0">
            <div className="sticky top-[80px] space-y-4">
              <div className="bg-surface rounded-[18px] border border-border p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.4px] text-ink-muted mb-1">Precio referencial</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-extrabold text-ink tracking-[-0.5px]">Consultar</span>
                </div>
                <p className="text-[12px] text-ink-soft mt-1">Depende del trabajo a realizar</p>

                <div className="space-y-[10px] mt-5">
                  {m.telefono_publico && m.user?.telefono ? (
                    <>
                      <a
                        href={`https://wa.me/56${String(m.user.telefono).replace(/\D/g,'')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-[14px] rounded-[14px] bg-grad-cta text-white font-bold text-[15px] hover:opacity-90 transition-opacity shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)]"
                      >
                        <MessageCircle size={16} /> Contactar por WhatsApp
                      </a>
                      <a
                        href={`tel:${m.user.telefono}`}
                        className="w-full flex items-center justify-center gap-2 py-[14px] rounded-[14px] border-[1.5px] border-border-strong bg-surface font-bold text-[15px] text-ink hover:bg-bg-alt transition-colors"
                      >
                        <Phone size={16} /> Llamar directamente
                      </a>
                    </>
                  ) : (
                    <p className="text-[12.5px] text-ink-muted text-center leading-[1.5] py-3">
                      Este maestro no tiene contacto público. Publica tu trabajo y él podrá responderte.
                    </p>
                  )}
                </div>
              </div>

              {/* Información del maestro — datos reales */}
              <div className="bg-surface rounded-[18px] border border-border p-5">
                <h4 className="text-[12px] font-bold uppercase tracking-[0.4px] text-ink-muted mb-3">Información</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${m.disponible ? 'bg-green-soft' : 'bg-bg-alt'}`}>
                      <CheckCircle size={15} className={m.disponible ? 'text-green' : 'text-ink-muted'} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-ink">{m.disponible ? 'Disponible para trabajar' : 'No disponible por ahora'}</p>
                      <p className="text-[11px] text-ink-muted">{m.disponible ? 'Recibe nuevas solicitudes' : 'Vuelve pronto'}</p>
                    </div>
                  </div>
                  {m.disponible_urgencias && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[10px] bg-red-soft flex items-center justify-center">
                        <Clock size={15} className="text-red" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-ink">Atiende urgencias</p>
                        <p className="text-[11px] text-ink-muted">Disponible 24/7 para emergencias</p>
                      </div>
                    </div>
                  )}
                  {m.experiencia_anios > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[10px] bg-primary-soft flex items-center justify-center">
                        <Award size={15} className="text-violet" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-ink">{m.experiencia_anios}+ años de experiencia</p>
                        <p className="text-[11px] text-ink-muted">En {m.oficio || 'su oficio'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
