/* global React */
// POLOLITOTRABAJOS — Landings v2 (3 new variants)
// Paletas inspiradas en oficios chilenos.

const LV2_FONT = window.PT_FONT;
const LV2_L = window.PT_LIGHT;

/* PALETAS NUEVAS — específicas a estas landings */
const PALETTE_COBRE = {
  name: 'Cobre & Mezclilla',
  grad: 'linear-gradient(135deg, #B45309 0%, #D97706 50%, #F59E0B 100%)',
  gradStrong: 'linear-gradient(135deg, #92400E 0%, #B45309 100%)',
  gradAlt: 'linear-gradient(135deg, #1E3A5F 0%, #2C4F7C 100%)',
  primary: '#B45309',
  primaryDeep: '#7C2D12',
  primarySoft: '#FEF3C7',
  primaryInk: '#451A03',
  accent: '#1E3A5F',     // mezclilla
  accentSoft: '#DBE3F0',
  bg: '#FBF6EE',          // crema cobre
  bgAlt: '#F5EBD7',
  surface: '#FFFFFF',
  border: '#E8DCC4',
};

const PALETTE_HORMIGON = {
  name: 'Casco & Hormigón',
  grad: 'linear-gradient(135deg, #FACC15 0%, #FDE047 100%)',
  gradStrong: 'linear-gradient(135deg, #CA8A04 0%, #FACC15 100%)',
  gradAlt: 'linear-gradient(135deg, #18181B 0%, #3F3F46 100%)',
  primary: '#FACC15',
  primaryDeep: '#A16207',
  primarySoft: '#FEF9C3',
  primaryInk: '#1C1917',
  accent: '#18181B',
  accentSoft: '#E4E4E7',
  bg: '#FAFAF9',
  bgAlt: '#F4F4F5',
  surface: '#FFFFFF',
  border: '#E4E4E7',
};

const PALETTE_TERRACOTA = {
  name: 'Domingo en la Casa',
  grad: 'linear-gradient(135deg, #C2410C 0%, #DC6B3A 50%, #EA8762 100%)',
  gradStrong: 'linear-gradient(135deg, #9A2F0A 0%, #C2410C 100%)',
  gradAlt: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
  primary: '#C2410C',
  primaryDeep: '#7C2D12',
  primarySoft: '#FED7AA',
  primaryInk: '#431407',
  accent: '#047857',     // verde menta planta
  accentSoft: '#D1FAE5',
  bg: '#FDF6EC',
  bgAlt: '#FAEBD2',
  surface: '#FFFFFF',
  border: '#EBD9BC',
};

/* shared atoms */
function V2Wordmark({ palette, size = 17 }) {
  return (
    <span style={{
      fontFamily: LV2_FONT.display, fontWeight: 900, fontSize: size,
      letterSpacing: -0.6, lineHeight: 1, color: palette.primaryDeep,
    }}>
      pololito<span style={{ fontWeight: 500, opacity: 0.6, color: palette.primary }}>trabajos</span>
    </span>
  );
}

function V2Mono({ children, color, size = 10 }) {
  return (
    <span style={{
      fontFamily: LV2_FONT.mono, fontSize: size,
      letterSpacing: 0.7, textTransform: 'uppercase',
      color, fontWeight: 700,
    }}>{children}</span>
  );
}

