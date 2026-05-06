interface Props {
  floatingBadges?: boolean;
}

export default function PhoneMockup({ floatingBadges = false }: Props) {
  return (
    <div className="relative w-[320px] h-[640px] mx-auto">
      {/* Floating badges */}
      {floatingBadges && (
        <>
          <div className="absolute top-20 -left-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 z-20 animate-float">
            <div className="w-9 h-9 rounded-full bg-amber flex items-center justify-center text-white text-sm">
              ⭐
            </div>
            <div>
              <div className="text-sm font-bold text-ink">4.9 · Don Luis</div>
              <div className="text-xs text-muted">Electricista verificado</div>
            </div>
          </div>

          <div className="absolute bottom-32 -right-8 bg-white rounded-2xl shadow-xl px-4 py-2 flex items-center gap-2 z-20 animate-floatDelayed">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald" />
            <span className="text-xs font-medium text-muted">Respondió en 12 min</span>
          </div>

          <div className="absolute top-1/2 -right-12 bg-white rounded-2xl shadow-xl px-3 py-2 z-20 animate-floatSlow">
            <div className="text-[10px] font-bold text-emerald tracking-widest">CONFIRMADO</div>
            <div className="text-xs text-ink">Llega mañana 10:00</div>
          </div>
        </>
      )}

      {/* Phone frame */}
      <div className="bg-phoneBlk rounded-[3rem] p-3 shadow-2xl border-[3px] border-black/80 h-full">
        <div className="bg-white rounded-[2.5rem] overflow-hidden h-full relative">
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-7 bg-phoneBlk rounded-full z-10" />

          {/* Status bar */}
          <div className="flex justify-between items-center px-8 pt-4 text-xs font-semibold text-ink">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-[2px] items-end">
                <div className="w-[3px] h-[4px] bg-ink rounded-sm" />
                <div className="w-[3px] h-[6px] bg-ink rounded-sm" />
                <div className="w-[3px] h-[8px] bg-ink rounded-sm" />
                <div className="w-[3px] h-[10px] bg-ink rounded-sm" />
              </div>
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                <path d="M7.5 3.5C9.4 3.5 11.1 4.3 12.3 5.5L14 3.8C12.3 2.1 10 1 7.5 1S2.7 2.1 1 3.8L2.7 5.5C3.9 4.3 5.6 3.5 7.5 3.5Z" fill="#0F0B1A"/>
                <path d="M7.5 6.5C8.6 6.5 9.6 6.9 10.3 7.6L12 5.9C10.8 4.7 9.2 4 7.5 4S4.2 4.7 3 5.9L4.7 7.6C5.4 6.9 6.4 6.5 7.5 6.5Z" fill="#0F0B1A"/>
                <circle cx="7.5" cy="9.5" r="1.5" fill="#0F0B1A"/>
              </svg>
              <svg width="18" height="10" viewBox="0 0 25 12" fill="none">
                <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="#0F0B1A"/>
                <rect x="2" y="2" width="16" height="8" rx="2" fill="#0F0B1A"/>
                <path d="M23 4.5v3a1.5 1.5 0 0 0 0-3Z" fill="#0F0B1A"/>
              </svg>
            </div>
          </div>

          {/* App header */}
          <div className="flex items-center justify-between px-5 pt-12">
            <span className="font-extrabold text-sm tracking-tight text-ink">POLOLITOTRABAJOS</span>
            <div className="relative">
              <span className="text-lg">🔔</span>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
            </div>
          </div>

          {/* Greeting */}
          <div className="px-5 mt-4">
            <h2 className="text-2xl font-extrabold text-ink">¡Hola Andrés!</h2>
          </div>

          {/* Search */}
          <div className="mx-5 mt-3 bg-[#F3F4F6] rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="text-sm">🔍</span>
            <span className="text-sm text-muted">Buscar maestro o servicio...</span>
          </div>

          {/* Chips */}
          <div className="flex gap-2 px-5 mt-4 overflow-x-auto">
            <span className="bg-grad-cta text-white rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap">Todos</span>
            <span className="bg-[#F3F4F6] text-ink rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap">Electricista</span>
            <span className="bg-[#F3F4F6] text-ink rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap">Gasfitería</span>
          </div>

          {/* Banner */}
          <div className="mx-5 mt-4 rounded-2xl px-4 py-3 bg-grad-cta">
            <p className="text-sm font-extrabold leading-tight text-white">
              Encuentra al maestro perfecto
            </p>
            <p className="text-xs text-white/80 mt-0.5">
              para tu próximo pololito
            </p>
          </div>

          {/* Maestro cards */}
          <div className="px-5 mt-3 space-y-2.5">
            <div className="border border-divider rounded-2xl p-3 flex gap-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-grad-cta flex items-center justify-center text-white font-bold">L</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold tracking-widest text-muted uppercase">ELECTRICISTA</div>
                <div className="font-bold text-sm text-ink">Luis Hernández</div>
                <div className="text-xs text-muted mt-0.5">
                  <span className="text-amber">⭐</span> 4.9 · 📍 Providencia
                </div>
                <p className="text-xs text-muted mt-1 line-clamp-1">Especialista en instalaciones eléctricas residenciales</p>
              </div>
            </div>

            <div className="border border-divider rounded-2xl p-3 flex gap-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, #F97316, #FF6B35)' }}>M</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold tracking-widest text-muted uppercase">GASFITERÍA</div>
                <div className="font-bold text-sm text-ink">María González</div>
                <div className="text-xs text-muted mt-0.5">
                  <span className="text-amber">⭐</span> 4.8 · 📍 Ñuñoa
                </div>
                <p className="text-xs text-muted mt-1 line-clamp-1">Gasfíter certificada. Reparaciones e instalaciones</p>
              </div>
            </div>
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-0 inset-x-0 bg-white border-t border-black/5 flex justify-around py-3">
            {[
              { icon: '👥', label: 'Maestros', active: true },
              { icon: '➕', label: 'Publicar', active: false },
              { icon: '💬', label: 'Chats', active: false },
              { icon: '👤', label: 'Perfil', active: false },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="text-base">{item.icon}</span>
                <span className={`text-[10px] font-medium ${item.active ? 'text-violet' : 'text-muted'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
