'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { usePublicaciones } from '@/lib/hooks';
import { OFICIOS, COMUNAS_POR_REGION, REGIONES } from '@/lib/constants';
import {
  MapPin, Zap, Clock, Send, User, FileText, CheckCircle, Eye, Mail, Phone,
  Camera, X, ChevronLeft, ChevronRight, Loader2, ImageIcon,
} from 'lucide-react';

// ============================================================
// Constantes
// ============================================================

const PRESUPUESTOS = [
  { label: 'Hasta $50.000',         value: '50k',   min: 0,      max: 50000 },
  { label: '$50.000 – $150.000',    value: '150k',  min: 50000,  max: 150000 },
  { label: '$150.000 – $500.000',   value: '500k',  min: 150000, max: 500000 },
  { label: 'Más de $500.000',       value: '500k+', min: 500000, max: null },
  { label: 'Por definir',           value: 'tbd',   min: null,   max: null },
];

const STEPS = ['Detalles', 'Categoría', 'Ubicación', 'Contacto'];

// ============================================================
// Sub-componentes
// ============================================================

function Field({ label, hint, error, children }: {
  label: string; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-[7px]">
        <label className="text-[11.5px] font-bold text-ink uppercase tracking-wide">{label}</label>
        {hint && <span className="text-[11px] text-ink-muted">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[11px] text-red font-medium mt-1">{error}</p>}
    </div>
  );
}

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mt-3 mb-1 overflow-x-auto pb-1 -mx-1 px-1">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-2 shrink-0">
            <div className={`flex items-center gap-2 px-3 py-[7px] rounded-full text-[12px] font-bold transition-colors ${
              done ? 'bg-green-soft text-green'
              : active ? 'bg-primary-soft text-primary-deep'
              : 'bg-bg-alt text-ink-muted'
            }`}>
              {done
                ? <CheckCircle size={13} />
                : <span className="w-[18px] h-[18px] rounded-full bg-current/10 flex items-center justify-center text-[10px]">{i + 1}</span>}
              {label}
            </div>
            {i < STEPS.length - 1 && <div className="w-5 h-[2px] bg-border rounded-full" />}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Live preview
// ============================================================

function LivePreview({ form, fotos }: { form: FormState; fotos: string[] }) {
  const presupuesto = PRESUPUESTOS.find(p => p.value === form.presupuesto);
  const ubicacionMostrar = form.comuna
    ? `${form.comuna}${form.ubicacion ? ` · ${form.ubicacion}` : ''}`
    : form.ubicacion;

  return (
    <div className="bg-surface rounded-[18px] border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Eye size={14} className="text-violet" />
        <h3 className="text-[12px] font-bold uppercase tracking-[0.4px] text-ink-muted">Vista previa</h3>
      </div>

      <div className="bg-bg rounded-[14px] border border-border p-[14px]">
        <div className="flex gap-[10px] items-center mb-[10px]">
          <div className="w-[38px] h-[38px] rounded-full bg-primary-soft flex items-center justify-center text-violet text-sm font-bold shrink-0">
            {form.nombre_cliente?.charAt(0)?.toUpperCase() || 'T'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-ink">{form.nombre_cliente || 'Tú'}</p>
            <div className="text-[11px] text-ink-muted flex items-center gap-1">
              <Clock size={10} /> Ahora
              {ubicacionMostrar && (
                <>
                  <span className="opacity-50 mx-0.5">·</span>
                  <MapPin size={10} /> {ubicacionMostrar}
                </>
              )}
            </div>
          </div>
          {form.urgente && (
            <div className="inline-flex items-center gap-1 bg-red-soft text-red px-2 py-[3px] rounded-full text-[10px] font-extrabold">
              <Zap size={10} className="fill-red" /> URGENTE
            </div>
          )}
        </div>

        <h4 className="text-[15px] font-extrabold text-ink tracking-tight leading-[1.25]">
          {form.titulo || 'Título de tu solicitud...'}
        </h4>
        <p className="mt-[6px] text-[12.5px] text-ink-soft leading-[1.45] line-clamp-3">
          {form.descripcion || 'La descripción aparecerá aquí...'}
        </p>

        {fotos.length > 0 && (
          <div className="flex gap-1.5 mt-[10px]">
            {fotos.slice(0, 3).map((url, i) => (
              <div key={i} className="w-14 h-14 rounded-lg overflow-hidden bg-bg-alt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {fotos.length > 3 && (
              <div className="w-14 h-14 rounded-lg bg-bg-alt flex items-center justify-center text-[11px] font-bold text-ink-muted">
                +{fotos.length - 3}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-[10px] pt-[10px] border-t border-border">
          <div className="flex items-center gap-[6px] flex-wrap">
            {form.especialidad && (
              <span className="px-[10px] py-[5px] rounded-full text-[11px] font-semibold bg-surface border border-border text-ink-soft">
                {form.especialidad}
              </span>
            )}
            {presupuesto && presupuesto.value !== 'tbd' && (
              <span className="px-[10px] py-[5px] rounded-full text-[11px] font-semibold bg-green-soft text-green">
                {presupuesto.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-ink-muted mt-3 text-center leading-[1.4]">
        Así verán tu publicación los maestros de la zona
      </p>
    </div>
  );
}

// ============================================================
// Form state
// ============================================================

type FormState = {
  titulo: string;
  descripcion: string;
  especialidad: string;
  region: string;
  comuna: string;
  ubicacion: string;
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string;
  urgente: boolean;
  presupuesto: string;
  mostrar_email: boolean;
  mostrar_telefono: boolean;
  accepted_terms: boolean;
};

const initialForm: FormState = {
  titulo: '',
  descripcion: '',
  especialidad: '',
  region: '',
  comuna: '',
  ubicacion: '',
  nombre_cliente: '',
  email_cliente: '',
  telefono_cliente: '',
  urgente: false,
  presupuesto: '',
  mostrar_email: false,
  mostrar_telefono: true,
  accepted_terms: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+?56)?\s*9?\s*[\d\s-]{8,}$/;

function PublishWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [fotos, setFotos] = useState<string[]>([]);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successToken, setSuccessToken] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(s => ({ ...s, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  // ============================================================
  // Validación por paso
  // ============================================================

  const validateStep = (s: number): boolean => {
    const e: typeof errors = {};
    if (s === 0) {
      if (form.titulo.length < 8) e.titulo = 'Mínimo 8 caracteres';
      if (form.descripcion.length < 20) e.descripcion = 'Describe mejor el trabajo (mínimo 20 caracteres)';
    }
    if (s === 1) {
      if (!form.especialidad) e.especialidad = 'Elige una categoría';
    }
    if (s === 2) {
      if (!form.region) e.region = 'Elige tu región';
      if (!form.comuna) e.comuna = 'Elige tu comuna';
      if (form.ubicacion.length < 2) e.ubicacion = 'Indica una referencia (calle, sector)';
    }
    if (s === 3) {
      if (form.nombre_cliente.length < 2) e.nombre_cliente = 'Tu nombre es obligatorio';
      if (!EMAIL_RE.test(form.email_cliente)) e.email_cliente = 'Correo inválido';
      if (!PHONE_RE.test(form.telefono_cliente)) e.telefono_cliente = 'Teléfono inválido (ej: 9 1234 5678)';
      if (!form.accepted_terms) e.accepted_terms = 'Debes aceptar los términos';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  // ============================================================
  // Upload fotos
  // ============================================================

  const onFilePick = async (files: FileList | null) => {
    if (!files?.length) return;
    if (fotos.length >= 5) {
      setSubmitError('Máximo 5 fotos');
      return;
    }
    setUploadingFoto(true);
    setSubmitError('');
    try {
      const remaining = 5 - fotos.length;
      const list = Array.from(files).slice(0, remaining);
      const uploaded: string[] = [];
      for (const file of list) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload-foto', { method: 'POST', body: fd });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'No se pudo subir la foto');
        }
        const { url } = await res.json();
        uploaded.push(url);
      }
      setFotos(f => [...f, ...uploaded]);
    } catch (e: any) {
      setSubmitError(e?.message || 'Error subiendo fotos');
    } finally {
      setUploadingFoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFoto = (idx: number) => setFotos(f => f.filter((_, i) => i !== idx));

  // ============================================================
  // Submit final
  // ============================================================

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setLoading(true);
    setSubmitError('');
    try {
      const presupuesto = PRESUPUESTOS.find(p => p.value === form.presupuesto);
      const res = await fetch('/api/publicar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: form.titulo,
          descripcion: form.descripcion,
          especialidad: form.especialidad,
          region: form.region,
          comuna: form.comuna,
          ubicacion: form.ubicacion,
          nombre_cliente: form.nombre_cliente,
          email_cliente: form.email_cliente,
          telefono_cliente: form.telefono_cliente,
          urgente: form.urgente,
          presupuesto: form.presupuesto,
          presupuesto_min: presupuesto?.min ?? null,
          presupuesto_max: presupuesto?.max ?? null,
          fotos,
          mostrar_email: form.mostrar_email,
          mostrar_telefono: form.mostrar_telefono,
          accepted_terms: form.accepted_terms,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'No se pudo crear la publicación');
      }
      const result = await res.json();
      if (result?.token_acceso) setSuccessToken(result.token_acceso);
      setSuccess(true);
    } catch (e: any) {
      setSubmitError(e?.message || 'Error al publicar');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Success state
  // ============================================================

  if (success) {
    return (
      <div className="lg:max-w-2xl lg:mx-auto px-[18px] lg:px-6 py-12">
        <div className="bg-surface rounded-[20px] border border-border p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-green-soft flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-green" />
          </div>
          <h2 className="text-[22px] font-extrabold text-ink tracking-tight mb-2">
            ¡Publicación creada!
          </h2>
          <p className="text-[13.5px] text-ink-muted leading-[1.5] mb-5">
            Te enviamos un correo con el enlace para seguir tu publicación y ver las propuestas de los maestros.
          </p>
          {successToken && (
            <a
              href={`/mi-publicacion/${successToken}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-grad-cta text-white text-[13px] font-bold hover:opacity-90"
            >
              Ver mi publicación ahora <ChevronRight size={14} />
            </a>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // Render por paso
  // ============================================================

  const comunas = form.region ? COMUNAS_POR_REGION[form.region] || [] : [];
  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="lg:max-w-5xl lg:mx-auto px-[18px] lg:px-6 py-4">
      {/* Header */}
      <div className="lg:mb-2">
        <h1 className="text-[22px] lg:text-[24px] font-extrabold text-ink tracking-tight">Publica tu pololito</h1>
        <p className="text-[12.5px] lg:text-[13px] text-ink-muted mt-1 leading-[1.4]">
          Cuéntanos qué necesitas y los maestros te contactarán.
        </p>
        <StepBar current={step} />
      </div>

      <div className="lg:flex lg:gap-7 mt-3">
        {/* Form panel */}
        <div className="flex-1 min-w-0">
          <div className="bg-surface rounded-[18px] border border-border p-5 flex flex-col gap-4">
            {/* STEP 0: DETALLES */}
            {step === 0 && (
              <>
                <Field label="Título" hint="Sé claro y directo" error={errors.titulo}>
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={(e) => set('titulo', e.target.value)}
                    placeholder="Ej: Necesito gásfiter al tiro"
                    className="w-full h-11 px-[14px] rounded-xl border border-border bg-bg text-[13.5px] text-ink outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet placeholder:text-ink-soft"
                  />
                </Field>

                <Field label="Descripción" hint={`${form.descripcion.length}/300`} error={errors.descripcion}>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => set('descripcion', e.target.value.slice(0, 300))}
                    placeholder="Describe el trabajo con detalle (qué necesitas, materiales, medidas...)"
                    rows={4}
                    className="w-full px-[14px] py-3 rounded-xl border border-border bg-bg text-[13.5px] text-ink outline-none resize-none leading-[1.4] focus:ring-2 focus:ring-violet/30 focus:border-violet placeholder:text-ink-soft"
                  />
                </Field>

                {/* Fotos */}
                <Field label="Fotos (opcional)" hint={`${fotos.length}/5`}>
                  <div className="flex flex-wrap gap-2">
                    {fotos.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border bg-bg-alt group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeFoto(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {fotos.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFoto}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-border bg-bg flex flex-col items-center justify-center gap-1 hover:border-violet hover:bg-primary-soft/30 transition-colors disabled:opacity-50"
                      >
                        {uploadingFoto
                          ? <Loader2 size={18} className="text-violet animate-spin" />
                          : <Camera size={18} className="text-violet" />}
                        <span className="text-[10px] font-semibold text-ink-muted">
                          {uploadingFoto ? 'Subiendo' : 'Añadir'}
                        </span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic"
                      multiple
                      hidden
                      onChange={(e) => onFilePick(e.target.files)}
                    />
                  </div>
                  <p className="text-[10.5px] text-ink-muted mt-2 flex items-center gap-1">
                    <ImageIcon size={11} /> Una foto del problema ayuda a recibir propuestas más precisas
                  </p>
                </Field>
              </>
            )}

            {/* STEP 1: CATEGORÍA */}
            {step === 1 && (
              <Field label="Categoría del trabajo" error={errors.especialidad}>
                <div className="flex flex-wrap gap-[6px]">
                  {OFICIOS.map((esp) => (
                    <button
                      key={esp}
                      onClick={() => set('especialidad', esp === form.especialidad ? '' : esp)}
                      className={`px-[14px] py-[8px] rounded-full text-[12.5px] font-semibold transition-colors ${
                        form.especialidad === esp
                          ? 'bg-violet text-white'
                          : 'bg-bg border border-border text-ink-soft hover:border-border-strong'
                      }`}
                    >
                      {esp}
                    </button>
                  ))}
                </div>
              </Field>
            )}

            {/* STEP 2: UBICACIÓN */}
            {step === 2 && (
              <>
                <Field label="Región" error={errors.region}>
                  <select
                    value={form.region}
                    onChange={(e) => { set('region', e.target.value); set('comuna', ''); }}
                    className="w-full h-11 px-[14px] rounded-xl border border-border bg-bg text-[13.5px] text-ink outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet"
                  >
                    <option value="">Elige tu región</option>
                    {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>

                <Field label="Comuna" error={errors.comuna}>
                  <select
                    value={form.comuna}
                    onChange={(e) => set('comuna', e.target.value)}
                    disabled={!form.region}
                    className="w-full h-11 px-[14px] rounded-xl border border-border bg-bg text-[13.5px] text-ink outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{form.region ? 'Elige tu comuna' : 'Primero elige región'}</option>
                    {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Referencia / Calle" hint="Sector, calle o referencia (no enviamos dirección a maestros que no contactes)" error={errors.ubicacion}>
                  <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-bg focus-within:ring-2 focus-within:ring-violet/30 focus-within:border-violet">
                    <MapPin size={14} className="text-violet shrink-0" />
                    <input
                      type="text"
                      value={form.ubicacion}
                      onChange={(e) => set('ubicacion', e.target.value)}
                      placeholder="Ej: Av. Argentina, sector centro"
                      className="flex-1 h-full border-none bg-transparent outline-none text-[13.5px] text-ink placeholder:text-ink-soft"
                    />
                  </div>
                </Field>

                <Field label="Presupuesto estimado">
                  <div className="flex flex-wrap gap-[6px]">
                    {PRESUPUESTOS.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => set('presupuesto', p.value === form.presupuesto ? '' : p.value)}
                        className={`px-[14px] py-[7px] rounded-full text-[12.5px] font-semibold transition-colors ${
                          form.presupuesto === p.value
                            ? 'bg-violet text-white'
                            : 'bg-bg border border-border text-ink-soft hover:border-border-strong'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Urgente toggle */}
                <button
                  type="button"
                  onClick={() => set('urgente', !form.urgente)}
                  className={`flex items-center gap-3 p-[14px] rounded-[14px] border transition-colors ${
                    form.urgente ? 'bg-red-soft border-red/30' : 'bg-bg border-border'
                  }`}
                >
                  <div className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center shrink-0 ${
                    form.urgente ? 'bg-red' : 'bg-bg-alt'
                  }`}>
                    <Zap size={18} className={form.urgente ? 'text-white fill-white' : 'text-ink-muted'} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[13.5px] font-bold text-ink">¿Es urgente?</p>
                    <p className="text-[11.5px] text-ink-soft">Te llegan más maestros, al tiro</p>
                  </div>
                  <div className={`w-11 h-[26px] rounded-full transition-colors relative shrink-0 ${form.urgente ? 'bg-red' : 'bg-bg-alt'}`}>
                    <div className={`absolute top-[3px] w-5 h-5 rounded-full bg-white shadow transition-all ${form.urgente ? 'left-[21px]' : 'left-[3px]'}`} />
                  </div>
                </button>
              </>
            )}

            {/* STEP 3: CONTACTO */}
            {step === 3 && (
              <>
                <Field label="Tu nombre" hint="Como te llaman los maestros" error={errors.nombre_cliente}>
                  <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-bg focus-within:ring-2 focus-within:ring-violet/30 focus-within:border-violet">
                    <User size={14} className="text-violet shrink-0" />
                    <input
                      type="text"
                      value={form.nombre_cliente}
                      onChange={(e) => set('nombre_cliente', e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="flex-1 h-full border-none bg-transparent outline-none text-[13.5px] text-ink placeholder:text-ink-soft"
                      maxLength={60}
                    />
                  </div>
                </Field>

                <Field label="Tu correo" hint="Para enviarte propuestas" error={errors.email_cliente}>
                  <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-bg focus-within:ring-2 focus-within:ring-violet/30 focus-within:border-violet">
                    <Mail size={14} className="text-violet shrink-0" />
                    <input
                      type="email"
                      value={form.email_cliente}
                      onChange={(e) => set('email_cliente', e.target.value)}
                      placeholder="tu@correo.cl"
                      className="flex-1 h-full border-none bg-transparent outline-none text-[13.5px] text-ink placeholder:text-ink-soft"
                    />
                  </div>
                </Field>

                <Field label="WhatsApp / Teléfono" hint="Para que el maestro te contacte" error={errors.telefono_cliente}>
                  <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-bg focus-within:ring-2 focus-within:ring-violet/30 focus-within:border-violet">
                    <Phone size={14} className="text-violet shrink-0" />
                    <span className="text-[13px] text-ink-muted font-medium">+56</span>
                    <input
                      type="tel"
                      value={form.telefono_cliente}
                      onChange={(e) => set('telefono_cliente', e.target.value)}
                      placeholder="9 1234 5678"
                      className="flex-1 h-full border-none bg-transparent outline-none text-[13.5px] text-ink placeholder:text-ink-soft"
                    />
                  </div>
                </Field>

                {/* Visibilidad de contacto */}
                <div className="bg-bg-alt rounded-xl p-3 space-y-2">
                  <p className="text-[11.5px] font-bold text-ink uppercase tracking-wide mb-1">¿Qué pueden ver los maestros?</p>
                  <p className="text-[10.5px] text-ink-muted leading-[1.4] mb-2">
                    Si lo activas, los maestros que vean tu publicación podrán contactarte directamente.
                  </p>
                  <label className="flex items-center justify-between gap-3 p-2 rounded-lg cursor-pointer hover:bg-bg">
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-violet" />
                      <span className="text-[12.5px] font-semibold text-ink">Mostrar mi teléfono</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => set('mostrar_telefono', !form.mostrar_telefono)}
                      className={`w-10 h-[22px] rounded-full transition-colors relative shrink-0 ${form.mostrar_telefono ? 'bg-violet' : 'bg-border'}`}
                    >
                      <div className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${form.mostrar_telefono ? 'left-[20px]' : 'left-[2px]'}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between gap-3 p-2 rounded-lg cursor-pointer hover:bg-bg">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-violet" />
                      <span className="text-[12.5px] font-semibold text-ink">Mostrar mi correo</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => set('mostrar_email', !form.mostrar_email)}
                      className={`w-10 h-[22px] rounded-full transition-colors relative shrink-0 ${form.mostrar_email ? 'bg-violet' : 'bg-border'}`}
                    >
                      <div className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${form.mostrar_email ? 'left-[20px]' : 'left-[2px]'}`} />
                    </button>
                  </label>
                  <p className="text-[10px] text-ink-muted leading-[1.4] pt-1">
                    Si los desactivas, los maestros tendrán que enviarte una propuesta y tú decides si los contactas.
                  </p>
                </div>

                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  form.accepted_terms ? 'bg-primary-soft border-violet/30' : 'bg-bg border-border'
                }`}>
                  <input
                    type="checkbox"
                    checked={form.accepted_terms}
                    onChange={(e) => set('accepted_terms', e.target.checked)}
                    className="mt-[2px] w-4 h-4 accent-violet shrink-0"
                  />
                  <span className="text-[12px] text-ink-soft leading-[1.45]">
                    Acepto los{' '}
                    <a href="/legal/terminos" target="_blank" className="text-violet font-semibold underline underline-offset-2">términos</a>
                    {' '}y la{' '}
                    <a href="/legal/privacidad" target="_blank" className="text-violet font-semibold underline underline-offset-2">política de privacidad</a>.
                    Mi correo y teléfono se compartirán solo con maestros que respondan mi publicación.
                  </span>
                </label>
                {errors.accepted_terms && <p className="text-[11px] text-red font-medium -mt-1">{errors.accepted_terms}</p>}
              </>
            )}

            {/* Submit error */}
            {submitError && (
              <div className="p-3 bg-red-soft rounded-xl text-[12px] text-red font-medium">
                {submitError}
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center gap-2 mt-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={prev}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-bg-alt text-ink-soft text-[13px] font-bold hover:bg-bg-alt/70"
                >
                  <ChevronLeft size={14} /> Atrás
                </button>
              )}
              <div className="flex-1" />
              {!isLastStep ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-grad-cta text-white text-[13px] font-bold hover:opacity-90 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)]"
                >
                  Siguiente <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-grad-cta text-white text-[13px] font-bold hover:opacity-90 disabled:opacity-50 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)]"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {loading ? 'Publicando...' : 'Publicar solicitud'}
                </button>
              )}
            </div>
          </div>
          <p className="text-center text-[11px] text-ink-muted mt-3 leading-[1.4]">
            Es gratis, sin compromiso. Los maestros te contactan por WhatsApp o correo.
          </p>
        </div>

        {/* Sidebar (desktop) */}
        <div className="hidden lg:block w-[380px] shrink-0">
          <div className="sticky top-[80px] space-y-4">
            <LivePreview form={form} fotos={fotos} />

            <div className="bg-surface rounded-[18px] border border-border p-5">
              <h4 className="text-[12px] font-bold uppercase tracking-[0.4px] text-ink-muted mb-3">Tips</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-[8px] bg-primary-soft flex items-center justify-center shrink-0">
                    <FileText size={13} className="text-violet" />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-ink">Sé específico</p>
                    <p className="text-[11px] text-ink-muted leading-[1.4]">Describe materiales y medidas si puedes</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-[8px] bg-green-soft flex items-center justify-center shrink-0">
                    <Camera size={13} className="text-green" />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-ink">Sube una foto</p>
                    <p className="text-[11px] text-ink-muted leading-[1.4]">Vale más que mil palabras</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-[8px] bg-red-soft flex items-center justify-center shrink-0">
                    <Zap size={13} className="text-red" />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-ink">¿Es urgente?</p>
                    <p className="text-[11px] text-ink-muted leading-[1.4]">Marca urgente para notificar al instante</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Feed (maestro)
// ============================================================

function Feed() {
  const { data: publicaciones, isLoading } = usePublicaciones();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-[18px] lg:px-6 py-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-[18px] border border-border p-[14px] animate-pulse">
            <div className="flex gap-[10px] items-center mb-3">
              <div className="w-[38px] h-[38px] rounded-full bg-bg-alt" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-bg-alt rounded w-28" />
                <div className="h-2.5 bg-bg-alt rounded w-40" />
              </div>
            </div>
            <div className="h-4 bg-bg-alt rounded w-48 mb-2" />
            <div className="h-3 bg-bg-alt rounded w-64" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="lg:max-w-5xl lg:mx-auto px-[18px] lg:px-6 py-4">
      <div className="sticky top-0 z-10 bg-bg pb-2">
        <h1 className="text-[22px] font-extrabold text-ink tracking-tight">Feed de pegas</h1>
        <p className="text-[12.5px] text-ink-muted mt-1 leading-[1.4]">
          Solicitudes cerca tuyo. Postúlate al tiro.
        </p>
      </div>

      {!publicaciones?.length ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-bg-alt flex items-center justify-center mx-auto mb-4">
            <Send size={24} className="text-ink-muted" />
          </div>
          <p className="font-extrabold text-ink">No hay trabajos disponibles</p>
          <p className="text-[13px] text-ink-muted mt-1">Vuelve pronto, se publican nuevos constantemente</p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col lg:grid lg:grid-cols-2 gap-3">
          {publicaciones.map((p: any) => {
            const nombre = p.nombre_cliente || p.autor?.nombre || 'Cliente';
            return (
              <a
                key={p.id}
                href={`/app/publicaciones/${p.id}`}
                className="bg-surface rounded-[18px] border border-border p-[14px] hover:border-border-strong transition-colors"
              >
                <div className="flex gap-[10px] items-center mb-[10px]">
                  <div className="w-[38px] h-[38px] rounded-full bg-bg-alt flex items-center justify-center text-ink-muted text-sm font-bold shrink-0">
                    {nombre.charAt(0).toUpperCase() || <User size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-ink tracking-tight">{nombre}</p>
                    <div className="text-[11px] text-ink-muted flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(p.created_at).toLocaleDateString('es-CL')}
                      {(p.comuna || p.ubicacion) && (
                        <>
                          <span className="opacity-50 mx-0.5">·</span>
                          <MapPin size={10} />
                          {p.comuna || p.ubicacion}
                        </>
                      )}
                    </div>
                  </div>
                  {p.urgente && (
                    <div className="inline-flex items-center gap-1 bg-red-soft text-red px-2 py-[3px] rounded-full text-[10px] font-extrabold tracking-wide">
                      <Zap size={10} className="fill-red" />
                      URGENTE
                    </div>
                  )}
                </div>

                <h4 className="text-[15px] font-extrabold text-ink tracking-tight leading-[1.25]">{p.titulo}</h4>
                <p className="mt-[6px] text-[12.5px] text-ink-soft leading-[1.45] line-clamp-2">{p.descripcion}</p>

                <div className="flex items-center justify-between mt-[10px] pt-[10px] border-t border-border">
                  <span className="px-[10px] py-[5px] rounded-full text-[11px] font-semibold bg-surface border border-border text-ink-soft">
                    {p.especialidad}
                  </span>
                  <span className="inline-flex items-center gap-[8px] px-3 py-2 rounded-[10px] bg-grad-cta text-white text-[12px] font-bold shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)]">
                    <Send size={12} /> Postular
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PublicarPage() {
  const { viewMode } = useAuthStore();
  return viewMode === 'maestro' ? <Feed /> : <PublishWizard />;
}