function V2Stripe({ height = 220, label, palette, radius = 18 }) {
  return (
    <div style={{
      width: '100%', height, borderRadius: radius,
      backgroundImage: `repeating-linear-gradient(135deg, ${palette.primarySoft} 0 14px, ${palette.primary}22 14px 28px)`,
      border: `1px solid ${palette.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      {label && (
        <span style={{
          fontFamily: LV2_FONT.mono, fontSize: 10, letterSpacing: 0.7,
          textTransform: 'uppercase', color: palette.primaryDeep,
          background: 'rgba(255,255,255,0.92)', padding: '6px 11px',
          borderRadius: 6, fontWeight: 700,
        }}>{label}</span>
      )}
    </div>
  );
}

function V2Phone({ children, height, bg }) {
  return (
    <div style={{
      width: 380, height, background: bg,
      fontFamily: LV2_FONT.body, color: LV2_L.ink,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        height: 28, padding: '0 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 11, fontWeight: 700, color: LV2_L.ink,
      }}>
        <span>9:41</span>
        <span style={{ width: 14, height: 8, border: `1.2px solid ${LV2_L.ink}`, borderRadius: 2, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1, background: LV2_L.ink, width: '70%' }}/>
        </span>
      </div>
      {children}
    </div>
  );
}

function V2Icon({ name, size = 18, color = 'currentColor', stroke = 1.8 }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth: stroke,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'arrow-up-right': return <svg {...props}><path d="M7 17 17 7M7 7h10v10"/></svg>;
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'star': return <svg {...props} fill={color}><path d="M12 2l3 7 7 .8-5.2 4.8L18 22l-6-3.5L6 22l1.2-7.4L2 9.8 9 9z"/></svg>;
    case 'pin': return <svg {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case 'zap': return <svg {...props} fill={color}><path d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>;
    case 'shield': return <svg {...props}><path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5z"/><path d="m9 12 2 2 4-4"/></svg>;
    case 'check': return <svg {...props}><path d="m5 12 5 5 9-11"/></svg>;
    case 'x': return <svg {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case 'plug': return <svg {...props}><path d="M9 2v6M15 2v6"/><path d="M7 8h10v4a5 5 0 0 1-10 0z"/><path d="M12 17v5"/></svg>;
    case 'wrench': return <svg {...props}><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.7-1.7-1.6-1.7z"/></svg>;
    case 'hammer': return <svg {...props}><path d="m15 12-8 8-3-3 8-8"/><path d="m17 6 3 3-6 6-3-3z"/><path d="m17 6 4-4"/></svg>;
    case 'home': return <svg {...props}><path d="m3 11 9-8 9 8v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/></svg>;
    case 'paint': return <svg {...props}><path d="M19 11V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3M3 11h18v3H3z"/><path d="M12 14v8"/></svg>;
    case 'roof': return <svg {...props}><path d="m2 12 10-8 10 8"/><path d="M5 10v10h14V10"/></svg>;
    case 'phone': return <svg {...props}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.7 2z"/></svg>;
    case 'chat': return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'clock': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'menu': return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'leaf': return <svg {...props}><path d="M11 20A7 7 0 0 1 4 13c0-4 4-9 8-11 4 2 8 7 8 11a7 7 0 0 1-7 7"/><path d="M11 20v-7"/></svg>;
    default: return null;
  }
}

/* =========================================================
 * V4 — COBRE & MEZCLILLA
 * Editorial, tierra, autenticidad. Estilo "trade" americano clásico.
 * ========================================================= */

function LandingCobre() {
  const P = PALETTE_COBRE;
  return (
    <V2Phone height={1620} bg={P.bg}>
      {/* NAV */}
      <div style={{ padding: '8px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <V2Wordmark palette={P} size={16}/>
        <button style={{
          background: 'transparent', border: `1.5px solid ${P.primaryDeep}`,
          padding: '8px 14px', borderRadius: 99, fontWeight: 800, fontSize: 11,
          fontFamily: LV2_FONT.mono, letterSpacing: 0.5, textTransform: 'uppercase',
          color: P.primaryDeep,
        }}>Entrar</button>
      </div>

      {/* HERO — editorial layout, big numerated header */}
      <div style={{ padding: '32px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
          <span style={{
            fontFamily: LV2_FONT.mono, fontSize: 11, fontWeight: 700,
            color: P.primary, letterSpacing: 0.8, paddingTop: 6,
          }}>Nº 01 / CHILE</span>
          <span style={{ flex: 1, height: 1, background: P.border, marginTop: 12 }}/>
          <span style={{
            fontFamily: LV2_FONT.mono, fontSize: 11, fontWeight: 700,
            color: P.primary, paddingTop: 6,
          }}>2026</span>
        </div>

        <h1 style={{
          fontFamily: LV2_FONT.display, fontWeight: 900,
          fontSize: 54, lineHeight: 0.86,
          letterSpacing: -2.6, margin: 0,
          color: P.primaryDeep, textWrap: 'balance',
        }}>
          El maestro<br/>
          <span style={{
            fontStyle: 'italic', fontWeight: 500,
            color: P.accent, letterSpacing: -1.6,
          }}>justo</span>{' '}
          para tu pega.
        </h1>

        <p style={{
          fontSize: 15.5, lineHeight: 1.55,
          color: P.primaryInk, opacity: 0.75,
          margin: '20px 0 0', textWrap: 'pretty', maxWidth: 320,
        }}>
          Una plataforma chilena que conecta clientes con maestros de oficio. Sin vueltas, sin intermediarios, sin sorpresas.
        </p>
      </div>

      {/* HERO IMAGE — full bleed editorial */}
      <div style={{ padding: '28px 0 0', position: 'relative' }}>
        <div style={{ padding: '0 18px' }}>
          <V2Stripe height={300} label="MAESTRO EN TERRENO · FOTO REAL" palette={P} radius={4}/>
        </div>
        {/* caption editorial */}
        <div style={{
          padding: '14px 18px 0',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <span style={{
            fontFamily: LV2_FONT.mono, fontSize: 9.5, color: P.primary,
            fontWeight: 700, letterSpacing: 0.6, paddingTop: 2,
          }}>FIG. 01</span>
          <span style={{ fontSize: 12, color: P.primaryInk, opacity: 0.7, lineHeight: 1.5, flex: 1 }}>
            Don Luis Sepúlveda, gasfiter en Antofagasta. 23 años de oficio, 4.9★ en POLOLITOTRABAJOS.
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: '32px 18px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button style={{
          height: 60, borderRadius: 4, border: 'none',
          background: P.primaryDeep, color: '#fff',
          fontWeight: 800, fontSize: 15, fontFamily: LV2_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px', letterSpacing: -0.2,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: LV2_FONT.mono, fontSize: 10, fontWeight: 700,
              opacity: 0.6, letterSpacing: 0.6,
            }}>01</span>
            Buscar un maestro
          </span>
          <V2Icon name="arrow-up-right" size={18} color="#fff"/>
        </button>
        <button style={{
          height: 60, borderRadius: 4,
          background: 'transparent', border: `1.5px solid ${P.primaryDeep}`,
          color: P.primaryDeep,
          fontWeight: 800, fontSize: 15, fontFamily: LV2_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px', letterSpacing: -0.2,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: LV2_FONT.mono, fontSize: 10, fontWeight: 700,
              opacity: 0.6, letterSpacing: 0.6,
            }}>02</span>
            Publicar trabajo
          </span>
          <V2Icon name="arrow-up-right" size={18} color={P.primaryDeep}/>
        </button>
      </div>

      {/* STATS BAR */}
      <div style={{
        margin: '32px 18px 0', padding: '16px 0',
        borderTop: `1px solid ${P.border}`, borderBottom: `1px solid ${P.border}`,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
      }}>
        {[
          { v: '1.240', l: 'Maestros', s: 'activos hoy' },
          { v: '4.8', l: 'Calificación', s: 'promedio' },
          { v: '< 2h', l: 'Respuesta', s: 'mediana' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '0 12px',
            borderRight: i < 2 ? `1px solid ${P.border}` : 'none',
          }}>
            <div style={{
              fontFamily: LV2_FONT.display, fontSize: 28, fontWeight: 900,
              color: P.primaryDeep, letterSpacing: -1.2, lineHeight: 1,
            }}>{s.v}</div>
            <div style={{ fontFamily: LV2_FONT.mono, fontSize: 9, color: P.primary, marginTop: 6, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.l}</div>
            <div style={{ fontSize: 10.5, color: P.primaryInk, opacity: 0.55, marginTop: 1 }}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS — editorial numbered */}
      <div style={{ padding: '36px 18px 0' }}>
        <V2Mono color={P.primary}>03 / Cómo funciona</V2Mono>
        <h2 style={{
          fontFamily: LV2_FONT.display, fontSize: 32, fontWeight: 900,
          letterSpacing: -1.4, margin: '8px 0 22px', lineHeight: 0.95,
          color: P.primaryDeep,
        }}>
          Dos caminos.<br/>
          <span style={{ fontStyle: 'italic', fontWeight: 500, color: P.accent }}>Un solo lugar.</span>
        </h2>

        {[
          { side: 'Para clientes', steps: ['Publica tu necesidad', 'Recibe respuestas', 'Coordina y contrata', 'Califica al maestro'], color: P.primary },
          { side: 'Para maestros', steps: ['Crea tu perfil', 'Recibe solicitudes', 'Acepta y conversa', 'Gana pegas nuevas'], color: P.accent },
        ].map((col, ci) => (
          <div key={ci} style={{ marginBottom: 18 }}>
            <V2Mono color={col.color}>{col.side}</V2Mono>
            <div style={{ marginTop: 10 }}>
              {col.steps.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'baseline', gap: 14,
                  padding: '12px 0', borderBottom: `1px solid ${P.border}`,
                }}>
                  <span style={{
                    fontFamily: LV2_FONT.mono, fontSize: 11, fontWeight: 700,
                    color: col.color, letterSpacing: 0.4, minWidth: 30,
                  }}>0{i+1}</span>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: P.primaryInk, flex: 1 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CATEGORIES — list with line dividers */}
      <div style={{ padding: '24px 18px 0' }}>
        <V2Mono color={P.primary}>04 / Oficios</V2Mono>
        <h2 style={{
          fontFamily: LV2_FONT.display, fontSize: 30, fontWeight: 900,
          letterSpacing: -1.3, margin: '8px 0 16px', color: P.primaryDeep, lineHeight: 1,
        }}>Para todo pololito.</h2>

        {[
          { i: 'plug', name: 'Electricistas', n: '320' },
          { i: 'wrench', name: 'Gasfiteres', n: '180' },
          { i: 'hammer', name: 'Construcción', n: '420' },
          { i: 'home', name: 'Carpinteros', n: '210' },
          { i: 'roof', name: 'Techumbre', n: '95' },
          { i: 'paint', name: 'Pintores', n: '150' },
        ].map((c, i, arr) => (
          <div key={c.name} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 0',
            borderBottom: i < arr.length - 1 ? `1px solid ${P.border}` : 'none',
          }}>
            <V2Icon name={c.i} size={20} color={P.primary} stroke={1.6}/>
            <span style={{ flex: 1, fontFamily: LV2_FONT.display, fontWeight: 700, fontSize: 17, color: P.primaryDeep, letterSpacing: -0.4 }}>{c.name}</span>
            <span style={{ fontFamily: LV2_FONT.mono, fontSize: 11, color: P.primary, fontWeight: 700 }}>{c.n}</span>
            <V2Icon name="arrow-right" size={14} color={P.primaryInk} stroke={1.6}/>
          </div>
        ))}
      </div>

      {/* TRUST — pull quote style */}
      <div style={{
        margin: '36px 0 0', padding: '36px 18px',
        background: P.accent, color: '#fff', position: 'relative',
      }}>
        <V2Mono color="rgba(255,255,255,0.6)">05 / Confianza</V2Mono>
        <h2 style={{
          fontFamily: LV2_FONT.display, fontSize: 36, fontWeight: 900,
          letterSpacing: -1.6, margin: '10px 0 18px', lineHeight: 0.95,
          color: '#fff', textWrap: 'balance',
        }}>
          “Un buen maestro es{' '}
          <span style={{ fontStyle: 'italic', fontWeight: 500, color: P.primarySoft }}>oro puro.</span>{' '}
          Ahora, encontrarlo es fácil.”
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22 }}>
          {['Calificaciones reales de clientes', 'Historial de trabajos visible', 'Contacto dentro de la app'].map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 600 }}>
              <V2Icon name="check" size={16} color={P.primarySoft} stroke={2.4}/>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: '36px 18px 24px' }}>
        <V2Mono color={P.primary}>06 / Empezar</V2Mono>
        <h2 style={{
          fontFamily: LV2_FONT.display, fontSize: 44, fontWeight: 900,
          letterSpacing: -2, margin: '8px 0 6px', lineHeight: 0.9,
          color: P.primaryDeep, textWrap: 'balance',
        }}>
          ¿Listo,<br/>
          <span style={{ fontStyle: 'italic', fontWeight: 500, color: P.accent }}>compadre?</span>
        </h2>
        <p style={{ fontSize: 14, color: P.primaryInk, opacity: 0.7, margin: '14px 0 22px' }}>
          Es gratis. Sin tarjeta. Sin compromiso.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={{
            height: 56, borderRadius: 4, border: 'none',
            background: P.primaryDeep, color: '#fff',
            fontWeight: 800, fontSize: 14.5, fontFamily: LV2_FONT.display,
          }}>Buscar maestro</button>
          <button style={{
            height: 56, borderRadius: 4,
            background: 'transparent', border: `1.5px solid ${P.primaryDeep}`,
            color: P.primaryDeep,
            fontWeight: 800, fontSize: 14.5, fontFamily: LV2_FONT.display,
          }}>Publicar trabajo</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: '24px 18px',
        borderTop: `1px solid ${P.border}`,
        background: P.bgAlt,
      }}>
        <V2Wordmark palette={P} size={14}/>
        <p style={{ fontSize: 11, lineHeight: 1.6, color: P.primaryInk, opacity: 0.7, marginTop: 12 }}>
          POLOLITOTRABAJOS es <b>solo intermediaria</b>. No garantizamos calidad ni respondemos por incumplimientos, pagos o resultados. Cada usuario es responsable de sus acuerdos. Revisa calificaciones antes de contratar.
        </p>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 16,
          fontFamily: LV2_FONT.mono, fontSize: 10, fontWeight: 700,
          color: P.primary, letterSpacing: 0.5,
        }}>
          <span>TÉRMINOS</span><span>PRIVACIDAD</span><span>SOPORTE</span>
          <span style={{ opacity: 0.5 }}>v1.0</span>
        </div>
      </div>
    </V2Phone>
  );
}

/* =========================================================
 * V5 — CASCO & HORMIGÓN
 * Industrial, señalética, brutalista. Amarillo de obra + grafito.
 * ========================================================= */

function LandingHormigon() {
  const P = PALETTE_HORMIGON;
  return (
    <V2Phone height={1560} bg={P.bg}>
      {/* NAV — bold black bar */}
      <div style={{
        padding: '8px 18px',
        background: P.accent, color: P.primary,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        margin: '4px 0 0',
      }}>
        <V2Wordmark palette={{ ...P, primaryDeep: P.primary, primary: '#fff' }} size={16}/>
        <button style={{
          background: P.primary, border: 'none',
          padding: '8px 14px', borderRadius: 0, fontWeight: 900, fontSize: 11,
          fontFamily: LV2_FONT.mono, letterSpacing: 0.6, textTransform: 'uppercase',
          color: P.accent,
        }}>Iniciar →</button>
      </div>

      {/* CAUTION TAPE STRIP */}
      <div style={{
        height: 14,
        backgroundImage: `repeating-linear-gradient(135deg, ${P.primary} 0 14px, ${P.accent} 14px 28px)`,
      }}/>

      {/* HERO — brutalist */}
      <div style={{ padding: '24px 18px 0' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px',
          background: P.accent, color: P.primary,
          fontFamily: LV2_FONT.mono, fontSize: 10, fontWeight: 800,
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 18,
        }}>
          <span style={{ width: 6, height: 6, background: P.primary }}/>
          POLOLITOTRABAJOS · CHILE
        </div>

        <h1 style={{
          fontFamily: LV2_FONT.display, fontWeight: 900,
          fontSize: 56, lineHeight: 0.85,
          letterSpacing: -2.8, margin: 0,
          color: P.accent, textWrap: 'balance',
          textTransform: 'uppercase',
        }}>
          Pega<br/>
          <span style={{
            background: P.primary, color: P.accent,
            padding: '0 10px', display: 'inline-block',
            transform: 'rotate(-1deg)', boxShadow: `4px 4px 0 ${P.accent}`,
            margin: '6px 0',
          }}>resuelta</span><br/>
          al tiro.
        </h1>

        <p style={{
          fontSize: 15.5, lineHeight: 1.5,
          color: P.accent, opacity: 0.75,
          margin: '22px 0 0', textWrap: 'pretty', maxWidth: 320, fontWeight: 500,
        }}>
          Maestros de obra, electricistas, gasfiteres y más. Cerca tuyo. Calificados. Sin webeo.
        </p>
      </div>

      {/* HERO IMAGE — with sticker badges */}
      <div style={{ padding: '24px 18px 0', position: 'relative' }}>
        <V2Stripe height={240} label="MAESTRO EN OBRA" palette={P} radius={0}/>

        {/* sticker badge */}
        <div style={{
          position: 'absolute', right: 24, top: -10,
          background: P.primary, color: P.accent,
          padding: '12px 14px',
          fontFamily: LV2_FONT.mono, fontSize: 10, fontWeight: 900,
          letterSpacing: 0.6, textTransform: 'uppercase',
          transform: 'rotate(8deg)',
          boxShadow: `4px 4px 0 ${P.accent}`,
          textAlign: 'center', lineHeight: 1.3,
        }}>
          GRATIS<br/>
          <span style={{ fontSize: 8, opacity: 0.8 }}>siempre</span>
        </div>
      </div>

      {/* CTAs — chunky brutalist buttons */}
      <div style={{ padding: '24px 18px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={{
          height: 60, border: `2px solid ${P.accent}`, borderRadius: 0,
          background: P.primary, color: P.accent,
          fontWeight: 900, fontSize: 15, fontFamily: LV2_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 18px', letterSpacing: -0.4,
          textTransform: 'uppercase',
          boxShadow: `4px 4px 0 ${P.accent}`,
        }}>
          <span>Buscar maestro</span>
          <V2Icon name="arrow-right" size={20} color={P.accent} stroke={2.4}/>
        </button>
        <button style={{
          height: 60, border: `2px solid ${P.accent}`, borderRadius: 0,
          background: '#fff', color: P.accent,
          fontWeight: 900, fontSize: 15, fontFamily: LV2_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 18px', letterSpacing: -0.4,
          textTransform: 'uppercase',
          boxShadow: `4px 4px 0 ${P.accent}`,
        }}>
          <span>Publicar trabajo</span>
          <V2Icon name="plus" size={20} color={P.accent} stroke={2.4}/>
        </button>
      </div>

      {/* TICKER STATS */}
      <div style={{
        margin: '24px 0 0', padding: '14px 0',
        background: P.accent, color: P.primary,
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          display: 'flex', gap: 32,
          fontFamily: LV2_FONT.mono, fontSize: 12, fontWeight: 800,
          letterSpacing: 0.6, textTransform: 'uppercase',
          padding: '0 18px', whiteSpace: 'nowrap',
        }}>
          <span>★ 4.8 PROMEDIO</span>
          <span>•</span>
          <span>1.240 MAESTROS</span>
          <span>•</span>
          <span>RESPUESTA &lt; 2H</span>
          <span>•</span>
          <span>+50 COMUNAS</span>
        </div>
      </div>

      {/* PROBLEMA / SOLUCIÓN — 2 col side by side */}
      <div style={{ padding: '32px 18px 0' }}>
        <V2Mono color={P.accent}>02 · El asunto</V2Mono>
        <h2 style={{
          fontFamily: LV2_FONT.display, fontSize: 30, fontWeight: 900,
          letterSpacing: -1.4, margin: '8px 0 18px', lineHeight: 0.95,
          color: P.accent, textTransform: 'uppercase',
        }}>El antes y el ahora.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `2px solid ${P.accent}` }}>
          <div style={{
            padding: 14, background: P.bgAlt, borderRight: `2px solid ${P.accent}`,
          }}>
            <div style={{
              fontFamily: LV2_FONT.mono, fontSize: 9, fontWeight: 900,
              color: P.accent, opacity: 0.55, letterSpacing: 0.6, marginBottom: 10,
              textTransform: 'uppercase',
            }}>ANTES</div>
            {['Buscar a ciegas', 'Sin calificaciones', 'Precios opacos'].map((t) => (
              <div key={t} style={{
                fontSize: 12, fontWeight: 700, color: P.accent, opacity: 0.6,
                marginBottom: 8, lineHeight: 1.3,
                textDecoration: 'line-through',
              }}>{t}</div>
            ))}
          </div>
          <div style={{
            padding: 14, background: P.primary, color: P.accent,
          }}>
            <div style={{
              fontFamily: LV2_FONT.mono, fontSize: 9, fontWeight: 900,
              letterSpacing: 0.6, marginBottom: 10, textTransform: 'uppercase',
            }}>AHORA</div>
            {['Calificaciones reales', 'Contacto directo', 'Maestros cerca tuyo'].map((t) => (
              <div key={t} style={{
                fontSize: 13, fontWeight: 800, marginBottom: 8, lineHeight: 1.3,
                display: 'flex', alignItems: 'flex-start', gap: 6,
              }}>
                <V2Icon name="check" size={13} color={P.accent} stroke={3}/>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS — numbered blocks */}
      <div style={{ padding: '32px 18px 0' }}>
        <V2Mono color={P.accent}>03 · Pasos</V2Mono>
        <h2 style={{
          fontFamily: LV2_FONT.display, fontSize: 30, fontWeight: 900,
          letterSpacing: -1.4, margin: '8px 0 18px',
          color: P.accent, textTransform: 'uppercase',
        }}>Cuatro pasos.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { n: '01', t: 'Publica o busca', d: 'Cuenta qué necesitas.' },
            { n: '02', t: 'Conecta', d: 'Te respondo por chat.' },
            { n: '03', t: 'Coordina', d: 'Definen visita y pega.' },
            { n: '04', t: 'Califica', d: 'Termina y reseña.' },
          ].map((s) => (
            <div key={s.n} style={{
              padding: 14, background: '#fff',
              border: `2px solid ${P.accent}`,
            }}>
              <div style={{
                fontFamily: LV2_FONT.display, fontSize: 32, fontWeight: 900,
                color: P.primary, lineHeight: 1, letterSpacing: -1.5,
                WebkitTextStroke: `1.5px ${P.accent}`,
              }}>{s.n}</div>
              <div style={{
                fontFamily: LV2_FONT.display, fontWeight: 900, fontSize: 14,
                color: P.accent, marginTop: 8, textTransform: 'uppercase', letterSpacing: -0.3,
              }}>{s.t}</div>
              <div style={{ fontSize: 11.5, color: P.accent, opacity: 0.7, marginTop: 4, lineHeight: 1.4 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES — chunky grid */}
      <div style={{ padding: '32px 18px 0' }}>
        <V2Mono color={P.accent}>04 · Oficios</V2Mono>
        <h2 style={{
          fontFamily: LV2_FONT.display, fontSize: 30, fontWeight: 900,
          letterSpacing: -1.4, margin: '8px 0 16px',
          color: P.accent, textTransform: 'uppercase',
        }}>Pega disponible.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, border: `2px solid ${P.accent}` }}>
          {[
            { i: 'plug', name: 'Eléctrico' },
            { i: 'wrench', name: 'Gasfiter' },
            { i: 'hammer', name: 'Construcción' },
            { i: 'home', name: 'Carpintería' },
            { i: 'roof', name: 'Techumbre' },
            { i: 'paint', name: 'Pintura' },
          ].map((c, i) => {
            const isYellow = i % 3 === 1;
            return (
              <div key={c.name} style={{
                padding: 16,
                background: isYellow ? P.primary : '#fff',
                color: P.accent,
                borderRight: i % 2 === 0 ? `2px solid ${P.accent}` : 'none',
                borderBottom: i < 4 ? `2px solid ${P.accent}` : 'none',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <V2Icon name={c.i} size={20} color={P.accent} stroke={2}/>
                <span style={{
                  fontFamily: LV2_FONT.display, fontWeight: 900, fontSize: 13,
                  letterSpacing: -0.3, textTransform: 'uppercase',
                }}>{c.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: '32px 18px 0' }}>
        <div style={{
          background: P.primary, padding: '28px 22px',
          border: `2px solid ${P.accent}`,
          boxShadow: `6px 6px 0 ${P.accent}`,
          color: P.accent,
        }}>
          <h2 style={{
            fontFamily: LV2_FONT.display, fontSize: 36, fontWeight: 900,
            letterSpacing: -1.6, margin: '0 0 8px', lineHeight: 0.9,
            textTransform: 'uppercase',
          }}>Manos<br/>a la obra.</h2>
          <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 18px' }}>
            Gratis. Toma 2 min. Sin compromiso.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{
              height: 50, background: P.accent, color: P.primary,
              border: 'none', borderRadius: 0,
              fontWeight: 900, fontSize: 14, fontFamily: LV2_FONT.display,
              textTransform: 'uppercase', letterSpacing: -0.2,
            }}>Buscar maestro →</button>
            <button style={{
              height: 50, background: 'transparent', color: P.accent,
              border: `2px solid ${P.accent}`, borderRadius: 0,
              fontWeight: 900, fontSize: 14, fontFamily: LV2_FONT.display,
              textTransform: 'uppercase', letterSpacing: -0.2,
            }}>Publicar trabajo +</button>
          </div>
        </div>
      </div>

      {/* CAUTION TAPE STRIP */}
      <div style={{
        height: 14, marginTop: 32,
        backgroundImage: `repeating-linear-gradient(135deg, ${P.primary} 0 14px, ${P.accent} 14px 28px)`,
      }}/>

      {/* FOOTER */}
      <div style={{ padding: '24px 18px', background: P.accent, color: '#fff' }}>
        <V2Wordmark palette={{ ...P, primaryDeep: P.primary, primary: '#fff' }} size={13}/>
        <p style={{ fontSize: 11, lineHeight: 1.6, color: '#fff', opacity: 0.75, marginTop: 12 }}>
          Somos <b>solo intermediaria</b>. No garantizamos calidad ni respondemos por incumplimientos, pagos ni resultados. Cada usuario responde por sus acuerdos. Revisa calificaciones antes de contratar.
        </p>
        <div style={{
          display: 'flex', gap: 16, marginTop: 14,
          fontFamily: LV2_FONT.mono, fontSize: 10, fontWeight: 800,
          letterSpacing: 0.6, color: P.primary,
        }}>
          <span>TÉRMINOS</span><span>PRIVACIDAD</span><span>SOPORTE</span>
        </div>
      </div>
    </V2Phone>
  );
}

/* =========================================================
 * V6 — DOMINGO EN LA CASA
 * Cálido, hogareño, terracota + verde planta. "Como en familia".
 * ========================================================= */

function LandingTerracota() {
  const P = PALETTE_TERRACOTA;
  return (
    <V2Phone height={1620} bg={P.bg}>
      {/* NAV */}
      <div style={{ padding: '8px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <V2Wordmark palette={P} size={16}/>
        <button style={{
          height: 36, padding: '0 14px', borderRadius: 99,
          background: P.surface, border: `1px solid ${P.border}`,
          fontWeight: 700, fontSize: 12, color: P.primaryDeep,
          fontFamily: LV2_FONT.body,
        }}>Entrar</button>
      </div>

      {/* HERO */}
      <div style={{ padding: '32px 18px 0', position: 'relative' }}>
        {/* eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 99,
          background: P.accentSoft, color: P.accent,
          fontFamily: LV2_FONT.mono, fontSize: 10, fontWeight: 700,
          letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 22,
        }}>
          <V2Icon name="leaf" size={11} color={P.accent}/>
          Hecho en Chile · 100% local
        </div>

        <h1 style={{
          fontFamily: LV2_FONT.display, fontWeight: 900,
          fontSize: 46, lineHeight: 0.92,
          letterSpacing: -2, margin: 0,
          color: P.primaryInk, textWrap: 'balance',
        }}>
          Tu casa.<br/>
          Tu pega.<br/>
          <span style={{
            backgroundImage: P.grad,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent', fontStyle: 'italic', fontWeight: 800,
          }}>Tu maestro.</span>
        </h1>

        <p style={{
          fontSize: 15.5, lineHeight: 1.5,
          color: P.primaryInk, opacity: 0.75,
          margin: '20px 0 0', textWrap: 'pretty', maxWidth: 320,
        }}>
          Encuentra al maestro que necesitas para esa pega de la casa. Cerca tuyo, calificados, gente bacán.
        </p>
      </div>

      {/* HERO STAGED CARD — like a Polaroid */}
      <div style={{ padding: '28px 18px 0', position: 'relative' }}>
        <div style={{
          background: P.surface,
          padding: 14, paddingBottom: 56,
          boxShadow: `0 12px 30px ${P.primary}25`,
          transform: 'rotate(-1.2deg)', transformOrigin: 'center',
          borderRadius: 4,
          position: 'relative',
        }}>
          <V2Stripe height={220} label="MAESTRO EN CASA · DOMINGO" palette={P} radius={2}/>
          <div style={{
            position: 'absolute', bottom: 12, left: 0, right: 0,
            textAlign: 'center',
            fontFamily: LV2_FONT.mono, fontSize: 11, fontWeight: 700,
            color: P.primaryDeep, letterSpacing: 0.4,
          }}>
            Don José · Carpintero · La Florida
          </div>
        </div>

        {/* tape */}
        <div style={{
          position: 'absolute', top: 18, left: 30, width: 60, height: 22,
          background: `${P.accent}40`, transform: 'rotate(-12deg)',
          border: `1px solid ${P.accent}30`,
        }}/>
      </div>

      {/* CTAs */}
      <div style={{ padding: '32px 18px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={{
          height: 58, borderRadius: 999, border: 'none',
          backgroundImage: P.grad, color: '#fff',
          fontWeight: 800, fontSize: 15.5, fontFamily: LV2_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          letterSpacing: -0.2, boxShadow: `0 10px 24px ${P.primary}33`,
        }}>
          <V2Icon name="search" size={17} color="#fff"/>
          Buscar un maestro
        </button>
        <button style={{
          height: 58, borderRadius: 999,
          background: P.surface, color: P.primaryDeep,
          border: `1.5px solid ${P.primary}50`,
          fontWeight: 800, fontSize: 15.5, fontFamily: LV2_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          letterSpacing: -0.2,
        }}>
          <V2Icon name="plus" size={17} color={P.primaryDeep}/>
          Publicar mi pololito
        </button>
      </div>

      {/* TRUST CHIPS */}
      <div style={{
        padding: '20px 18px 0',
        display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {[
          { i: 'star', t: '4.8★', s: P.primary },
          { i: 'pin', t: 'Cerca tuyo', s: P.accent },
          { i: 'clock', t: 'Al tiro', s: P.primary },
        ].map((c) => (
          <div key={c.t} style={{
            background: P.surface, border: `1px solid ${P.border}`, borderRadius: 99,
            padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 700, color: P.primaryInk,
          }}>
            <V2Icon name={c.i} size={12} color={c.s}/>
            {c.t}
          </div>
        ))}
      </div>

      {/* TESTIMONIAL — quote with avatar */}
      <div style={{ padding: '36px 18px 0' }}>
        <div style={{
          background: P.surface, borderRadius: 22, padding: 22,
          border: `1px solid ${P.border}`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -12, left: 22,
            fontFamily: LV2_FONT.display, fontSize: 60, fontWeight: 900,
            color: P.primary, lineHeight: 0.5,
          }}>"</div>
          <p style={{
            fontFamily: LV2_FONT.display, fontSize: 18, lineHeight: 1.35,
            color: P.primaryInk, margin: '14px 0 18px', fontWeight: 600,
            letterSpacing: -0.5, textWrap: 'pretty',
          }}>
            Encontré gasfiter un domingo en la tarde. Me arregló el califont en 40 min. Bacán el maestro.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              backgroundImage: P.grad, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, fontFamily: LV2_FONT.display,
            }}>MG</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: P.primaryInk, fontFamily: LV2_FONT.display }}>María González</div>
              <div style={{ fontSize: 11, color: P.primaryInk, opacity: 0.6 }}>Antofagasta · Cliente</div>
            </div>
            <div style={{
              marginLeft: 'auto',
              display: 'flex', gap: 2,
            }}>
              {[1,2,3,4,5].map(i => <V2Icon key={i} name="star" size={11} color="#F59E0B"/>)}
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS — accordion-feel cards */}
      <div style={{ padding: '36px 18px 0' }}>
        <V2Mono color={P.primary}>02 · Cómo funciona</V2Mono>
        <h2 style={{
          fontFamily: LV2_FONT.display, fontSize: 30, fontWeight: 900,
          letterSpacing: -1.4, margin: '8px 0 18px', lineHeight: 0.95,
          color: P.primaryInk, textWrap: 'balance',
        }}>
          Cuatro pasitos<br/>
          <span style={{ fontStyle: 'italic', fontWeight: 500, color: P.accent }}>y listo el pollo.</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { n: '01', t: 'Cuéntanos qué necesitas', d: 'Publica tu pololito o busca maestros directo.', icon: 'chat' },
            { n: '02', t: 'Conecta con un maestro', d: 'Conversen por chat, sin intermediarios.', icon: 'phone' },
            { n: '03', t: 'Coordinen el trabajo', d: 'Visita, presupuesto, fecha. Todo claro.', icon: 'home' },
            { n: '04', t: 'Califica y ayuda a otros', d: 'Tu reseña ayuda a la comunidad.', icon: 'star' },
          ].map((s, i) => (
            <div key={s.n} style={{
              background: P.surface, borderRadius: 18, padding: '18px 20px',
              border: `1px solid ${P.border}`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: i === 1 ? P.accentSoft : P.primarySoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <V2Icon name={s.icon} size={20} color={i === 1 ? P.accent : P.primaryDeep}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: LV2_FONT.mono, fontSize: 9, fontWeight: 700, color: P.primary, letterSpacing: 0.5 }}>PASO {s.n}</div>
                <div style={{ fontFamily: LV2_FONT.display, fontWeight: 800, fontSize: 14.5, color: P.primaryInk, marginTop: 2, letterSpacing: -0.3 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: P.primaryInk, opacity: 0.65, marginTop: 3, lineHeight: 1.4 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ padding: '36px 18px 0' }}>
        <V2Mono color={P.primary}>03 · Oficios</V2Mono>
        <h2 style={{
          fontFamily: LV2_FONT.display, fontSize: 30, fontWeight: 900,
          letterSpacing: -1.4, margin: '8px 0 16px', color: P.primaryInk, lineHeight: 1,
        }}>Para todo tipo de pega.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { icon: 'plug', name: 'Electricistas' },
            { icon: 'wrench', name: 'Gasfiteres' },
            { icon: 'hammer', name: 'Construcción' },
            { icon: 'home', name: 'Carpinteros' },
            { icon: 'roof', name: 'Techumbre' },
            { icon: 'paint', name: 'Pintores' },
          ].map((c, i) => (
            <div key={c.name} style={{
              padding: '16px 14px', borderRadius: 16,
              background: P.surface, border: `1px solid ${P.border}`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: P.primarySoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <V2Icon name={c.icon} size={18} color={P.primaryDeep}/>
              </div>
              <div style={{ fontFamily: LV2_FONT.display, fontWeight: 800, fontSize: 13, color: P.primaryInk, letterSpacing: -0.2 }}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUST */}
      <div style={{ padding: '36px 18px 0' }}>
        <div style={{
          background: P.accent, color: '#fff', borderRadius: 24,
          padding: 24, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -30, bottom: -30,
            width: 140, height: 140, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}/>
          <V2Mono color="rgba(255,255,255,0.7)">04 · Confianza</V2Mono>
          <h2 style={{
            fontFamily: LV2_FONT.display, fontSize: 28, fontWeight: 900,
            letterSpacing: -1.2, margin: '8px 0 16px', lineHeight: 0.95,
            position: 'relative',
          }}>
            Como recomendación<br/>
            <span style={{ fontStyle: 'italic', fontWeight: 500, color: P.primarySoft }}>de la familia.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
            {[
              'Calificaciones reales de clientes',
              'Historial de pegas visible',
              'Contacto seguro dentro de la app',
            ].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, fontWeight: 600 }}>
                <V2Icon name="check" size={14} color={P.primarySoft} stroke={2.4}/>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: '36px 18px 0' }}>
        <h2 style={{
          fontFamily: LV2_FONT.display, fontSize: 36, fontWeight: 900,
          letterSpacing: -1.6, margin: '0 0 6px', textAlign: 'center', lineHeight: 0.95,
          color: P.primaryInk, textWrap: 'balance',
        }}>
          Empieza{' '}
          <span style={{
            backgroundImage: P.grad,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent', fontStyle: 'italic',
          }}>al tiro.</span>
        </h2>
        <p style={{
          fontSize: 13.5, color: P.primaryInk, opacity: 0.65, margin: '8px 0 22px',
          textAlign: 'center',
        }}>Es gratis. Sin tarjeta. Sin compromiso.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={{
            height: 56, borderRadius: 999, border: 'none',
            backgroundImage: P.grad, color: '#fff',
            fontWeight: 800, fontSize: 15, fontFamily: LV2_FONT.display,
          }}>Buscar maestro</button>
          <button style={{
            height: 56, borderRadius: 999,
            background: P.surface, color: P.primaryDeep,
            border: `1.5px solid ${P.primary}50`,
            fontWeight: 800, fontSize: 15, fontFamily: LV2_FONT.display,
          }}>Publicar trabajo</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: '36px 18px 24px' }}>
        <V2Wordmark palette={P} size={13}/>
        <p style={{ fontSize: 11, lineHeight: 1.6, color: P.primaryInk, opacity: 0.65, marginTop: 12 }}>
          POLOLITOTRABAJOS es <b>solo intermediaria</b>. No garantizamos calidad ni respondemos por incumplimientos, pagos o resultados. Cada usuario es responsable de sus acuerdos. Revisa calificaciones antes de contratar.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11, fontWeight: 700, color: P.primary }}>
          <span>Términos</span><span>Privacidad</span><span>Soporte</span>
        </div>
      </div>
    </V2Phone>
  );
}

window.LandingCobre = LandingCobre;
window.LandingHormigon = LandingHormigon;
window.LandingTerracota = LandingTerracota;
