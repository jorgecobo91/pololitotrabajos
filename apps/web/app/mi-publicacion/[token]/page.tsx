'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  AlertCircle, Clock, MapPin, Zap, Star, Send,
  MessageSquare, ChevronRight, Shield, CheckCircle, X, MessageCircle, Phone,
} from 'lucide-react';
import Link from 'next/link';

function MaestroCard({ respuesta }: { respuesta: any }) {
  const m = respuesta.maestro;
  if (!m) return null;

  const rating = m.rating_promedio || 0;
  const exp = m.experiencia_anios || 0;
  const presupuesto = respuesta.presupuesto;
  const waNumber = m.telefono_publico && m.telefono ? String(m.telefono).replace(/\D/g, '') : null;

  return (
    <div className="bg-white rounded-[16px] border border-[#E8E0D8] p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <div
          className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }}
        >
          {m.foto_url
            ? <img src={m.foto_url} alt="" className="w-full h-full object-cover" />
            : (m.nombre?.charAt(0) || '?')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-extrabold text-[#3D3229] tracking-tight">{m.nombre}</p>
          {m.oficio && (
            <p className="text-[11.5px] font-semibold text-[#7C3AED] uppercase tracking-wide">{m.oficio}</p>
          )}
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {rating > 0 && (
              <span className="flex items-center gap-1 text-[12px] text-[#6B5E52]">
                <Star size={12} className="fill-[#F59E0B] text-[#F59E0B]" />
                {rating.toFixed(1)}
              </span>
            )}
            {exp > 0 && (
              <span className="text-[12px] text-[#6B5E52]">
                {exp} {exp === 1 ? 'año' : 'años'} exp.
              </span>
            )}
            {m.comuna && (
              <span className="flex items-center gap-1 text-[12px] text-[#6B5E52]">
                <MapPin size={10} /> {m.comuna}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#E8E0D8]">
        <div>
          <p className="text-[10.5px] font-bold text-[#6B5E52] uppercase tracking-wide">Presupuesto</p>
          <p className="text-[18px] font-extrabold text-[#3D3229] mt-0.5">
            {presupuesto ? `$${presupuesto.toLocaleString('es-CL')}` : 'A convenir'}
          </p>
        </div>
        <div>
          <p className="text-[10.5px] font-bold text-[#6B5E52] uppercase tracking-wide">Tiempo</p>
          <p className="text-[18px] font-extrabold text-[#3D3229] mt-0.5">{respuesta.tiempo_entrega}</p>
        </div>
      </div>

      {respuesta.mensaje && (
        <div className="mt-3 pt-3 border-t border-[#E8E0D8]">
          <div className="flex items-start gap-2">
            <MessageSquare size={13} className="text-[#7C3AED] mt-0.5 shrink-0" />
            <p className="text-[12.5px] text-[#6B5E52] leading-[1.45] italic">
              &ldquo;{respuesta.mensaje}&rdquo;
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Link
          href={`/app/maestro/${respuesta.maestro_id}`}
          className="flex-1 py-[11px] rounded-[12px] text-center text-[13px] font-bold border border-[#E8E0D8] text-[#3D3229] hover:bg-[#FAF7F4] transition-colors"
        >
          Ver perfil
        </Link>
        {waNumber ? (
          <a
            href={`https://wa.me/56${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-[11px] rounded-[12px] text-center text-[13px] font-bold text-white flex items-center justify-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }}
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
        ) : (
          <span className="flex-1 py-[11px] rounded-[12px] text-center text-[13px] font-bold bg-[#FAF7F4] text-[#A89C91]">
            Sin contacto público
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Modal: Marcar trabajo completado
// ============================================================

function StarPicker({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] font-semibold text-[#3D3229]">{label}</span>
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
              size={20}
              className={`transition-colors ${
                i <= (hover || value) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E8E0D8] hover:text-[#F59E0B]/50'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function CompletarModal({
  token, respuestas, onClose, onSuccess,
}: { token: string; respuestas: any[]; onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<'select' | 'closing' | 'rating' | 'sending_rating' | 'done'>('select');
  const [selected, setSelected] = useState<string | null>(null); // 'none' or respuesta_id
  const [errorMsg, setErrorMsg] = useState('');
  const [ratingToken, setRatingToken] = useState<string | null>(null);

  // Rating state
  const [calidad, setCalidad] = useState(0);
  const [puntualidad, setPuntualidad] = useState(0);
  const [comunicacion, setComunicacion] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [comentario, setComentario] = useState('');

  const selectedMaestro = (() => {
    if (!selected || selected === 'none') return null;
    const r = respuestas.find((x) => x.id === selected);
    return r?.maestro || null;
  })();

  const canSubmitRating = calidad > 0 && puntualidad > 0 && comunicacion > 0 && precio > 0;

  const handleCerrar = async () => {
    if (!selected) return;
    setStep('closing');
    setErrorMsg('');
    try {
      const isNone = selected === 'none';
      const r = isNone ? null : respuestas.find((x) => x.id === selected);

      const res = await fetch('/api/cerrar-publicacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          maestro_ganador_id: r?.maestro_id || null,
          respuesta_id: r?.id || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'No se pudo cerrar');
      }

      const data = await res.json();

      if (isNone || !data.rating_token) {
        // Sin maestro o sin token: directo a done
        setStep('done');
        setTimeout(() => { onSuccess(); }, 1500);
      } else {
        // Hay maestro: pasa al paso de rating inline
        setRatingToken(data.rating_token);
        setStep('rating');
      }
    } catch (e: any) {
      setErrorMsg(e?.message || 'Error');
      setStep('select');
    }
  };

  const handleSubmitRating = async () => {
    if (!canSubmitRating || !ratingToken) return;
    setStep('sending_rating');
    setErrorMsg('');
    try {
      const res = await fetch(`/api/rating-token/${encodeURIComponent(ratingToken)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calidad, puntualidad, comunicacion, precio, comentario: comentario || null }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'No se pudo enviar la calificación');
      }
      setStep('done');
      setTimeout(() => { onSuccess(); }, 1800);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Error');
      setStep('rating');
    }
  };

  const skipRating = () => {
    setStep('done');
    setTimeout(() => { onSuccess(); }, 1200);
  };

  const inProgress = step === 'closing' || step === 'sending_rating';

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={inProgress ? undefined : onClose} />
      <div className="fixed inset-x-4 top-[6%] lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[480px] bg-white rounded-[20px] z-[70] shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E8E0D8] px-5 py-4 flex items-center justify-between rounded-t-[20px]">
          <h2 className="text-[16px] font-extrabold text-[#3D3229] tracking-tight">
            {step === 'rating' || step === 'sending_rating'
              ? `Califica a ${selectedMaestro?.nombre || 'el maestro'}`
              : '¿Quién hizo el trabajo?'}
          </h2>
          {!inProgress && step !== 'done' && (
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#FAF7F4] flex items-center justify-center">
              <X size={16} className="text-[#6B5E52]" />
            </button>
          )}
        </div>

        {/* DONE */}
        {step === 'done' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-[#10B981]" />
            </div>
            <p className="text-[16px] font-extrabold text-[#3D3229]">
              {ratingToken ? '¡Gracias por calificar!' : 'Publicación cerrada'}
            </p>
            <p className="text-[13px] text-[#6B5E52] mt-2 leading-[1.5]">
              {ratingToken
                ? 'Tu opinión ayuda a otros clientes a confiar en buenos maestros.'
                : 'Marcamos tu trabajo como cerrado.'}
            </p>
          </div>
        )}

        {/* SELECT */}
        {(step === 'select' || step === 'closing') && (
          <div className="p-5">
            <p className="text-[13px] text-[#6B5E52] mb-4 leading-[1.5]">
              Marca tu trabajo como completado. Si lo realizó alguno de los maestros que respondió, ayudanos calificándolo.
            </p>

            <div className="flex flex-col gap-2">
              {respuestas.map((r) => {
                const m = r.maestro;
                const isSelected = selected === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r.id)}
                    disabled={inProgress}
                    className={`flex items-center gap-3 p-3 rounded-[14px] border-2 transition-colors text-left ${
                      isSelected ? 'border-[#7C3AED] bg-[#F3ECFF]' : 'border-[#E8E0D8] bg-white hover:bg-[#FAF7F4]'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-bold shrink-0"
                      style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }}
                    >
                      {m?.foto_url
                        ? <img src={m.foto_url} alt="" className="w-full h-full object-cover" />
                        : (m?.nombre?.charAt(0) || '?')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-bold text-[#3D3229]">{m?.nombre || 'Maestro'}</p>
                      <p className="text-[11.5px] text-[#6B5E52]">{m?.oficio || 'Maestro'}</p>
                    </div>
                    {isSelected && <CheckCircle size={20} className="text-[#7C3AED]" />}
                  </button>
                );
              })}

              <button
                onClick={() => setSelected('none')}
                disabled={inProgress}
                className={`flex items-center gap-3 p-3 rounded-[14px] border-2 transition-colors text-left ${
                  selected === 'none' ? 'border-[#7C3AED] bg-[#F3ECFF]' : 'border-[#E8E0D8] bg-white hover:bg-[#FAF7F4]'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#FAF7F4] flex items-center justify-center text-[#A89C91] shrink-0">
                  <X size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-bold text-[#3D3229]">Ninguno / contraté a otro</p>
                  <p className="text-[11.5px] text-[#6B5E52]">Solo cerrar la publicación</p>
                </div>
                {selected === 'none' && <CheckCircle size={20} className="text-[#7C3AED]" />}
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-[#FEF2F2] rounded-xl text-[12.5px] text-[#EF4444] font-semibold">
                <AlertCircle size={14} /> {errorMsg}
              </div>
            )}

            <button
              onClick={handleCerrar}
              disabled={!selected || inProgress}
              className="w-full mt-5 py-[14px] rounded-[14px] text-white font-bold text-[14px] hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }}
            >
              {step === 'closing'
                ? 'Cerrando...'
                : selected === 'none'
                  ? 'Solo cerrar publicación'
                  : 'Continuar a calificar →'}
            </button>
          </div>
        )}

        {/* RATING */}
        {(step === 'rating' || step === 'sending_rating') && (
          <div className="p-5">
            {/* Maestro card mini */}
            {selectedMaestro && (
              <div className="flex items-center gap-3 p-3 rounded-[14px] bg-[#F3ECFF] border border-[#7C3AED]/20 mb-4">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }}
                >
                  {selectedMaestro.foto_url
                    ? <img src={selectedMaestro.foto_url} alt="" className="w-full h-full object-cover" />
                    : (selectedMaestro.nombre?.charAt(0) || '?')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-extrabold text-[#3D3229]">{selectedMaestro.nombre}</p>
                  <p className="text-[11.5px] font-semibold text-[#7C3AED] uppercase tracking-wide">{selectedMaestro.oficio}</p>
                </div>
              </div>
            )}

            <p className="text-[12.5px] text-[#6B5E52] mb-4 leading-[1.45]">
              Tu calificación ayuda a otros clientes a confiar. Tarda menos de un minuto.
            </p>

            <div className="space-y-3">
              <StarPicker value={calidad} onChange={setCalidad} label="Calidad del trabajo" />
              <StarPicker value={puntualidad} onChange={setPuntualidad} label="Puntualidad" />
              <StarPicker value={comunicacion} onChange={setComunicacion} label="Comunicación" />
              <StarPicker value={precio} onChange={setPrecio} label="Precio justo" />
            </div>

            <div className="mt-4">
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
                className="w-full px-[14px] py-3 rounded-xl border border-[#E8E0D8] bg-white text-[13px] text-[#3D3229] outline-none resize-none leading-[1.4] focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] placeholder:text-[#A89C91]"
              />
            </div>

            {errorMsg && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-[#FEF2F2] rounded-xl text-[12.5px] text-[#EF4444] font-semibold">
                <AlertCircle size={14} /> {errorMsg}
              </div>
            )}

            <button
              onClick={handleSubmitRating}
              disabled={!canSubmitRating || inProgress}
              className="w-full mt-5 py-[14px] rounded-[14px] text-white font-bold text-[14px] hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }}
            >
              {step === 'sending_rating' ? 'Enviando...' : 'Enviar calificación'}
            </button>
            <button
              onClick={skipRating}
              disabled={inProgress}
              className="w-full mt-2 py-[10px] rounded-[12px] text-[12.5px] font-semibold text-[#6B5E52] hover:bg-[#FAF7F4] transition-colors disabled:opacity-50"
            >
              Calificar después
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================
// Page
// ============================================================

export default function MiPublicacionPage() {
  const params = useParams();
  const token = params.token as string;

  const [pub, setPub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCompletar, setShowCompletar] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/publicacion-token/${encodeURIComponent(token)}`);
      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPub(data);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#E8E0D8] border-t-[#7C3AED] rounded-full animate-spin" />
          <span className="text-sm text-[#6B5E52] font-medium">Cargando tu publicación...</span>
        </div>
      </div>
    );
  }

  if (error || !pub) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-6">
        <div className="max-w-sm w-full bg-white rounded-[18px] border border-[#E8E0D8] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FFF0E8] flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-[#FF6B35]" />
          </div>
          <p className="text-[16px] font-extrabold text-[#3D3229]">Enlace no válido</p>
          <p className="text-[13px] text-[#6B5E52] mt-2">
            Este enlace no existe o ya no está disponible.
          </p>
          <Link
            href="/recuperar-publicacion"
            className="inline-block mt-5 px-6 py-[11px] rounded-[12px] text-[13px] font-bold border border-[#E8E0D8] text-[#3D3229] hover:bg-[#FAF7F4] transition-colors"
          >
            Recuperar mi publicación
          </Link>
        </div>
      </div>
    );
  }

  const respuestas = pub.respuestas || [];
  const isClosed = pub.estado === 'cerrada';
  const isOpen = pub.estado === 'abierta';
  const timeAgo = new Date(pub.created_at).toLocaleDateString('es-CL', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8E0D8]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <span className="font-extrabold text-[16px] tracking-[-0.4px]">
              <span style={{ background: 'linear-gradient(135deg, #FF6B35, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                pololito
              </span>
              <span className="text-[#3D3229] font-medium opacity-65">trabajos</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#10B981]">
            <Shield size={12} />
            <span className="text-[11px] font-bold">Enlace privado</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-[18px] border border-[#E8E0D8] overflow-hidden">
          <div
            className="p-5 pb-6"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }}
          >
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {pub.urgente && isOpen && (
                <span className="inline-flex items-center gap-1 bg-white/20 text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold">
                  <Zap size={11} className="fill-white" /> URGENTE
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-white/20 text-white px-2.5 py-1 rounded-full text-[11px] font-semibold">
                {isOpen ? 'Abierta' : isClosed ? 'Cerrada' : 'Vencida'}
              </span>
            </div>
            <h1 className="text-white font-extrabold text-[20px] tracking-[-0.5px] leading-tight">
              {pub.titulo}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-white/70 text-[12px] flex-wrap">
              <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo}</span>
              {(pub.comuna || pub.ubicacion) && (
                <span className="flex items-center gap-1"><MapPin size={11} /> {pub.comuna || pub.ubicacion}</span>
              )}
            </div>
          </div>

          <div className="p-5">
            <p className="text-[13.5px] text-[#6B5E52] leading-[1.55]">{pub.descripcion}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {pub.especialidad && (
                <span className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold bg-[#FAF7F4] border border-[#E8E0D8] text-[#6B5E52]">
                  {pub.especialidad}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sección "Marcar como completado" */}
        {isOpen && (
          <div className="mt-5 bg-white rounded-[18px] border border-[#E8E0D8] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center shrink-0">
              <CheckCircle size={18} className="text-[#10B981]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#3D3229]">¿Ya hicieron tu pololito?</p>
              <p className="text-[11.5px] text-[#6B5E52] mt-0.5 leading-[1.4]">
                Marca como completado y califica al maestro que te ayudó.
              </p>
            </div>
            <button
              onClick={() => setShowCompletar(true)}
              className="shrink-0 px-4 py-2.5 rounded-[10px] text-[12.5px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)' }}
            >
              Cerrar
            </button>
          </div>
        )}

        {isClosed && (
          <div className="mt-5 bg-[#ECFDF5] rounded-[18px] border border-[#10B981]/20 p-4 flex items-center gap-3">
            <CheckCircle size={20} className="text-[#10B981] shrink-0" />
            <div>
              <p className="text-[13px] font-bold text-[#10B981]">Publicación cerrada</p>
              <p className="text-[11.5px] text-[#10B981]/80 mt-0.5">Si no calificaste, revisa tu correo: te mandamos el enlace.</p>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-extrabold text-[#3D3229] tracking-tight">
              {respuestas.length === 0
                ? 'Aún no hay propuestas'
                : `${respuestas.length} maestro${respuestas.length === 1 ? '' : 's'} interesado${respuestas.length === 1 ? '' : 's'}`}
            </h2>
          </div>

          {respuestas.length === 0 ? (
            <div className="bg-white rounded-[18px] border border-[#E8E0D8] p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF7F4] flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-[#A89C91]" />
              </div>
              <p className="text-[14px] font-bold text-[#3D3229]">Tu solicitud ya está publicada</p>
              <p className="text-[13px] text-[#6B5E52] mt-2 leading-[1.5]">
                Los maestros de tu zona la pueden ver. Te notificaremos por email cuando alguien responda.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {respuestas.map((r: any) => (
                <MaestroCard key={r.id} respuesta={r} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-[#A89C91]">
            pololitotrabajos &middot; Este enlace es privado y solo tú lo tienes
          </p>
          <Link
            href="/app"
            className="inline-block mt-3 text-[12px] font-semibold text-[#7C3AED] hover:underline"
          >
            Buscar más maestros en el catálogo
          </Link>
        </div>
      </div>

      {showCompletar && (
        <CompletarModal
          token={token}
          respuestas={respuestas}
          onClose={() => setShowCompletar(false)}
          onSuccess={() => { setShowCompletar(false); loadData(); }}
        />
      )}
    </div>
  );
}
