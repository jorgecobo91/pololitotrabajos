'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';

interface TokenData {
  id: string;
  maestro_id: string;
  respuesta_id: string | null;
  maestro_nombre: string;
  maestro_oficio: string | null;
  publicacion_titulo: string | null;
}

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(i)}
            className="p-0.5"
          >
            <Star
              size={22}
              className={`transition-colors ${
                i <= (hover || value) ? 'fill-amber text-amber' : 'text-border hover:text-amber/50'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CalificarPage() {
  const params = useParams();
  const token = params.token as string;

  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [noConcretado, setNoConcretado] = useState(false);

  const [calidad, setCalidad] = useState(0);
  const [puntualidad, setPuntualidad] = useState(0);
  const [comunicacion, setComunicacion] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    async function loadToken() {
      try {
        const res = await fetch(`/api/rating-token/${encodeURIComponent(token)}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setError(err.error || 'Token no válido');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setTokenData(data);
        setLoading(false);
      } catch {
        setError('Error de conexión');
        setLoading(false);
      }
    }
    loadToken();
  }, [token]);

  const canSubmit = noConcretado || (calidad > 0 && puntualidad > 0 && comunicacion > 0 && precio > 0);

  const handleSubmit = async () => {
    if (!canSubmit || !tokenData || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/rating-token/${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noConcretado
          ? { no_concretado: true }
          : { calidad, puntualidad, comunicacion, precio, comentario: comentario || null }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'No se pudo enviar');
      }
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.message || 'Error al enviar. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#E8E0D8] border-t-[#7C3AED] rounded-full animate-spin" />
          <span className="text-sm text-[#6B5E52] font-medium">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error && !submitted) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-6">
        <div className="max-w-sm w-full bg-white rounded-[18px] border border-[#E8E0D8] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FFF0E8] flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-[#FF6B35]" />
          </div>
          <p className="text-[16px] font-extrabold text-[#3D3229]">{error}</p>
          <p className="text-[13px] text-[#6B5E52] mt-2">
            Si crees que es un error, contacta a soporte.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-6">
        <div className="max-w-sm w-full bg-white rounded-[18px] border border-[#E8E0D8] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-[#10B981]" />
          </div>
          <p className="text-[16px] font-extrabold text-[#3D3229]">
            {noConcretado ? 'Gracias por informarnos' : '¡Gracias por calificar!'}
          </p>
          <p className="text-[13px] text-[#6B5E52] mt-2">
            {noConcretado
              ? 'Lamentamos que no se haya concretado el trabajo.'
              : 'Tu opinión ayuda a otros clientes a encontrar buenos maestros.'}
          </p>
        </div>
      </div>
    );
  }

  const maestroNombre = tokenData?.maestro_nombre || 'Maestro';
  const maestroOficio = tokenData?.maestro_oficio || '';
  const pubTitulo = tokenData?.publicacion_titulo || 'tu solicitud';

  return (
    <div className="min-h-screen bg-[#F5F0EB] py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <p className="font-extrabold text-[18px] tracking-[-0.4px]">
            <span style={{ background: 'linear-gradient(135deg, #FF6B35, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>pololito</span>
            <span className="text-[#3D3229] font-medium opacity-65">trabajos</span>
          </p>
        </div>

        <div className="bg-white rounded-[18px] border border-[#E8E0D8] overflow-hidden">
          <div style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }} className="p-5 text-center">
            <div className="w-[60px] h-[60px] rounded-full bg-white/20 flex items-center justify-center mx-auto text-white font-bold text-xl">
              {maestroNombre.charAt(0)}
            </div>
            <p className="text-white font-extrabold text-[16px] mt-3">{maestroNombre}</p>
            {maestroOficio && <p className="text-white/80 text-[12px] font-semibold uppercase tracking-wide">{maestroOficio}</p>}
            <p className="text-white/70 text-[12px] mt-1">Trabajo: &quot;{pubTitulo}&quot;</p>
          </div>

          <div className="p-5">
            <h2 className="text-[16px] font-extrabold text-[#3D3229] text-center mb-5">
              ¿Cómo fue tu experiencia?
            </h2>

            <button
              onClick={() => setNoConcretado(!noConcretado)}
              className={`w-full flex items-center gap-3 p-3 rounded-[14px] border mb-5 transition-colors ${
                noConcretado ? 'bg-[#FFF0E8] border-[#FF6B35]/30' : 'bg-[#FAF7F4] border-[#E8E0D8]'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                noConcretado ? 'bg-[#FF6B35] border-[#FF6B35]' : 'border-[#C4B8AC]'
              }`}>
                {noConcretado && <CheckCircle size={12} className="text-white" />}
              </div>
              <span className="text-[13px] font-semibold text-[#3D3229]">No se concretó el trabajo</span>
            </button>

            {!noConcretado && (
              <div className="space-y-4">
                <StarRating value={calidad} onChange={setCalidad} label="Calidad del trabajo" />
                <StarRating value={puntualidad} onChange={setPuntualidad} label="Puntualidad" />
                <StarRating value={comunicacion} onChange={setComunicacion} label="Comunicación" />
                <StarRating value={precio} onChange={setPrecio} label="Precio justo" />

                <div className="pt-2">
                  <div className="flex justify-between items-baseline mb-[7px]">
                    <label className="text-[11.5px] font-bold text-[#3D3229] uppercase tracking-wide">
                      Comentario (opcional)
                    </label>
                    <span className="text-[11px] text-[#6B5E52]">{comentario.length}/300</span>
                  </div>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value.slice(0, 300))}
                    placeholder="Cuéntanos cómo fue tu experiencia..."
                    rows={3}
                    className="w-full px-[14px] py-3 rounded-xl border border-[#E8E0D8] bg-white text-[13.5px] text-[#3D3229] outline-none resize-none leading-[1.4] focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] placeholder:text-[#A89C91]"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-[#FEF2F2] rounded-xl text-[12.5px] text-[#EF4444] font-semibold">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="w-full mt-5 py-[14px] rounded-[14px] text-white font-bold text-[14px] hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }}
            >
              {submitting ? 'Enviando...' : noConcretado ? 'Enviar respuesta' : 'Enviar calificación'}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#A89C91] mt-4">
          pololitotrabajos · Tu opinión es confidencial
        </p>
      </div>
    </div>
  );
}
