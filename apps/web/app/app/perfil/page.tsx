'use client';

import { useAuthStore } from '@/lib/authStore';
import { useMaestroDetail, useMisSolicitudes, useMisRatings } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star, MapPin, Phone, Bell, ChevronRight, Edit3, Briefcase,
  Eye, FileText, Clock, Send, Zap,
} from 'lucide-react';
import Link from 'next/link';

function ToggleRow({ icon: Icon, label, sub, on, onChange, accent = 'violet' }: any) {
  const colors = accent === 'green'
    ? { bg: on ? 'bg-green' : 'bg-bg-alt', icon: on ? 'text-green' : 'text-ink' }
    : { bg: on ? 'bg-violet' : 'bg-bg-alt', icon: on ? 'text-violet' : 'text-ink' };

  return (
    <button onClick={onChange} className="w-full flex items-center gap-3">
      <div className="w-9 h-9 rounded-[10px] bg-bg-alt flex items-center justify-center shrink-0">
        <Icon size={15} className={colors.icon} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[13px] font-bold text-ink">{label}</p>
        <p className="text-[11.5px] text-ink-soft truncate">{sub}</p>
      </div>
      <div className={`w-11 h-[26px] rounded-full transition-colors relative shrink-0 ${colors.bg}`}>
        <div className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-[21px]' : 'left-[3px]'}`} />
      </div>
    </button>
  );
}

// ============================================================
// Tab content components
// ============================================================

