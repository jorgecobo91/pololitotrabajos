'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Wrench, CheckCircle, Shield, Eye, EyeOff } from 'lucide-react';

type Modo = 'login' | 'registro' | 'verificar' | 'recuperar' | 'recuperar-enviado';

function InputField({ icon: Icon, label, hint, error, children }: {
  icon: any; label: string; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-[7px]">
        <label className="block text-[11.5px] font-bold text-ink uppercase tracking-[0.4px]">{label}</label>
        {hint && <span className="text-[10.5px] text-ink-muted">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[11px] text-red font-medium mt-1">{error}</p>}
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder, minLength }: {
  value: string; onChange: (v: string) => void; placeholder: string; minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-ink-muted" />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        minLength={minLength}
        required
        className="w-full h-11 pl-10 pr-10 rounded-[12px] border border-border bg-surface text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet placeholder:text-ink-soft"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-[12px] top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export default function MaestroLoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchModo = (m: Modo) => { setModo(m); setError(null); };

  // ====== LOGIN ======
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        if (err.message === 'Invalid login credentials') throw new Error('Email o contraseña incorrectos');
        if (err.message === 'Email not confirmed') throw new Error('Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.');
        throw err;
      }
      window.location.href = '/app';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ====== REGISTRO ======
  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }
    if (!acceptedTerms) {
      setError('Debes aceptar los Términos y Condiciones');
      setLoading(false);
      return;
    }

    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app/perfil/completar`,
        },
      });
      if (err) throw err;

      // Crear registros en DB
      if (data.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          email: data.user.email,
          nombre: email.split('@')[0],
          roles: ['maestro'],
        });
        await supabase.from('maestro_profiles').upsert({
          user_id: data.user.id,
          oficio: 'Maestro general',
          especialidades: [],
          disponible: true,
        });
      }

      switchModo('verificar');
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        setError('Este correo ya está registrado. Intenta iniciar sesión.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ====== RECUPERAR CONTRASEÑA ======
  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/maestro/login`,
      });
      if (err) throw err;
      switchModo('recuperar-enviado');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ====== PANTALLA DE VERIFICACIÓN ======
  if (modo === 'verificar') {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-[18px] py-6">
        <div className="w-full max-w-[420px] text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-soft flex items-center justify-center mx-auto mb-5">
            <Mail size={28} className="text-green" />
          </div>
          <h1 className="text-[22px] font-extrabold text-ink tracking-[-0.5px]">Revisa tu correo</h1>
          <p className="text-[13px] text-ink-muted mt-2 leading-[1.5] max-w-[320px] mx-auto">
            Enviamos un enlace de verificación a <strong className="text-ink">{email}</strong>. Haz clic en el enlace para activar tu cuenta.
          </p>

          <div className="bg-surface rounded-[18px] border border-border p-5 mt-6 text-left">
            <div className="space-y-3">
              {[
                { step: '1', text: 'Abre tu bandeja de entrada' },
                { step: '2', text: 'Busca el correo de pololitotrabajos' },
                { step: '3', text: 'Haz clic en "Verificar cuenta"' },
                { step: '4', text: 'Vuelve aquí e inicia sesión' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-extrabold text-violet">{s.step}</span>
                  </div>
                  <p className="text-[13px] text-ink font-medium">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => switchModo('login')}
              className="w-full py-[14px] rounded-[14px] bg-grad-cta text-white font-bold text-[15px] hover:opacity-90 transition-opacity shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)]"
            >
              Ya verifiqué, iniciar sesión
            </button>
            <p className="text-[11.5px] text-ink-muted">
              ¿No llegó el correo? Revisa tu carpeta de spam o{' '}
              <button onClick={() => switchModo('registro')} className="text-violet font-semibold hover:underline">
                intenta de nuevo
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ====== PANTALLA RECUPERAR ENVIADO ======
  if (modo === 'recuperar-enviado') {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-[18px] py-6">
        <div className="w-full max-w-[420px] text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-violet" />
          </div>
          <h1 className="text-[22px] font-extrabold text-ink tracking-[-0.5px]">Enlace enviado</h1>
          <p className="text-[13px] text-ink-muted mt-2 leading-[1.5] max-w-[320px] mx-auto">
            Si <strong className="text-ink">{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => switchModo('login')}
              className="w-full py-[14px] rounded-[14px] bg-grad-cta text-white font-bold text-[15px] hover:opacity-90 transition-opacity shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)]"
            >
              Volver a iniciar sesión
            </button>
            <p className="text-[11.5px] text-ink-muted">
              Revisa tu bandeja de entrada y carpeta de spam
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ====== FORMULARIOS LOGIN / REGISTRO / RECUPERAR ======
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-[18px] py-6">
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="font-extrabold text-xl tracking-tight">
              <span className="text-gradient">pololito</span>
              <span className="text-ink font-medium">trabajos</span>
            </span>
          </Link>

          <div className="w-14 h-14 rounded-2xl bg-primary-soft flex items-center justify-center mx-auto mb-4">
            <Wrench size={24} className="text-violet" />
          </div>

          <h1 className="text-[22px] font-extrabold text-ink tracking-[-0.5px]">
            {modo === 'recuperar' ? 'Recuperar contraseña' : 'Portal Maestros'}
          </h1>
          <p className="text-ink-muted mt-2 text-[12.5px] leading-[1.4]">
            {modo === 'recuperar'
              ? 'Ingresa tu correo y te enviaremos un enlace seguro'
              : 'Ofrece tus servicios y encuentra clientes cerca de ti'}
          </p>
        </div>

        <div className="bg-surface rounded-[18px] border border-border p-[18px]">
          {/* Tabs (solo login/registro) */}
          {modo !== 'recuperar' && (
            <div className="flex gap-1 bg-bg-alt rounded-xl p-1 mb-5">
              <button
                onClick={() => switchModo('login')}
                className={`flex-1 py-[10px] text-[13px] font-bold rounded-[10px] transition-all ${
                  modo === 'login' ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => switchModo('registro')}
                className={`flex-1 py-[10px] text-[13px] font-bold rounded-[10px] transition-all ${
                  modo === 'registro' ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted'
                }`}
              >
                Registrarse
              </button>
            </div>
          )}

          {/* ====== LOGIN FORM ====== */}
          {modo === 'login' && (
            <form onSubmit={handleLogin} className="space-y-[14px]">
              <InputField icon={Mail} label="Correo electrónico">
                <div className="relative">
                  <Mail size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.cl"
                    required
                    className="w-full h-11 pl-10 pr-[14px] rounded-[12px] border border-border bg-surface text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet placeholder:text-ink-soft"
                  />
                </div>
              </InputField>

              <InputField icon={Lock} label="Contraseña">
                <PasswordInput value={password} onChange={setPassword} placeholder="••••••••" />
              </InputField>

              {error && (
                <div className="p-3 bg-red-soft rounded-xl text-[12px] text-red font-medium">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-[15px] rounded-[14px] bg-grad-cta text-white font-bold text-[15px] hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)]"
              >
                {loading ? 'Entrando...' : 'Iniciar sesión'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => switchModo('recuperar')}
                  className="text-[12.5px] font-semibold text-violet hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          )}

          {/* ====== REGISTRO FORM ====== */}
          {modo === 'registro' && (
            <form onSubmit={handleRegistro} className="space-y-[14px]">
              <InputField icon={Mail} label="Correo electrónico">
                <div className="relative">
                  <Mail size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.cl"
                    required
                    className="w-full h-11 pl-10 pr-[14px] rounded-[12px] border border-border bg-surface text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet placeholder:text-ink-soft"
                  />
                </div>
              </InputField>

              <InputField icon={Lock} label="Contraseña" hint="Mínimo 6 caracteres">
                <PasswordInput value={password} onChange={setPassword} placeholder="••••••••" minLength={6} />
                {password.length > 0 && password.length < 6 && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${
                        password.length >= i * 2 ? (password.length >= 6 ? 'bg-green' : 'bg-orange') : 'bg-bg-alt'
                      }`} />
                    ))}
                  </div>
                )}
              </InputField>

              <InputField icon={Lock} label="Confirmar contraseña" error={
                confirmPassword && password !== confirmPassword ? 'Las contraseñas no coinciden' : undefined
              }>
                <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Repite tu contraseña" />
              </InputField>

              {/* Terms checkbox */}
              <button
                type="button"
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className={`w-full flex items-start gap-3 p-3 rounded-[12px] border transition-colors text-left ${
                  acceptedTerms ? 'border-violet bg-primary-soft/30' : 'border-border bg-bg-alt'
                }`}
              >
                <div className={`w-[20px] h-[20px] rounded-md border-2 flex items-center justify-center shrink-0 mt-[1px] ${
                  acceptedTerms ? 'bg-violet border-violet' : 'border-border-strong'
                }`}>
                  {acceptedTerms && <CheckCircle size={13} className="text-white" />}
                </div>
                <p className="text-[12.5px] text-ink leading-[1.4]">
                  Acepto los{' '}
                  <Link href="/legal/terminos" className="text-violet font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>
                    Términos y Condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link href="/legal/privacidad" className="text-violet font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>
                    Política de Privacidad
                  </Link>
                </p>
              </button>

              {error && (
                <div className="p-3 bg-red-soft rounded-xl text-[12px] text-red font-medium">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading || !email || !password || !confirmPassword || !acceptedTerms}
                className="w-full py-[15px] rounded-[14px] bg-grad-cta text-white font-bold text-[15px] hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)]"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
          )}

          {/* ====== RECUPERAR FORM ====== */}
          {modo === 'recuperar' && (
            <form onSubmit={handleRecuperar} className="space-y-[14px]">
              <InputField icon={Mail} label="Correo electrónico">
                <div className="relative">
                  <Mail size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.cl"
                    required
                    className="w-full h-11 pl-10 pr-[14px] rounded-[12px] border border-border bg-surface text-[13.5px] text-ink focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet placeholder:text-ink-soft"
                  />
                </div>
              </InputField>

              {error && (
                <div className="p-3 bg-red-soft rounded-xl text-[12px] text-red font-medium">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-[15px] rounded-[14px] bg-grad-cta text-white font-bold text-[15px] hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)]"
              >
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => switchModo('login')}
                  className="text-[12.5px] font-semibold text-violet hover:underline"
                >
                  Volver a iniciar sesión
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] text-ink-muted hover:text-ink font-medium"
          >
            <ArrowLeft size={14} /> Volver al inicio
          </Link>
        </div>

        <p className="text-center text-[11px] text-ink-soft mt-6">
          Al continuar aceptas nuestros{' '}
          <Link href="/legal/terminos" className="underline hover:text-ink">Términos</Link> y{' '}
          <Link href="/legal/privacidad" className="underline hover:text-ink">Privacidad</Link>
        </p>
      </div>
    </div>
  );
}
