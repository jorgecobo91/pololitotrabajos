'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { useMaestroDetail, useMutateMaestroProfile } from '@/lib/hooks';
import { maestroProfileSchema, type MaestroProfileFormData } from '@/lib/validations';
import { OFICIOS, ESPECIALIDADES_POR_OFICIO, EXPERIENCIA_OPTIONS, COMUNAS_POR_REGION, REGIONES } from '@/lib/constants';
import Link from 'next/link';
import {
  ArrowLeft, ChevronDown, CheckCircle, AlertCircle, Send, Search,
  Briefcase, FileText, MapPin, Phone, Zap, Shield, User, Star, Eye, Mail,
  Camera, X, Loader2, Image as ImageIcon,
} from 'lucide-react';

// ============================================================
// Avatar + Portafolio uploaders
// ============================================================

async function uploadFoto(file: File, kind: 'avatar' | 'portfolio'): Promise<{ url: string; id?: string } | null> {
  const { supabase } = await import('@/lib/supabase');
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return null;

  const fd = new FormData();
  fd.append('file', file);
  fd.append('kind', kind);

  const res = await fetch('/api/upload-maestro-foto', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` },
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'No se pudo subir la foto');
  }
  return await res.json();
}

async function deletePortfolioItem(id: string): Promise<boolean> {
  const { supabase } = await import('@/lib/supabase');
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return false;
  const res = await fetch(`/api/upload-maestro-foto?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  return res.ok;
}

function AvatarUploader({ currentUrl, onUploaded }: { currentUrl?: string | null; onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError('');
    try {
      const result = await uploadFoto(files[0], 'avatar');
      if (result?.url) onUploaded(result.url);
    } catch (e: any) {
      setError(e?.message || 'Error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative w-[88px] h-[88px] rounded-full overflow-hidden border-2 border-dashed border-violet/40 bg-primary-soft/40 flex items-center justify-center hover:bg-primary-soft transition-colors disabled:opacity-60 shrink-0"
      >
        {currentUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={currentUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <Camera size={26} className="text-violet" />
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 size={20} className="text-white animate-spin" />
          </div>
        )}
      </button>
      <div className="flex-1">
        <p className="text-[13px] font-bold text-ink">Foto de perfil</p>
        <p className="text-[11.5px] text-ink-muted leading-[1.45] mt-0.5">
          Una foto profesional aumenta la confianza. Tipo carné, mostrando tu rostro.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-2 text-[12px] font-bold text-violet hover:underline"
        >
          {currentUrl ? 'Cambiar foto' : 'Subir foto'}
        </button>
        {error && <p className="text-[11px] text-red font-medium mt-1">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        hidden
        onChange={(e) => onPick(e.target.files)}
      />
    </div>
  );
}

type PortfolioItem = { id: string; image_url: string };

function PortfolioUploader({ items, onAdded, onRemoved }: {
  items: PortfolioItem[];
  onAdded: (item: PortfolioItem) => void;
  onRemoved: (id: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = async (files: FileList | null) => {
    if (!files?.length) return;
    if (items.length >= 8) {
      setError('Máximo 8 fotos en el portafolio');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const remaining = 8 - items.length;
      const list = Array.from(files).slice(0, remaining);
      for (const f of list) {
        const result = await uploadFoto(f, 'portfolio');
        if (result?.url) {
          // El API insertó el row pero no devuelve id; lo agregamos optimista con un placeholder
          // El re-fetch del perfil después de guardar trae la lista real.
          onAdded({ id: `temp-${Date.now()}-${Math.random()}`, image_url: result.url });
        }
      }
    } catch (e: any) {
      setError(e?.message || 'Error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = async (id: string) => {
    if (id.startsWith('temp-')) {
      // Optimistic only — recargar página para sync
      onRemoved(id);
      return;
    }
    const ok = await deletePortfolioItem(id);
    if (ok) onRemoved(id);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <div key={it.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border bg-bg-alt group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image_url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(it.id)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {items.length < 8 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-border bg-bg flex flex-col items-center justify-center gap-1 hover:border-violet hover:bg-primary-soft/30 transition-colors disabled:opacity-50"
          >
            {uploading
              ? <Loader2 size={18} className="text-violet animate-spin" />
              : <Camera size={18} className="text-violet" />}
            <span className="text-[10px] font-semibold text-ink-muted">
              {uploading ? 'Subiendo' : 'Añadir'}
            </span>
          </button>
        )}
      </div>
      <p className="text-[10.5px] text-ink-muted mt-2 flex items-center gap-1">
        <ImageIcon size={11} /> Sube fotos de trabajos previos. Máximo 8.
      </p>
      {error && <p className="text-[11px] text-red font-medium mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
        hidden
        onChange={(e) => onPick(e.target.files)}
      />
    </div>
  );
}

// ============================================================

function SectionCard({ title, icon: Icon, error, children }: {
  title: string; icon: any; error?: string; children: React.ReactNode;
}) {
  return (
    <div className={`bg-surface rounded-[18px] border p-5 ${error ? 'border-red/40' : 'border-border'}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-[10px] bg-primary-soft flex items-center justify-center">
          <Icon size={15} className="text-violet" />
        </div>
        <h3 className="text-[13px] font-extrabold text-ink uppercase tracking-tight">{title}</h3>
      </div>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 mt-3 text-[12px] text-red font-medium">
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
}

function ProgressSidebar({ watch }: { watch: any }) {
  const oficio = watch('oficio');
  const especialidades = watch('especialidades');
  const bio = watch('bio');
  const experiencia = watch('experiencia');
  const zona = watch('zona_cobertura');
  const terms = watch('accepted_terms');

  const steps = [
    { label: 'Oficio', done: !!oficio },
    { label: 'Especialidades', done: especialidades?.length > 0 },
    { label: 'Bio', done: bio?.length > 10 },
    { label: 'Experiencia', done: !!experiencia },
    { label: 'Zona', done: zona?.length > 0 },
    { label: 'Términos', done: terms === true },
  ];

  const completed = steps.filter(s => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);

  return (
    <div className="bg-surface rounded-[18px] border border-border p-5">
      <h4 className="text-[12px] font-bold uppercase tracking-[0.4px] text-ink-muted mb-3">Progreso</h4>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#E8E4DC" strokeWidth="4" />
            <circle cx="24" cy="24" r="20" fill="none" stroke="url(#grad)" strokeWidth="4"
              strokeDasharray={`${pct * 1.257} 125.7`} strokeLinecap="round" />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-ink">{pct}%</span>
        </div>
        <div>
          <p className="text-[14px] font-extrabold text-ink">{completed}/{steps.length}</p>
          <p className="text-[11px] text-ink-muted">secciones completas</p>
        </div>
      </div>
      <div className="space-y-2">
        {steps.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <CheckCircle size={14} className={s.done ? 'text-green' : 'text-border'} />
            <span className={`text-[12.5px] font-semibold ${s.done ? 'text-ink' : 'text-ink-muted'}`}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewCard({ watch, avatarUrl, nombre }: { watch: any; avatarUrl?: string | null; nombre?: string }) {
  const oficio = watch('oficio');
  const bio = watch('bio');
  const especialidades = watch('especialidades') || [];

  return (
    <div className="bg-surface rounded-[18px] border border-border p-5">
      <div className="flex items-center gap-2 mb-3">
        <Eye size={14} className="text-violet" />
        <h4 className="text-[12px] font-bold uppercase tracking-[0.4px] text-ink-muted">Vista previa</h4>
      </div>
      <div className="bg-bg rounded-[14px] border border-border p-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-violet font-bold text-sm overflow-hidden">
            {avatarUrl
              /* eslint-disable-next-line @next/next/no-img-element */
              ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              : (nombre?.charAt(0)?.toUpperCase() || 'M')}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-violet">{oficio || 'Tu oficio'}</p>
            <p className="text-[13px] font-bold text-ink">{nombre || 'Tu nombre'}</p>
          </div>
        </div>
        {bio && <p className="text-[11px] text-ink-soft leading-[1.4] line-clamp-2 mb-2">{bio}</p>}
        {especialidades.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {especialidades.slice(0, 3).map((e: string) => (
              <span key={e} className="px-2 py-[3px] rounded-full text-[9.5px] font-semibold bg-primary-soft text-violet">{e}</span>
            ))}
            {especialidades.length > 3 && (
              <span className="px-2 py-[3px] rounded-full text-[9.5px] font-semibold bg-bg-alt text-ink-muted">+{especialidades.length - 3}</span>
            )}
          </div>
        )}
      </div>
      <p className="text-[10px] text-ink-muted mt-2 text-center">Así te verán los clientes</p>
    </div>
  );
}

export default function CompletarPerfilPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: maestro, isLoading: loadingProfile } = useMaestroDetail(user?.id || '');
  const mutation = useMutateMaestroProfile(user?.id || '');
  const [comunaSearch, setComunaSearch] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.foto_url || null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  // Cargar portafolio existente
  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      const { supabase } = await import('@/lib/supabase');
      const { data: profile } = await supabase
        .from('maestro_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!profile) return;
      const { data: items } = await supabase
        .from('portfolio_items')
        .select('id, image_url')
        .eq('maestro_id', profile.id)
        .order('created_at', { ascending: false });
      setPortfolio((items || []) as PortfolioItem[]);
    }
    load();
  }, [user?.id]);

  useEffect(() => {
    if ((maestro as any)?.user?.foto_url) {
      setAvatarUrl((maestro as any).user.foto_url);
    }
  }, [maestro]);

  const form = useForm<MaestroProfileFormData>({
    resolver: zodResolver(maestroProfileSchema),
    defaultValues: {
      oficio: '',
      especialidades: [],
      bio: '',
      experiencia: '',
      zona_cobertura: [],
      telefono_publico: false,
      disponible: true,
      disponible_urgencias: false,
      accepted_terms: undefined as any,
    },
  });

  const { register, control, handleSubmit, watch, reset, formState: { errors } } = form;
  const selectedOficio = watch('oficio');

  useEffect(() => {
    if (maestro && !loadingProfile) {
      const m = maestro as any;
      let zonas: string[] = [];
      try { zonas = JSON.parse(m.zona_cobertura || '[]'); } catch { zonas = []; }

      const expOption = EXPERIENCIA_OPTIONS.find(o => parseInt(o.value) === m.experiencia_anios);

      reset({
        oficio: m.oficio || '',
        especialidades: m.especialidades || [],
        bio: m.bio || '',
        experiencia: expOption?.value || '',
        zona_cobertura: zonas,
        telefono_publico: m.telefono_publico || false,
        disponible: m.disponible !== false, // default true
        disponible_urgencias: m.disponible_urgencias || false,
        accepted_terms: m.accepted_terms || undefined as any,
      });
    }
  }, [maestro, loadingProfile, reset]);

  const onSubmit = async (data: MaestroProfileFormData) => {
    try {
      await mutation.mutateAsync(data);
      router.push('/app/perfil');
    } catch {
      // error handled by mutation state
    }
  };

  const allComunas = REGIONES.flatMap(r => COMUNAS_POR_REGION[r]);
  const filteredComunas = comunaSearch
    ? allComunas.filter(c => c.toLowerCase().includes(comunaSearch.toLowerCase()))
    : null;

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-primary-soft border-t-violet rounded-full animate-spin" />
          <span className="text-sm text-ink-muted font-medium">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:max-w-5xl lg:mx-auto px-[18px] lg:px-6 py-5 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[13px] font-semibold text-ink-muted hover:text-ink mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Volver
        </button>
        <h1 className="text-[22px] lg:text-[26px] font-extrabold text-ink tracking-[-0.5px]">Tu perfil profesional</h1>
        <p className="text-[13px] text-ink-muted mt-1">Llena todos los datos para que los clientes te encuentren</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-6">
          {/* Main form */}
          <div className="space-y-5">
            {/* Foto de perfil */}
            <SectionCard title="Foto de perfil" icon={User}>
              <AvatarUploader
                currentUrl={avatarUrl}
                onUploaded={(url) => setAvatarUrl(url)}
              />
            </SectionCard>

            {/* Portafolio */}
            <SectionCard title="Portafolio de trabajos" icon={ImageIcon}>
              <PortfolioUploader
                items={portfolio}
                onAdded={(it) => setPortfolio((p) => [...p, it])}
                onRemoved={(id) => setPortfolio((p) => p.filter((x) => x.id !== id))}
              />
            </SectionCard>

            {/* Oficio */}
            <SectionCard title="¿Cuál es tu oficio principal?" icon={Briefcase} error={errors.oficio?.message}>
              <div className="relative">
                <select
                  {...register('oficio')}
                  className="w-full h-11 px-[14px] pr-10 rounded-xl border border-border bg-bg-alt text-[13.5px] font-semibold text-ink outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet appearance-none cursor-pointer"
                >
                  <option value="">Selecciona tu oficio...</option>
                  {OFICIOS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
              </div>
            </SectionCard>

            {/* Especialidades */}
            {selectedOficio && ESPECIALIDADES_POR_OFICIO[selectedOficio] && (
              <SectionCard title="Selecciona tus especialidades" icon={Star} error={errors.especialidades?.message}>
                <Controller
                  name="especialidades"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-[6px]">
                      {ESPECIALIDADES_POR_OFICIO[selectedOficio].map((esp) => {
                        const selected = field.value.includes(esp);
                        return (
                          <button
                            key={esp}
                            type="button"
                            onClick={() => {
                              field.onChange(
                                selected
                                  ? field.value.filter((e: string) => e !== esp)
                                  : [...field.value, esp]
                              );
                            }}
                            className={`flex items-center gap-2 px-3 py-[10px] rounded-xl text-[12.5px] font-semibold text-left transition-colors ${
                              selected
                                ? 'bg-violet text-white'
                                : 'bg-bg-alt text-ink-soft hover:bg-border'
                            }`}
                          >
                            <div className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center shrink-0 ${
                              selected ? 'bg-white border-white' : 'border-border-strong'
                            }`}>
                              {selected && <CheckCircle size={12} className="text-violet" />}
                            </div>
                            {esp}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </SectionCard>
            )}

            {/* Bio */}
            <SectionCard title="Cuéntanos sobre ti" icon={FileText} error={errors.bio?.message}>
              <div>
                <textarea
                  {...register('bio')}
                  placeholder="Ej: 15 años de experiencia en instalaciones residenciales. Trabajo con materiales de primera calidad y garantía escrita..."
                  rows={4}
                  maxLength={300}
                  className="w-full px-[14px] py-3 rounded-xl border border-border bg-bg-alt text-[13.5px] text-ink outline-none resize-none leading-[1.5] focus:ring-2 focus:ring-violet/30 focus:border-violet placeholder:text-ink-soft"
                />
                <p className="text-right text-[11px] text-ink-muted mt-1">{watch('bio')?.length || 0}/300</p>
              </div>
            </SectionCard>

            {/* Experiencia */}
            <SectionCard title="Años de experiencia" icon={Briefcase} error={errors.experiencia?.message}>
              <div className="relative">
                <select
                  {...register('experiencia')}
                  className="w-full h-11 px-[14px] pr-10 rounded-xl border border-border bg-bg-alt text-[13.5px] font-semibold text-ink outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet appearance-none cursor-pointer"
                >
                  <option value="">Selecciona...</option>
                  {EXPERIENCIA_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
              </div>
            </SectionCard>

            {/* Zona de cobertura */}
            <SectionCard title="¿En qué comunas trabajas?" icon={MapPin} error={errors.zona_cobertura?.message}>
              <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-bg-alt mb-3">
                <Search size={14} className="text-ink-muted shrink-0" />
                <input
                  type="text"
                  value={comunaSearch}
                  onChange={(e) => setComunaSearch(e.target.value)}
                  placeholder="Buscar comuna..."
                  className="flex-1 h-full bg-transparent border-none outline-none text-[13px] text-ink placeholder:text-ink-soft"
                />
              </div>
              <Controller
                name="zona_cobertura"
                control={control}
                render={({ field }) => (
                  <div className="max-h-[340px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                    {filteredComunas ? (
                      <div className="space-y-[2px]">
                        {filteredComunas.map((comuna) => {
                          const selected = field.value.includes(comuna);
                          return (
                            <button
                              key={comuna}
                              type="button"
                              onClick={() => {
                                field.onChange(
                                  selected
                                    ? field.value.filter((c: string) => c !== comuna)
                                    : [...field.value, comuna]
                                );
                              }}
                              className={`w-full flex items-center gap-[10px] px-3 py-[9px] rounded-xl text-[13px] font-semibold text-left transition-colors ${
                                selected ? 'bg-primary-soft text-primary-deep' : 'text-ink-soft hover:bg-bg-alt'
                              }`}
                            >
                              <div className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center shrink-0 ${
                                selected ? 'bg-violet border-violet' : 'border-border-strong'
                              }`}>
                                {selected && <CheckCircle size={12} className="text-white" />}
                              </div>
                              {comuna}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      REGIONES.map((region) => (
                        <div key={region} className="mb-3">
                          <p className="text-[11px] font-extrabold uppercase tracking-[0.5px] text-ink-muted px-3 py-2 sticky top-0 bg-surface z-[1]">
                            Región de {region}
                          </p>
                          <div className="space-y-[2px]">
                            {COMUNAS_POR_REGION[region].map((comuna) => {
                              const selected = field.value.includes(comuna);
                              return (
                                <button
                                  key={comuna}
                                  type="button"
                                  onClick={() => {
                                    field.onChange(
                                      selected
                                        ? field.value.filter((c: string) => c !== comuna)
                                        : [...field.value, comuna]
                                    );
                                  }}
                                  className={`w-full flex items-center gap-[10px] px-3 py-[9px] rounded-xl text-[13px] font-semibold text-left transition-colors ${
                                    selected ? 'bg-primary-soft text-primary-deep' : 'text-ink-soft hover:bg-bg-alt'
                                  }`}
                                >
                                  <div className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center shrink-0 ${
                                    selected ? 'bg-violet border-violet' : 'border-border-strong'
                                  }`}>
                                    {selected && <CheckCircle size={12} className="text-white" />}
                                  </div>
                                  {comuna}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              />
              {watch('zona_cobertura')?.length > 0 && (
                <p className="text-[11px] text-violet font-semibold mt-2">
                  {watch('zona_cobertura').length} comunas seleccionadas
                </p>
              )}
            </SectionCard>

            {/* Contacto */}
            <SectionCard title="Contacto" icon={Phone}>
              <div className="space-y-3">
                {/* Teléfono */}
                <div>
                  <label className="text-[11.5px] font-bold text-ink-muted uppercase tracking-wide mb-[6px] block">Teléfono</label>
                  <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-bg-alt focus-within:ring-2 focus-within:ring-violet/30 focus-within:border-violet">
                    <Phone size={14} className="text-violet shrink-0" />
                    <span className="text-[13px] text-ink-muted font-semibold">+56</span>
                    <input
                      type="tel"
                      defaultValue={user?.telefono?.replace('+56', '') || ''}
                      placeholder="9 1234 5678"
                      maxLength={11}
                      onChange={async (e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length >= 9) {
                          const { supabase } = await import('@/lib/supabase');
                          await supabase.from('users').update({ telefono: `+56${val}` }).eq('id', user?.id);
                        }
                      }}
                      className="flex-1 h-full border-none bg-transparent outline-none text-[13.5px] text-ink placeholder:text-ink-soft"
                    />
                  </div>
                </div>

                {/* Correo (solo lectura) */}
                <div>
                  <label className="text-[11.5px] font-bold text-ink-muted uppercase tracking-wide mb-[6px] block">Correo electrónico</label>
                  <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-bg-alt opacity-70">
                    <Mail size={14} className="text-violet shrink-0" />
                    <span className="text-[13.5px] text-ink">{user?.email || ''}</span>
                  </div>
                  <p className="text-[10.5px] text-ink-muted mt-1">Tu correo no se muestra públicamente</p>
                </div>

                <div className="border-t border-border my-1" />

                <Controller
                  name="telefono_publico"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className="w-full flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-[10px] bg-bg-alt flex items-center justify-center shrink-0">
                        <Phone size={15} className={field.value ? 'text-violet' : 'text-ink-muted'} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-bold text-ink">Mostrar teléfono públicamente</p>
                        <p className="text-[11.5px] text-ink-soft">Los clientes podrán llamarte directamente</p>
                      </div>
                      <div className={`w-11 h-[26px] rounded-full transition-colors relative shrink-0 ${field.value ? 'bg-violet' : 'bg-bg-alt'}`}>
                        <div className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow transition-all ${field.value ? 'left-[21px]' : 'left-[3px]'}`} />
                      </div>
                    </button>
                  )}
                />
                <Controller
                  name="disponible"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className="w-full flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-[10px] bg-bg-alt flex items-center justify-center shrink-0">
                        <CheckCircle size={15} className={field.value ? 'text-green' : 'text-ink-muted'} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-bold text-ink">Disponible para tomar trabajos</p>
                        <p className="text-[11.5px] text-ink-soft">Aparecerás en el catálogo. Apágalo si tu agenda está copada.</p>
                      </div>
                      <div className={`w-11 h-[26px] rounded-full transition-colors relative shrink-0 ${field.value ? 'bg-green' : 'bg-bg-alt'}`}>
                        <div className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow transition-all ${field.value ? 'left-[21px]' : 'left-[3px]'}`} />
                      </div>
                    </button>
                  )}
                />
                <Controller
                  name="disponible_urgencias"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className="w-full flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-[10px] bg-bg-alt flex items-center justify-center shrink-0">
                        <Zap size={15} className={field.value ? 'text-red' : 'text-ink-muted'} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-bold text-ink">Disponible para urgencias</p>
                        <p className="text-[11.5px] text-ink-soft">Recibirás solicitudes urgentes 24/7</p>
                      </div>
                      <div className={`w-11 h-[26px] rounded-full transition-colors relative shrink-0 ${field.value ? 'bg-red' : 'bg-bg-alt'}`}>
                        <div className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow transition-all ${field.value ? 'left-[21px]' : 'left-[3px]'}`} />
                      </div>
                    </button>
                  )}
                />
              </div>
            </SectionCard>

            {/* Términos */}
            <SectionCard title="Términos y condiciones" icon={Shield} error={errors.accepted_terms?.message}>
              <Controller
                name="accepted_terms"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={`w-full flex items-start gap-3 p-[14px] rounded-[14px] border-[1.5px] border-dashed transition-colors text-left ${
                      field.value ? 'border-violet bg-primary-soft/30' : 'border-border-strong bg-bg-alt'
                    }`}
                  >
                    <div className={`w-[20px] h-[20px] rounded-md border-2 flex items-center justify-center shrink-0 mt-[1px] ${
                      field.value ? 'bg-violet border-violet' : 'border-border-strong'
                    }`}>
                      {field.value && <CheckCircle size={13} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-ink">
                        Acepto los{' '}
                        <Link href="/legal/terminos" className="text-violet underline" onClick={(e) => e.stopPropagation()}>
                          Términos y Condiciones
                        </Link>
                        {' '}de POLOLITOTRABAJOS
                      </p>
                      <p className="text-[11px] text-ink-muted mt-1">
                        Al aceptar, confirmas que tu información es verídica y te comprometes a ofrecer un servicio profesional.
                      </p>
                    </div>
                  </button>
                )}
              />
            </SectionCard>

            {/* Submit */}
            <div className="pb-6">
              {mutation.isError && (
                <div className="p-3 bg-red-soft rounded-xl text-[12px] text-red font-medium mb-3 flex items-center gap-2">
                  <AlertCircle size={14} /> Error al guardar. Inténtalo de nuevo.
                </div>
              )}
              {mutation.isSuccess && (
                <div className="p-3 bg-green-soft rounded-xl text-[12px] text-green font-medium mb-3 flex items-center gap-2">
                  <CheckCircle size={14} /> Perfil guardado exitosamente
                </div>
              )}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-[15px] rounded-[14px] bg-grad-cta text-white font-bold text-[15px] hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)] flex items-center justify-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Send size={15} /> Guardar perfil
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-ink-muted mt-3 leading-[1.4]">
                Tu perfil será visible para todos los clientes de la plataforma.
              </p>
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-[96px] space-y-4">
              <ProgressSidebar watch={watch} />
              <PreviewCard watch={watch} avatarUrl={avatarUrl} nombre={user?.nombre} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
