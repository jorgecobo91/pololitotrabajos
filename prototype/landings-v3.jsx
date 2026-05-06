/* global React */
// POLOLITOTRABAJOS — Landing v3 "Equilibrio"
// Sistema controlado: 70% neutros · 20% violeta · 10% naranja
// Gradiente naranja→violeta SOLO en CTA principales, hero impact, estados activos.

const LV3_FONT = window.PT_FONT;

const PALETTE_EQUILIBRIO = {
  // Tokens del sistema
  grad: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)',
  gradHorizontal: 'linear-gradient(90deg, #FF6B35 0%, #7C3AED 100%)',
  gradVertical: 'linear-gradient(180deg, #FF6B35 0%, #7C3AED 100%)',
  // Base
  violeta: '#7C3AED',
  violetaDeep: '#5B21B6',
  violetaSoft: '#EDE4FE',
  violetaInk: '#1E0E40',
  naranja: '#FF6B35',
  naranjaDeep: '#E84A1F',
  // Neutros
  bg: '#FFFFFF',
  bgAlt: '#F7F7F9',
  surface: '#FFFFFF',
  border: '#E8E6EF',
  borderStrong: '#D5D2DD',
  ink: '#0F0B1A',
  inkSoft: '#3F3A4F',
  inkMuted: '#7B7689',
  // Estados
  red: '#EF4444',
  redSoft: '#FEE2E2',
  yellow: '#FBBF24',
  green: '#10B981',
  greenSoft: '#D1FAE5',
};

function EQWordmark({ size = 17, mono = false }) {
  if (mono) {
    return (
      <span style={{
        fontFamily: LV3_FONT.display, fontWeight: 900, fontSize: size,
        letterSpacing: -0.6, lineHeight: 1, color: '#fff',
      }}>
        pololito<span style={{ fontWeight: 500, opacity: 0.7 }}>trabajos</span>
      </span>
    );
  }
  return (
    <span style={{
      fontFamily: LV3_FONT.display, fontWeight: 900, fontSize: size,
      letterSpacing: -0.6, lineHeight: 1, color: PALETTE_EQUILIBRIO.violetaDeep,
    }}>
      pololito<span style={{ fontWeight: 500, opacity: 0.6, color: PALETTE_EQUILIBRIO.violeta }}>trabajos</span>
    </span>
  );
}

function EQMono({ children, color, size = 10 }) {
  return (
    <span style={{
      fontFamily: LV3_FONT.mono, fontSize: size,
      letterSpacing: 0.7, textTransform: 'uppercase',
      color, fontWeight: 700,
    }}>{children}</span>
  );
}