function SolicitudesTab({ maestroId }: { maestroId: string }) {
  const { data: solicitudes, isLoading } = useMisSolicitudes(maestroId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-[14px] border border-border p-4 animate-pulse">
            <div className="h-3 bg-bg-alt rounded w-32 mb-2" />
            <div className="h-4 bg-bg-alt rounded w-48" />
          </div>
        ))}
      </div>
    );
  }

  if (!solicitudes?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-bg-alt flex items-center justify-center mx-auto mb-4">
          <FileText size={24} className="text-ink-muted" />
        </div>
        <p className="font-extrabold text-ink">Aún no has postulado</p>
        <p className="text-[13px] text-ink-muted mt-1 max-w-xs mx-auto">
          Revisa el feed de publicaciones y postula a las que te interesen
        </p>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 mt-4 px-5 py-[10px] rounded-xl bg-grad-cta text-white text-[13px] font-bold hover:opacity-90 transition-opacity"
        >
          <Send size={14} /> Ver publicaciones
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {solicitudes.map((s: any) => {
        const pub = s.publicacion;
        if (!pub) return null;
        return (
          <Link
            key={s.id}
            href={`/app/publicaciones/${pub.id}`}
            className="block bg-surface rounded-[14px] border border-border p-4 hover:border-border-strong transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-[3px] rounded-full text-[10.5px] font-bold uppercase tracking-wide bg-primary-soft text-violet">
                    {pub.especialidad}
                  </span>
                  {pub.urgente && (
                    <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px] font-extrabold bg-red-soft text-red">
                      <Zap size={9} className="fill-red" /> URGENTE
                    </span>
                  )}
                </div>
                <h4 className="text-[14px] font-extrabold text-ink tracking-tight">{pub.titulo}</h4>
                <p className="text-[12px] text-ink-soft mt-1 line-clamp-2">{pub.descripcion}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[15px] font-extrabold text-ink">${s.presupuesto?.toLocaleString('es-CL')}</p>
                <p className="text-[10.5px] text-ink-muted">{s.tiempo_entrega}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-[11px] text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <Clock size={11} /> Postulé {new Date(s.created_at).toLocaleDateString('es-CL')}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-violet">
                Ver detalle <ChevronRight size={11} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function ResenasTab({ maestroId }: { maestroId: string }) {
  const { data: ratings, isLoading } = useMisRatings(maestroId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-surface rounded-[14px] border border-border p-4 animate-pulse">
            <div className="h-3 bg-bg-alt rounded w-32 mb-2" />
            <div className="h-4 bg-bg-alt rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!ratings?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-bg-alt flex items-center justify-center mx-auto mb-4">
          <Star size={24} className="text-ink-muted" />
        </div>
        <p className="font-extrabold text-ink">Aún no tienes reseñas</p>
        <p className="text-[13px] text-ink-muted mt-1 max-w-xs mx-auto">
          Cuando termines un trabajo, los clientes podrán calificarte
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ratings.map((r: any) => {
        const promedio = ((r.calidad || 0) + (r.puntualidad || 0) + (r.comunicacion || 0) + (r.precio || 0)) / 4;
        return (
          <div key={r.id} className="bg-surface rounded-[14px] border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className={i <= Math.round(promedio) ? 'fill-amber text-amber' : 'text-border'} />
                ))}
                <span className="ml-1 text-[12px] font-bold text-ink">{promedio.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-ink-muted">{new Date(r.created_at).toLocaleDateString('es-CL')}</span>
            </div>
            {r.comentario && (
              <p className="text-[13px] text-ink-soft leading-[1.5] italic">"{r.comentario}"</p>
            )}
            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border">
              {[
                { k: 'calidad', label: 'Calidad' },
                { k: 'puntualidad', label: 'Puntualidad' },
                { k: 'comunicacion', label: 'Comunicación' },
                { k: 'precio', label: 'Precio' },
              ].map(({ k, label }) => (
                <div key={k} className="text-center">
                  <p className="text-[14px] font-extrabold text-ink">{(r[k] || 0).toFixed(1)}</p>
                  <p className="text-[10px] text-ink-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Main ProfileMaestro
// ============================================================

function ProfileMaestro() {
  const { user } = useAuthStore();
  const { data: maestro, refetch } = useMaestroDetail(user?.id || '');
  const m = maestro as any;

  const [disponible, setDisponible] = useState<boolean>(true);
  const [telefonoPublico, setTelefonoPublico] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'solicitudes' | 'resenas'>('solicitudes');

  // Sync local toggles with maestro data when it loads
  useEffect(() => {
    if (m) {
      setDisponible(m.disponible ?? true);
      setTelefonoPublico(m.telefono_publico ?? false);
    }
  }, [m?.disponible, m?.telefono_publico]);

  const toggleDisponible = async () => {
    if (!user?.id) return;
    const next = !disponible;
    setDisponible(next);
    await supabase.from('maestro_profiles').update({ disponible: next }).eq('user_id', user.id);
    refetch();
  };

  const toggleTelefono = async () => {
    if (!user?.id) return;
    const next = !telefonoPublico;
    setTelefonoPublico(next);
    await supabase.from('maestro_profiles').update({ telefono_publico: next }).eq('user_id', user.id);
    refetch();
  };

  const tabs = [
    { id: 'solicitudes' as const, label: 'Solicitudes', icon: FileText },
    { id: 'resenas' as const, label: 'Reseñas', icon: Star },
  ];

  return (
    <>
      {/* ===== MOBILE ===== */}
      <div className="lg:hidden max-w-2xl mx-auto">
        <div className="bg-grad-cta px-[18px] pt-4 pb-20 relative overflow-hidden">
          <h1 className="text-[18px] font-extrabold text-white tracking-tight">Mi perfil</h1>
          <div className="absolute -right-[30px] -bottom-[30px] w-[140px] h-[140px] rounded-full bg-white/[0.08]" />
        </div>

        <div className="px-[18px] -mt-14 relative z-10">
          <div className="bg-surface rounded-[18px] border border-border p-4">
            <div className="flex gap-[14px] items-end -mt-[42px]">
              <div className="w-[84px] h-[84px] rounded-full bg-primary-soft flex items-center justify-center text-violet font-bold text-2xl overflow-hidden ring-[3px] ring-primary-soft ring-offset-2 ring-offset-surface shrink-0">
                {user?.foto_url ? (
                  <img src={user.foto_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  user?.nombre?.charAt(0) || '?'
                )}
              </div>
              <div className="flex-1 pb-1">
                <Link href="/app/perfil/completar" className="inline-flex items-center gap-1 bg-bg-alt px-3 py-[7px] rounded-full text-[11.5px] font-bold text-ink hover:bg-border transition-colors">
                  <Edit3 size={11} /> Editar
                </Link>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-violet">{m?.oficio || 'Maestro'}</p>
              <h2 className="text-[22px] font-extrabold text-ink tracking-tight mt-0.5">{user?.nombre}</h2>
              <div className="flex items-center gap-[6px] mt-1 text-[12.5px] text-ink-soft">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={12} className={i <= Math.round(m?.rating_promedio || 0) ? 'fill-amber text-amber' : 'text-border'} />
                  ))}
                </div>
                <span className="font-bold text-ink">{(m?.rating_promedio || 0).toFixed(1)}</span>
                <span className="opacity-70">· {m?.total_ratings || 0} reseñas</span>
              </div>
            </div>

            <div className="mt-[14px] pt-3 border-t border-border flex flex-col gap-3">
              <ToggleRow icon={Bell} label="Estoy disponible" sub="Recibir solicitudes de clientes" on={disponible} onChange={toggleDisponible} accent="green" />
              <ToggleRow icon={Phone} label="Teléfono público" sub={telefonoPublico ? user?.telefono || 'Visible' : 'Solo por chat'} on={telefonoPublico} onChange={toggleTelefono} />
            </div>
          </div>
        </div>

        {m?.especialidades?.length > 0 && (
          <div className="px-[18px] mt-[18px]">
            <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-tight opacity-90">Especialidades</h3>
            <div className="flex flex-wrap gap-[6px] mt-[10px]">
              {m.especialidades.map((e: string) => (
                <span key={e} className="px-[14px] py-[7px] rounded-full text-[12.5px] font-semibold bg-violet text-white">{e}</span>
              ))}
            </div>
            <Link href="/app/perfil/completar" className="text-[12px] font-semibold text-violet hover:underline mt-2 inline-block">
              Editar en el formulario
            </Link>
          </div>
        )}

        {m?.user?.comuna && (
          <div className="px-[18px] mt-4">
            <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-tight opacity-90">Zona de cobertura</h3>
            <div className="bg-surface rounded-[18px] border border-border p-3 mt-[10px] flex items-center gap-[10px]">
              <div className="w-9 h-9 rounded-[10px] bg-primary-soft flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-primary-deep" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-ink">{m.user.comuna}{m.user.region ? `, ${m.user.region}` : ''}</p>
                <p className="text-[11px] text-ink-muted">Hasta 30 km a la redonda</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile tabs */}
        <div className="px-[18px] mt-5">
          <div className="flex gap-1 bg-bg-alt rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-[6px] py-[10px] text-[12.5px] font-bold rounded-[10px] transition-all ${
                  activeTab === tab.id ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <tab.icon size={13} /> {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-4 mb-6">
            {activeTab === 'solicitudes' && user?.id && <SolicitudesTab maestroId={user.id} />}
            {activeTab === 'resenas' && user?.id && <ResenasTab maestroId={user.id} />}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:block max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-7">
          {/* Sidebar */}
          <div className="w-[320px] shrink-0">
            <div className="sticky top-[80px] space-y-4">
              <div className="bg-surface rounded-[18px] border border-border p-5">
                <div className="flex flex-col items-center text-center">
                  <div className="w-[100px] h-[100px] rounded-full bg-primary-soft flex items-center justify-center text-violet font-bold text-3xl overflow-hidden ring-4 ring-primary-soft/50">
                    {user?.foto_url ? (
                      <img src={user.foto_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user?.nombre?.charAt(0) || '?'
                    )}
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10.5px] font-bold mt-3 ${
                    disponible ? 'bg-green-soft text-green' : 'bg-bg-alt text-ink-muted'
                  }`}>
                    <span className={`w-[6px] h-[6px] rounded-full ${disponible ? 'bg-green' : 'bg-ink-muted'}`} />
                    {disponible ? 'Disponible' : 'No disponible'}
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-violet mt-3">{m?.oficio || 'Maestro'}</p>
                  <h2 className="text-[20px] font-extrabold text-ink tracking-tight mt-1">{user?.nombre}</h2>
                  <div className="flex items-center gap-[6px] mt-1 text-[12.5px] text-ink-soft">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={12} className={i <= Math.round(m?.rating_promedio || 0) ? 'fill-amber text-amber' : 'text-border'} />
                      ))}
                    </div>
                    <span className="font-bold text-ink">{(m?.rating_promedio || 0).toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
                  {[
                    { label: 'Reseñas', value: m?.total_ratings || 0 },
                    { label: 'Años', value: m?.experiencia_anios || 0 },
                    { label: 'Comunas', value: parseZonaCobertura(m?.zona_cobertura).length },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-[18px] font-extrabold text-ink">{s.value}</p>
                      <p className="text-[10.5px] text-ink-muted font-semibold">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <ToggleRow icon={Bell} label="Disponible" sub="Recibir solicitudes" on={disponible} onChange={toggleDisponible} accent="green" />
                  <ToggleRow icon={Phone} label="Teléfono público" sub={telefonoPublico ? 'Visible' : 'Solo chat'} on={telefonoPublico} onChange={toggleTelefono} />
                </div>

                <div className="mt-4 space-y-2">
                  <Link href={`/app/maestro/${user?.id}`} className="w-full flex items-center justify-center gap-2 py-[10px] rounded-[12px] border border-border text-[13px] font-bold text-ink hover:bg-bg-alt transition-colors">
                    <Eye size={14} /> Ver perfil público
                  </Link>
                  <Link href="/app/perfil/completar" className="w-full flex items-center justify-center gap-2 py-[10px] rounded-[12px] bg-bg-alt text-[13px] font-bold text-ink hover:bg-border transition-colors">
                    <Edit3 size={14} /> Editar perfil
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Stats banner — datos reales */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Postulaciones', value: '—', icon: FileText, color: 'text-violet bg-primary-soft' },
                { label: 'Rating promedio', value: (m?.rating_promedio || 0).toFixed(1), icon: Star, color: 'text-amber bg-amber/10' },
                { label: 'Años experiencia', value: String(m?.experiencia_anios || 0), icon: Clock, color: 'text-violet bg-primary-soft' },
              ].map((s) => (
                <div key={s.label} className="bg-surface rounded-[16px] border border-border p-4">
                  <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center mb-2 ${s.color}`}>
                    <s.icon size={15} />
                  </div>
                  <p className="text-[20px] font-extrabold text-ink tracking-tight">{s.value}</p>
                  <p className="text-[11px] text-ink-muted font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-bg-alt rounded-xl p-1 mb-5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-[6px] py-[10px] text-[12.5px] font-bold rounded-[10px] transition-all ${
                    activeTab === tab.id ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'solicitudes' && user?.id && <SolicitudesTab maestroId={user.id} />}
            {activeTab === 'resenas' && user?.id && <ResenasTab maestroId={user.id} />}
          </div>
        </div>
      </div>
    </>
  );
}

function parseZonaCobertura(z: any): string[] {
  if (!z) return [];
  if (Array.isArray(z)) return z;
  try { return JSON.parse(z); } catch { return []; }
}

// ============================================================
// Page entry — redirige cliente anónimo a recuperar publicación
// ============================================================

export default function PerfilPage() {
  const { viewMode, isLoading, session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!session || viewMode !== 'maestro')) {
      router.replace('/recuperar-publicacion');
    }
  }, [isLoading, session, viewMode, router]);

  if (isLoading || !session || viewMode !== 'maestro') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-10 h-10 border-[3px] border-primary-soft border-t-violet rounded-full animate-spin" />
      </div>
    );
  }

  return <ProfileMaestro />;
}
