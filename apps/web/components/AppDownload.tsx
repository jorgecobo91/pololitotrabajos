import PhoneMockup from './PhoneMockup';

export default function AppDownload() {
  return (
    <section className="bg-grad-dark relative overflow-hidden py-32">
      <div
        className="absolute top-0 left-0 w-1/2 h-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.15), transparent 60%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <div>
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-orange">
              DESCARGA LA APP
            </span>
            <h2
              className="font-extrabold tracking-[-0.03em] text-white mt-4 mb-6"
              style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1 }}
            >
              Llévalo<br />en el bolsillo.
            </h2>
            <p className="text-white/70 text-lg max-w-md mb-8" style={{ lineHeight: 1.6 }}>
              Descarga la app y encuentra maestros cerca tuyo en segundos. Cotiza y coordina por WhatsApp directo desde tu celular.
            </p>

            {/* Store buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="bg-black border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.55 4.3-3.74 4.25z"/>
                </svg>
                <div className="text-left">
                  <div className="text-white/60 text-[10px]">Descargar en</div>
                  <div className="text-white font-bold text-sm">App Store</div>
                </div>
              </div>
              <div className="bg-black border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.395 12l2.302-2.302v-.19zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                <div className="text-left">
                  <div className="text-white/60 text-[10px]">Disponible en</div>
                  <div className="text-white font-bold text-sm">Google Play</div>
                </div>
              </div>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '⚡', text: 'Búsqueda al tiro' },
                { icon: '📞', text: 'Llamada y WhatsApp' },
                { icon: '🔔', text: 'Avisos en tiempo real' },
                { icon: '📍', text: 'Maestros cercanos' },
              ].map((f) => (
                <div key={f.text} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet/20 flex items-center justify-center text-lg shrink-0">
                    {f.icon}
                  </div>
                  <span className="text-white font-medium text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phone side */}
          <div className="hidden lg:block">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