function EQStripe({ height = 220, label, radius = 18 }) {
  const P = PALETTE_EQUILIBRIO;
  return (
    <div style={{
      width: '100%', height, borderRadius: radius,
      backgroundImage: `repeating-linear-gradient(135deg, ${P.violetaSoft} 0 14px, ${P.bgAlt} 14px 28px)`,
      border: `1px solid ${P.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      {label && (
        <span style={{
          fontFamily: LV3_FONT.mono, fontSize: 10, letterSpacing: 0.7,
          textTransform: 'uppercase', color: P.violetaDeep,
          background: 'rgba(255,255,255,0.92)', padding: '6px 11px',
          borderRadius: 6, fontWeight: 700,
        }}>{label}</span>
      )}
    </div>
  );
}

function EQPhone({ children, height }) {
  const P = PALETTE_EQUILIBRIO;
  return (
    <div style={{
      width: 380, height, background: P.bg,
      fontFamily: LV3_FONT.body, color: P.ink,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        height: 28, padding: '0 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 11, fontWeight: 700, color: P.ink,
      }}>
        <span>9:41</span>
        <span style={{ width: 14, height: 8, border: `1.2px solid ${P.ink}`, borderRadius: 2, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1, background: P.ink, width: '70%' }}/>
        </span>
      </div>
      {children}
    </div>
  );
}

function EQIcon({ name, size = 18, color = 'currentColor', stroke = 1.8 }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth: stroke,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
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
    default: return null;
  }
}

function LandingEquilibrio() {
  const P = PALETTE_EQUILIBRIO;
  return (
    <EQPhone height={1660}>
      {/* NAV — violeta de estructura (no gradiente) */}
      <div style={{
        padding: '8px 18px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <EQWordmark size={16}/>
        <button style={{
          background: 'transparent', border: `1px solid ${P.border}`,
          padding: '8px 14px', borderRadius: 99,
          fontWeight: 700, fontSize: 12, color: P.violetaDeep,
          fontFamily: LV3_FONT.body,
        }}>Iniciar sesión</button>
      </div>

      {/* HERO — gradiente vertical del sistema (impacto inicial) */}
      <div style={{
        margin: '8px 14px 0',
        backgroundImage: P.gradVertical,
        borderRadius: 24,
        padding: '28px 22px 24px',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        {/* sutil deco — sin sombras fuertes */}
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }}/>

        {/* eyebrow status */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 99,
          background: 'rgba(255,255,255,0.18)',
          fontFamily: LV3_FONT.mono, fontSize: 10, fontWeight: 700,
          letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 22,
          color: '#fff',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#86EFAC' }}/>
          1.240 maestros activos hoy
        </div>

        <h1 style={{
          fontFamily: LV3_FONT.display, fontWeight: 900,
          fontSize: 40, lineHeight: 0.95,
          letterSpacing: -1.8, margin: 0, textWrap: 'balance',
          color: '#fff',
        }}>
          Encuentra maestros confiables en minutos.
        </h1>

        <p style={{
          fontSize: 15, lineHeight: 1.5,
          color: 'rgba(255,255,255,0.92)', margin: '16px 0 0',
          textWrap: 'pretty',
        }}>
          Publica tu pololito o contacta maestros cerca tuyo. Rápido, simple y directo.
        </p>
      </div>

      {/* CTAs — primary CTA usa gradiente (acción clave 10%) */}
      <div style={{ padding: '20px 18px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={{
          height: 56, borderRadius: 14, border: 'none',
          backgroundImage: P.grad, color: '#fff',
          fontWeight: 800, fontSize: 15, fontFamily: LV3_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', letterSpacing: -0.2,
        }}>
          <span>Buscar un maestro</span>
          <EQIcon name="arrow-right" size={17} color="#fff"/>
        </button>
        {/* Secondary CTA — violeta sólido para estructura (no gradiente) */}
        <button style={{
          height: 56, borderRadius: 14,
          background: P.surface, color: P.violetaDeep,
          border: `1.5px solid ${P.violeta}`,
          fontWeight: 800, fontSize: 15, fontFamily: LV3_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', letterSpacing: -0.2,
        }}>
          <span>Publicar trabajo</span>
          <EQIcon name="plus" size={17} color={P.violetaDeep}/>
        </button>
      </div>

      {/* Trust indicators — neutros con acento violeta */}
      <div style={{
        margin: '20px 18px 0', padding: '14px 16px',
        background: P.bgAlt, borderRadius: 14,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
      }}>
        {[
          { i: 'star', t: 'Calificados', s: '4.8★ promedio', c: P.yellow },
          { i: 'pin', t: 'Cerca tuyo', s: 'Tu comuna', c: P.violeta },
          { i: 'clock', t: 'Al tiro', s: '< 2hrs', c: P.violeta },
        ].map((t, i) => (
          <div key={i} style={{
            textAlign: 'center', padding: '0 4px',
            borderRight: i < 2 ? `1px solid ${P.border}` : 'none',
          }}>
            <EQIcon name={t.i} size={15} color={t.c}/>
            <div style={{ fontSize: 11.5, fontWeight: 800, marginTop: 6, color: P.ink }}>{t.t}</div>
            <div style={{ fontSize: 9.5, color: P.inkMuted, marginTop: 2, fontFamily: LV3_FONT.mono, fontWeight: 600 }}>{t.s}</div>
          </div>
        ))}
      </div>

      {/* HERO IMAGE — placeholder limpio */}
      <div style={{ padding: '24px 18px 0' }}>
        <EQStripe height={220} label="MAESTRO TRABAJANDO" radius={18}/>
      </div>

      {/* TABS demo — estado activo con gradiente (10%) */}
      <div style={{ padding: '24px 18px 0' }}>
        <EQMono color={P.violeta}>02 · Cómo funciona</EQMono>
        <h2 style={{
          fontFamily: LV3_FONT.display, fontSize: 28, fontWeight: 900,
          letterSpacing: -1.2, margin: '8px 0 16px', lineHeight: 1,
          color: P.ink,
        }}>
          Dos caminos.<br/>Uno tu pinta.
        </h2>

        {/* Tab bar — el activo lleva gradiente */}
        <div style={{
          display: 'flex', gap: 0, padding: 4, borderRadius: 12,
          background: P.bgAlt, marginBottom: 16,
        }}>
          <div style={{
            flex: 1, padding: '10px 0', textAlign: 'center',
            borderRadius: 9, backgroundImage: P.grad,
            color: '#fff', fontWeight: 800, fontSize: 12.5,
            fontFamily: LV3_FONT.display,
          }}>Para clientes</div>
          <div style={{
            flex: 1, padding: '10px 0', textAlign: 'center',
            color: P.inkMuted, fontWeight: 700, fontSize: 12.5,
            fontFamily: LV3_FONT.display,
          }}>Para maestros</div>
        </div>

        {/* Steps — neutros, contención visual */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { n: '01', t: 'Publica tu necesidad', d: 'Cuéntanos qué pega necesitas. Es gratis.' },
            { n: '02', t: 'Recibe respuestas', d: 'Maestros cerca tuyo se contactan al tiro.' },
            { n: '03', t: 'Coordina y contrata', d: 'Conversen por chat, definan fecha y precio.' },
            { n: '04', t: 'Califica al maestro', d: 'Tu reseña ayuda al resto de la comunidad.' },
          ].map((s) => (
            <div key={s.n} style={{
              background: P.surface, borderRadius: 14, padding: '14px 16px',
              border: `1px solid ${P.border}`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: 10,
                background: P.violetaSoft, color: P.violetaDeep,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: LV3_FONT.mono, fontWeight: 800, fontSize: 12,
                flexShrink: 0,
              }}>{s.n}</span>
              <div>
                <div style={{ fontFamily: LV3_FONT.display, fontWeight: 800, fontSize: 14, color: P.ink, letterSpacing: -0.3 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: P.inkMuted, marginTop: 2, lineHeight: 1.4 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEMA / SOLUCIÓN */}
      <div style={{ padding: '32px 18px 0' }}>
        <EQMono color={P.violeta}>03 · Por qué PT</EQMono>
        <h2 style={{
          fontFamily: LV3_FONT.display, fontSize: 28, fontWeight: 900,
          letterSpacing: -1.2, margin: '8px 0 16px', lineHeight: 1,
          color: P.ink,
        }}>De buscar a ciegas a contratar tranqui.</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            background: P.surface, borderRadius: 14, padding: 16,
            border: `1px solid ${P.border}`,
          }}>
            <EQMono color={P.red} size={9}>Antes</EQMono>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Buscar a ciegas en redes sociales', 'No saber si el maestro es confiable', 'Precios poco claros'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: P.inkSoft }}>
                  <EQIcon name="x" size={13} color={P.red} stroke={2.2}/>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div style={{
            background: P.violetaSoft + '70', borderRadius: 14, padding: 16,
            border: `1px solid ${P.violetaSoft}`,
          }}>
            <EQMono color={P.violetaDeep} size={9}>Con POLOLITOTRABAJOS</EQMono>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Perfiles con calificaciones reales', 'Contacto directo, sin intermediarios', 'Maestros de tu comuna, al tiro'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: P.violetaInk, fontWeight: 600 }}>
                  <EQIcon name="check" size={13} color={P.violetaDeep} stroke={2.4}/>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES — neutros con icono violeta */}
      <div style={{ padding: '32px 18px 0' }}>
        <EQMono color={P.violeta}>04 · Categorías</EQMono>
        <h2 style={{
          fontFamily: LV3_FONT.display, fontSize: 28, fontWeight: 900,
          letterSpacing: -1.2, margin: '8px 0 14px', color: P.ink, lineHeight: 1,
        }}>Para todo pololito.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { icon: 'plug', name: 'Electricista', count: '320' },
            { icon: 'wrench', name: 'Gasfitería', count: '180' },
            { icon: 'hammer', name: 'Construcción', count: '420' },
            { icon: 'home', name: 'Carpintería', count: '210' },
            { icon: 'roof', name: 'Techumbre', count: '95' },
            { icon: 'paint', name: 'Pintura', count: '150' },
          ].map((c) => (
            <div key={c.name} style={{
              padding: 14, borderRadius: 14,
              background: P.surface, border: `1px solid ${P.border}`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: P.violetaSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <EQIcon name={c.icon} size={18} color={P.violetaDeep}/>
              </div>
              <div style={{ fontFamily: LV3_FONT.display, fontWeight: 800, fontSize: 13, color: P.ink, letterSpacing: -0.2 }}>{c.name}</div>
              <div style={{ fontSize: 10.5, color: P.inkMuted, marginTop: 2, fontFamily: LV3_FONT.mono, fontWeight: 600 }}>{c.count} maestros</div>
            </div>
          ))}
        </div>
      </div>

      {/* CARD MAESTRO — preview de cómo se ve un perfil (mostrar URGENTE en rojo + rating amarillo) */}
      <div style={{ padding: '32px 18px 0' }}>
        <EQMono color={P.violeta}>05 · Así se ve</EQMono>
        <h2 style={{
          fontFamily: LV3_FONT.display, fontSize: 28, fontWeight: 900,
          letterSpacing: -1.2, margin: '8px 0 14px', color: P.ink, lineHeight: 1,
        }}>Maestros con identidad.</h2>

        {/* Card maestro */}
        <div style={{
          background: P.surface, border: `1px solid ${P.border}`,
          borderRadius: 16, padding: 16,
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              backgroundImage: P.grad,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: LV3_FONT.display,
              position: 'relative',
            }}>
              JC
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 14, height: 14, borderRadius: '50%',
                background: P.green, border: `2.5px solid ${P.surface}`,
              }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: LV3_FONT.mono, fontSize: 9.5, fontWeight: 700, color: P.violeta, letterSpacing: 0.5 }}>GASFITER</div>
              <div style={{ fontFamily: LV3_FONT.display, fontWeight: 800, fontSize: 15, color: P.ink, letterSpacing: -0.3 }}>Juan Carrasco</div>
              <div style={{ fontSize: 11, color: P.inkMuted, marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                <EQIcon name="pin" size={10} color={P.inkMuted}/>
                Calama · 142 trabajos
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: P.bgAlt, padding: '4px 8px', borderRadius: 8,
            }}>
              <EQIcon name="star" size={11} color={P.yellow}/>
              <span style={{ fontSize: 12, fontWeight: 800, color: P.ink }}>4.9</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              flex: 1, height: 38, borderRadius: 10,
              background: P.surface, border: `1.2px solid ${P.border}`,
              color: P.ink, fontWeight: 700, fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <EQIcon name="phone" size={12} color={P.ink}/> Llamar
            </button>
            {/* CTA con gradiente — el momento clave */}
            <button style={{
              flex: 1.5, height: 38, borderRadius: 10,
              backgroundImage: P.grad, color: '#fff',
              border: 'none', fontWeight: 800, fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: LV3_FONT.display,
            }}>
              Contactar
            </button>
          </div>
        </div>

        {/* Pequeño badge URGENTE de ejemplo (rojo sólido como pediste) */}
        <div style={{
          marginTop: 10, display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', background: P.surface,
          border: `1px solid ${P.border}`, borderRadius: 12,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 9px', borderRadius: 6,
            background: P.redSoft, color: P.red,
            fontFamily: LV3_FONT.mono, fontSize: 9.5, fontWeight: 800,
            letterSpacing: 0.6, textTransform: 'uppercase',
          }}>
            <EQIcon name="zap" size={10} color={P.red}/>
            URGENTE
          </span>
          <span style={{ fontSize: 12, color: P.inkSoft, flex: 1 }}>Cuando una pega no puede esperar</span>
        </div>
      </div>

      {/* TRUST */}
      <div style={{ padding: '32px 18px 0' }}>
        <div style={{
          background: P.violetaInk, borderRadius: 20, padding: 24,
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          {/* sutil accent gradient — controlado */}
          <div style={{
            position: 'absolute', right: -50, bottom: -50,
            width: 180, height: 180, borderRadius: '50%',
            backgroundImage: P.grad, opacity: 0.25, filter: 'blur(30px)',
          }}/>
          <EQMono color="rgba(255,255,255,0.65)">06 · Confianza</EQMono>
          <h2 style={{
            fontFamily: LV3_FONT.display, fontSize: 28, fontWeight: 900,
            letterSpacing: -1.2, margin: '8px 0 16px', lineHeight: 0.95,
            position: 'relative', color: '#fff',
          }}>
            Más confianza,<br/>menos riesgo.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
            {[
              { i: 'star', t: 'Calificaciones reales' },
              { i: 'shield', t: 'Historial de trabajos visible' },
              { i: 'chat', t: 'Contacto dentro de la app' },
            ].map((t) => (
              <div key={t.t} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13.5, fontWeight: 600 }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <EQIcon name={t.i} size={15} color="#fff"/>
                </span>
                {t.t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: '36px 18px 0', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: LV3_FONT.display, fontSize: 36, fontWeight: 900,
          letterSpacing: -1.6, margin: '0 0 6px', lineHeight: 0.95,
          color: P.ink, textWrap: 'balance',
        }}>
          Empieza{' '}
          <span style={{
            backgroundImage: P.grad,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent',
          }}>al tiro.</span>
        </h2>
        <p style={{ fontSize: 13.5, color: P.inkMuted, margin: '8px 0 22px' }}>
          Es gratis. Toma 2 minutos. Sin compromiso.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={{
            height: 54, borderRadius: 14, border: 'none',
            backgroundImage: P.grad, color: '#fff',
            fontWeight: 800, fontSize: 15, fontFamily: LV3_FONT.display,
          }}>Buscar maestro</button>
          <button style={{
            height: 54, borderRadius: 14,
            background: P.surface, color: P.violetaDeep,
            border: `1.5px solid ${P.violeta}`,
            fontWeight: 800, fontSize: 15, fontFamily: LV3_FONT.display,
          }}>Publicar trabajo</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        margin: '36px 0 0', padding: '24px 18px',
        background: P.bgAlt, borderTop: `1px solid ${P.border}`,
      }}>
        <EQWordmark size={13}/>
        <p style={{ fontSize: 11, lineHeight: 1.6, color: P.inkSoft, marginTop: 12 }}>
          POLOLITOTRABAJOS es <b>solo intermediaria</b>. No garantizamos calidad ni respondemos por incumplimientos, pagos o resultados. Cada usuario es responsable de sus acuerdos. Revisa calificaciones antes de contratar.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11, fontWeight: 700, color: P.violeta }}>
          <span>Términos</span><span>Privacidad</span><span>Soporte</span>
        </div>
      </div>
    </EQPhone>
  );
}

window.LandingEquilibrio = LandingEquilibrio;
