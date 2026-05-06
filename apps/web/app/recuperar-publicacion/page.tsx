'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function RecuperarPublicacionPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!isValidEmail || loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'recuperar_publicacion', email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al enviar');
        return;
      }

      setSent(true);
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-4">
      <div className="max-w-[420px] w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/">
            <span className="font-extrabold text-[18px] tracking-[-0.4px]">
              <span style={{ background: 'linear-gradient(135deg, #FF6B35, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                pololito
              </span>
              <span className="text-[#3D3229] font-medium opacity-65">trabajos</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-[18px] border border-[#E8E0D8] overflow-hidden">
          {sent ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-[#10B981]" />
              </div>
              <p className="text-[16px] font-extrabold text-[#3D3229]">Revisa tu correo</p>
              <p className="text-[13px] text-[#6B5E52] mt-2 leading-[1.5]">
                Si tienes publicaciones con ese correo, te enviamos los enlaces de acceso a <strong>{email}</strong>.
              </p>
              <p className="text-[12px] text-[#A89C91] mt-4">
                Revisa también la carpeta de spam
              </p>
            </div>
          ) : (
            <>
              <div
                className="p-6 text-center"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }}
              >
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <Mail size={24} className="text-white" />
                </div>
                <h1 className="text-white font-extrabold text-[18px] tracking-[-0.3px]">
                  Recuperar mi publicación
                </h1>
                <p className="text-white/80 text-[13px] mt-1">
                  Ingresa el correo con el que publicaste
                </p>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="text-[11.5px] font-bold text-[#3D3229] uppercase tracking-wide block mb-[7px]">
                    Tu correo electrónico
                  </label>
                  <div className="flex items-center gap-2 h-12 px-4 rounded-xl border border-[#E8E0D8] bg-white focus-within:ring-2 focus-within:ring-[#7C3AED]/30 focus-within:border-[#7C3AED]">
                    <Mail size={16} className="text-[#A89C91] shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.cl"
                      className="flex-1 h-full border-none bg-transparent outline-none text-[14px] text-[#3D3229] placeholder:text-[#A89C91]"
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-[#FFF0E8] rounded-[12px] flex items-center gap-2">
                    <AlertCircle size={14} className="text-[#FF6B35] shrink-0" />
                    <p className="text-[12.5px] text-[#FF6B35] font-medium">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!isValidEmail || loading}
                  className="w-full py-[14px] rounded-[14px] text-white font-bold text-[14px] hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }}
                >
                  <Send size={14} /> {loading ? 'Enviando...' : 'Enviar enlace de acceso'}
                </button>

                <p className="text-center text-[11.5px] text-[#A89C91] mt-4 leading-[1.4]">
                  Te enviaremos un correo con el enlace directo a tus publicaciones activas.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-5">
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#7C3AED] hover:underline"
          >
            <ArrowLeft size={13} /> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
