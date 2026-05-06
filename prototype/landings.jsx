/* global React */
// POLOLITOTRABAJOS — Landing pages (3 variants)
// Mobile-first, designed at 380px wide, ~1100-1500px tall artboards.

const { useState, useEffect, useRef } = React;

const PALETTES = window.PT_PALETTES;
const L = window.PT_LIGHT;

/* =========================================================
 * SHARED PIECES
 * ========================================================= */

function Wordmark({ palette = 'duo', size = 18 }) {
  const p = PALETTES[palette];
  return (
    <span style={{
      fontFamily: window.PT_FONT.display,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: -0.6,
      backgroundImage: p.grad,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      lineHeight: 1,
    }}>
      pololito<span style={{ fontWeight: 500, opacity: 0.65 }}>trabajos</span>
    </span>
  );
}

function MonoLabel({ children, color = L.inkMuted, size = 10 }) {
  return (
    <span style={{
      fontFamily: window.PT_FONT.mono,
      fontSize: size,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color,
      fontWeight: 600,
    }}>{children}</span>
  );
}

// Striped placeholder (per default aesthetic)
function StripePlaceholder({ width = '100%', height = 200, label, palette, radius = 16, mono = true }) {
  const p = PALETTES[palette || 'duo'];
  return (
    <div style={{
      width, height, borderRadius: radius,
      backgroundImage: `repeating-linear-gradient(135deg, ${p.primarySoft} 0 12px, ${p.primary}14 12px 24px)`,
      border: `1px solid ${p.primarySoft}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {label && (
        <span style={{
          fontFamily: mono ? window.PT_FONT.mono : window.PT_FONT.display,
          fontSize: 10,
          letterSpacing: 0.7,
          textTransform: 'uppercase',
          color: p.primaryDeep,
          background: 'rgba(255,255,255,0.85)',
          padding: '6px 10px',
          borderRadius: 6,
          fontWeight: 600,
        }}>{label}</span>
      )}
    </div>
  );
}

// Phone shell — common to all 3, 380×variable height
function PhoneShell({ children, height, bg = '#FAFAF8' }) {
  return (
    <div style={{
      width: 380,
      height,
      background: bg,
      fontFamily: window.PT_FONT.body,
      color: L.ink,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* status bar */}
      <div style={{
        height: 28, padding: '0 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 11, fontWeight: 700, color: L.ink,
      }}>
        <span>9:41</span>
        <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ width: 14, height: 8, border: `1.2px solid ${L.ink}`, borderRadius: 2, position: 'relative' }}>
            <span style={{ position: 'absolute', inset: 1, background: L.ink, width: '70%' }}/>
          </span>
        </span>
      </div>
      {children}
    </div>
  );
}

function Icon({ name, size = 18, color = 'currentColor', stroke = 1.8 }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth: stroke,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'send': return <svg {...props}><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4z"/></svg>;
    case 'star': return <svg {...props} fill={color}><path d="M12 2l3 7 7 .8-5.2 4.8L18 22l-6-3.5L6 22l1.2-7.4L2 9.8 9 9z"/></svg>;
    case 'pin': return <svg {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case 'zap': return <svg {...props} fill={color}><path d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>;
    case 'shield': return <svg {...props}><path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5z"/><path d="m9 12 2 2 4-4"/></svg>;
    case 'check': return <svg {...props}><path d="m5 12 5 5 9-11"/></svg>;
    case 'x': return <svg {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case 'menu': return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'plug': return <svg {...props}><path d="M9 2v6M15 2v6"/><path d="M7 8h10v4a5 5 0 0 1-10 0z"/><path d="M12 17v5"/></svg>;
    case 'wrench': return <svg {...props}><path d="M14 6 8.5 11.5 3 6l5.5-5.5z" opacity=".0"/><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.7-1.7-1.6-1.7z"/></svg>;
    case 'hammer': return <svg {...props}><path d="m15 12-8 8-3-3 8-8"/><path d="m17 6 3 3-6 6-3-3z"/><path d="m17 6 4-4"/></svg>;
    case 'home': return <svg {...props}><path d="m3 11 9-8 9 8v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/></svg>;
    case 'paint': return <svg {...props}><path d="M19 11V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3M3 11h18v3H3z"/><path d="M12 14v8"/></svg>;
    case 'roof': return <svg {...props}><path d="m2 12 10-8 10 8"/><path d="M5 10v10h14V10"/></svg>;
    case 'phone': return <svg {...props}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.7 2z"/></svg>;
    case 'chat': return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'clock': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'sparkles': return <svg {...props}><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></svg>;
    default: return null;
  }
}

/* =========================================================
 * VARIANT 1 — "FUEGO" — bold orange, editorial type
 * ========================================================= */

function LandingFuego() {
  const P = PALETTES.naranja;
  return (
    <PhoneShell height={1480} bg="#FFFCFA">
      {/* NAV */}
      <div style={{ padding: '6px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Wordmark palette="naranja" size={17}/>
        <button style={{
          background: 'transparent', border: `1.5px solid ${L.ink}20`,
          padding: '8px 14px', borderRadius: 99, fontWeight: 700, fontSize: 12,
          fontFamily: window.PT_FONT.body, color: L.ink,
        }}>Iniciar sesión</button>
      </div>

      {/* HERO */}
      <div style={{ padding: '28px 18px 24px', position: 'relative' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 99,
          background: P.primarySoft, color: P.primaryDeep,
          fontFamily: window.PT_FONT.mono, fontSize: 10, letterSpacing: 0.6,
          textTransform: 'uppercase', fontWeight: 700, marginBottom: 18,
        }}>
          <Icon name="zap" size={11} color={P.primaryDeep}/>
          Hecho en Chile · Para Chile
        </div>

        <h1 style={{
          fontFamily: window.PT_FONT.display,
          fontSize: 44, lineHeight: 0.95,
          fontWeight: 900,
          letterSpacing: -1.8,
          margin: 0,
          color: L.ink,
          textWrap: 'balance',
        }}>
          Maestros<br/>
          <span style={{
            backgroundImage: P.grad,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent',
          }}>confiables</span><br/>
          al tiro.
        </h1>

        <p style={{
          fontSize: 15, lineHeight: 1.45,
          color: L.inkSoft, margin: '14px 0 22px',
          textWrap: 'pretty', maxWidth: 320,
        }}>
          Publica tu pololito o contacta maestros cerca tuyo. Rápido, simple y directo.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={{
            height: 56, borderRadius: 16, border: 'none',
            backgroundImage: P.gradStrong, color: '#fff',
            fontFamily: window.PT_FONT.display, fontWeight: 800, fontSize: 15.5,
            letterSpacing: -0.2,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 22px', boxShadow: `0 12px 28px ${P.primary}40`,
          }}>
            <span>Buscar un maestro</span>
            <Icon name="arrow-right" size={18} color="#fff"/>
          </button>
          <button style={{
            height: 56, borderRadius: 16,
            border: `1.5px solid ${L.ink}`, background: '#fff', color: L.ink,
            fontFamily: window.PT_FONT.display, fontWeight: 800, fontSize: 15.5,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 22px',
          }}>
            <span>Publicar trabajo</span>
            <Icon name="plus" size={18} color={L.ink}/>
          </button>
        </div>

        {/* Trust row */}
        <div style={{
          marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}>
          {[
            { icon: 'star', label: 'Calificados', sub: '4.8★ promedio' },
            { icon: 'pin', label: 'Cerca tuyo', sub: 'Tu comuna' },
            { icon: 'clock', label: 'Al tiro', sub: '< 2hrs' },
          ].map((t, i) => (
            <div key={i} style={{
              padding: '12px 10px', borderRadius: 14,
              background: '#fff', border: `1px solid ${L.border}`,
              textAlign: 'center',
            }}>
              <Icon name={t.icon} size={16} color={P.primary}/>
              <div style={{ fontSize: 11, fontWeight: 800, marginTop: 6, color: L.ink }}>{t.label}</div>
              <div style={{ fontSize: 9.5, color: L.inkMuted, marginTop: 2, fontFamily: window.PT_FONT.mono }}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HERO IMAGE — placeholder */}
      <div style={{ padding: '0 18px 28px' }}>
        <StripePlaceholder height={220} label="MAESTRO TRABAJANDO" palette="naranja" radius={20}/>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: '24px 18px', background: P.primarySoft + '60' }}>
        <MonoLabel color={P.primaryDeep}>03 · Cómo funciona</MonoLabel>
        <h2 style={{
          fontFamily: window.PT_FONT.display, fontSize: 28, fontWeight: 900,
          letterSpacing: -1, margin: '6px 0 18px', lineHeight: 1.05,
        }}>
          Dos caminos.<br/>Uno tu pinta.
        </h2>

        {/* Cliente column */}
        <div style={{ background: '#fff', borderRadius: 18, padding: 18, marginBottom: 12, border: `1px solid ${L.border}` }}>
          <MonoLabel color={P.primary}>Para clientes</MonoLabel>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Publica tu necesidad', 'Recibe respuestas o busca tú', 'Contacta y coordina', 'Califica el trabajo'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: P.primarySoft, color: P.primaryDeep,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: window.PT_FONT.mono, fontWeight: 800, fontSize: 12,
                }}>{i+1}</div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: L.ink }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maestro column */}
        <div style={{ background: L.ink, color: '#fff', borderRadius: 18, padding: 18 }}>
          <MonoLabel color={P.accent}>Para maestros</MonoLabel>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Crea tu perfil', 'Recibe solicitudes', 'Acepta contactos', 'Gana pegas'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  backgroundImage: P.grad,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: window.PT_FONT.mono, fontWeight: 800, fontSize: 12, color: '#fff',
                }}>{i+1}</div>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ padding: '28px 18px' }}>
        <MonoLabel>04 · Categorías</MonoLabel>
        <h2 style={{
          fontFamily: window.PT_FONT.display, fontSize: 26, fontWeight: 900,
          letterSpacing: -1, margin: '6px 0 16px',
        }}>Para todo pololito.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { icon: 'plug', name: 'Electricista' },
            { icon: 'wrench', name: 'Gasfitería' },
            { icon: 'hammer', name: 'Construcción' },
            { icon: 'home', name: 'Carpintería' },
            { icon: 'roof', name: 'Techumbre' },
            { icon: 'paint', name: 'Pintura' },
          ].map((c) => (
            <div key={c.name} style={{
              padding: 14, borderRadius: 14,
              background: '#fff', border: `1px solid ${L.border}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: P.primarySoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={c.icon} size={18} color={P.primaryDeep}/>
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, color: L.ink }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TRUST */}
      <div style={{ padding: '20px 18px 28px' }}>
        <div style={{
          backgroundImage: P.grad, color: '#fff', borderRadius: 22,
          padding: 22, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -30, top: -30,
            width: 140, height: 140, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
          }}/>
          <MonoLabel color="rgba(255,255,255,0.8)">Confianza</MonoLabel>
          <h2 style={{
            fontFamily: window.PT_FONT.display, fontSize: 28, fontWeight: 900,
            letterSpacing: -1, margin: '6px 0 14px', lineHeight: 1, position: 'relative',
          }}>
            Más confianza,<br/>menos riesgo.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
            {['Calificaciones de otros clientes', 'Historial de trabajos visible', 'Contacto dentro de la app'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, fontWeight: 600 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 7, background: 'rgba(255,255,255,0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Icon name="check" size={13} color="#fff" stroke={2.4}/></div>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: '8px 18px 28px' }}>
        <h2 style={{
          fontFamily: window.PT_FONT.display, fontSize: 32, fontWeight: 900,
          letterSpacing: -1.2, margin: '0 0 14px', textAlign: 'center', lineHeight: 1,
        }}>Empieza al tiro.</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={{
            height: 52, borderRadius: 14, border: 'none',
            backgroundImage: P.gradStrong, color: '#fff',
            fontWeight: 800, fontSize: 14.5,
            fontFamily: window.PT_FONT.display,
          }}>Buscar maestro</button>
          <button style={{
            height: 52, borderRadius: 14,
            border: `1.5px solid ${L.ink}20`, background: '#fff', color: L.ink,
            fontWeight: 800, fontSize: 14.5,
            fontFamily: window.PT_FONT.display,
          }}>Publicar trabajo</button>
        </div>
      </div>

      {/* FOOTER LEGAL */}
      <div style={{ padding: '16px 18px 28px', background: L.bgAlt }}>
        <MonoLabel size={9}>Términos resumidos</MonoLabel>
        <p style={{ fontSize: 11, lineHeight: 1.55, color: L.inkSoft, marginTop: 10 }}>
          POLOLITOTRABAJOS es <b>solo intermediaria</b> entre usuarios y maestros. No garantiza la calidad de los trabajos ni se responsabiliza por incumplimientos, pagos o resultados. Cada usuario es responsable de sus acuerdos. Te recomendamos revisar calificaciones antes de contratar.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 11, fontWeight: 700, color: L.inkSoft }}>
          <span>Términos</span>
          <span>Privacidad</span>
          <span>Soporte</span>
        </div>
      </div>
    </PhoneShell>
  );
}

/* =========================================================
 * VARIANT 2 — "POLOLO" — violeta, soft minimal, big cards
 * ========================================================= */

function LandingPololo() {
  const P = PALETTES.violeta;
  return (
    <PhoneShell height={1520} bg="#F5F3FA">
      {/* NAV */}
      <div style={{ padding: '6px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Wordmark palette="violeta" size={17}/>
        <button style={{
          width: 40, height: 40, borderRadius: 12,
          background: '#fff', border: `1px solid ${L.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="menu" size={18} color={L.ink}/>
        </button>
      </div>

      {/* HERO — gradient card */}
      <div style={{ padding: '18px 14px 0' }}>
        <div style={{
          backgroundImage: P.grad,
          borderRadius: 28,
          padding: '26px 22px 0',
          position: 'relative', overflow: 'hidden',
          color: '#fff',
        }}>
          {/* deco circles */}
          <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }}/>
          <div style={{ position: 'absolute', left: -30, bottom: 80, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 99,
            background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)',
            fontFamily: window.PT_FONT.mono, fontSize: 9.5, letterSpacing: 0.6,
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 18,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#86EFAC' }}/>
            234 maestros conectados ahora
          </div>

          <h1 style={{
            fontFamily: window.PT_FONT.display,
            fontSize: 36, lineHeight: 1, fontWeight: 800,
            letterSpacing: -1.4, margin: 0, textWrap: 'balance',
          }}>
            Encuentra maestros confiables en minutos.
          </h1>

          <p style={{
            fontSize: 14.5, lineHeight: 1.5,
            opacity: 0.92, margin: '14px 0 22px',
            textWrap: 'pretty',
          }}>
            Publica tu pololito o busca al maestro perfecto. Cerca tuyo, calificados, al tiro.
          </p>

          {/* mock search */}
          <div style={{
            background: '#fff', borderRadius: 16, padding: 6,
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 14px 30px rgba(0,0,0,0.18)',
            marginBottom: 22,
          }}>
            <div style={{
              flex: 1, paddingLeft: 12, color: L.inkMuted,
              fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Icon name="search" size={16} color={L.inkMuted}/>
              ¿Qué necesitas arreglar?
            </div>
            <button style={{
              height: 40, padding: '0 18px', borderRadius: 12, border: 'none',
              backgroundImage: P.gradStrong, color: '#fff',
              fontWeight: 800, fontSize: 13, fontFamily: window.PT_FONT.display,
            }}>Buscar</button>
          </div>

          {/* phone preview placeholder */}
          <div style={{
            margin: '0 -8px',
            position: 'relative', height: 200,
          }}>
            <div style={{
              position: 'absolute', inset: '0 0 -40px 0',
              borderRadius: '20px 20px 0 0',
              background: 'rgba(255,255,255,0.95)',
              padding: 16,
              boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
            }}>
              {/* mini maestro card */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  backgroundImage: P.grad,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 16,
                  fontFamily: window.PT_FONT.display,
                }}>JC</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: L.ink, fontFamily: window.PT_FONT.display }}>Juan Carrasco</div>
                  <div style={{ fontSize: 10, color: L.inkMuted, marginTop: 2 }}>Gasfiter · Calama</div>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  background: L.bgAlt, padding: '3px 7px', borderRadius: 6,
                }}>
                  <Icon name="star" size={10} color="#F59E0B"/>
                  <span style={{ fontSize: 10, fontWeight: 800, color: L.ink }}>4.9</span>
                </div>
              </div>
              <div style={{
                fontSize: 11, color: L.inkSoft, marginBottom: 10,
              }}>"Juan me arregló el califont al tiro un domingo. Bacán."</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{
                  flex: 1, height: 32, borderRadius: 9, border: `1.2px solid ${L.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  fontSize: 11, fontWeight: 700, color: L.ink,
                }}><Icon name="phone" size={11} color={L.ink}/> Llamar</div>
                <div style={{
                  flex: 1, height: 32, borderRadius: 9,
                  backgroundImage: P.gradStrong, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  fontSize: 11, fontWeight: 800,
                }}>Contactar</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTAs primary */}
      <div style={{ padding: '24px 18px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={{
          height: 56, borderRadius: 16, border: 'none',
          backgroundImage: P.gradStrong, color: '#fff',
          fontWeight: 800, fontSize: 15, fontFamily: window.PT_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px', boxShadow: `0 10px 24px ${P.primary}30`,
        }}>
          <span>Buscar un maestro</span>
          <Icon name="arrow-right" size={18} color="#fff"/>
        </button>
        <button style={{
          height: 56, borderRadius: 16,
          background: '#fff', border: `1.5px solid ${P.primarySoft}`, color: P.primaryDeep,
          fontWeight: 800, fontSize: 15, fontFamily: window.PT_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px',
        }}>
          <span>Publicar trabajo</span>
          <Icon name="plus" size={18} color={P.primaryDeep}/>
        </button>
      </div>

      {/* TRUST CHIPS */}
      <div style={{ padding: '12px 18px 28px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { i: 'star', t: '4.8★ promedio' },
          { i: 'pin', t: 'Cerca tuyo' },
          { i: 'zap', t: 'Respuesta < 2h' },
        ].map((c) => (
          <div key={c.t} style={{
            background: '#fff', border: `1px solid ${L.border}`, borderRadius: 99,
            padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 700, color: L.ink,
          }}>
            <Icon name={c.i} size={12} color={P.primary}/>
            {c.t}
          </div>
        ))}
      </div>

      {/* PROBLEM VS SOLUTION */}
      <div style={{ padding: '8px 14px 28px' }}>
        <div style={{ padding: '0 4px 14px' }}>
          <MonoLabel color={P.primary}>02 · Por qué PT</MonoLabel>
          <h2 style={{
            fontFamily: window.PT_FONT.display, fontSize: 28, fontWeight: 800,
            letterSpacing: -1, margin: '6px 0 0', lineHeight: 1.05,
          }}>De buscar a ciegas a contratar tranqui.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          <div style={{
            background: '#fff', borderRadius: 18, padding: 18, border: `1px solid ${L.border}`,
          }}>
            <MonoLabel color={L.red}>Antes</MonoLabel>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {['Buscar a ciegas en grupos de Facebook', 'No saber si el maestro es confiable', 'Precios poco claros, sustos al final'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: L.inkSoft }}>
                  <Icon name="x" size={13} color={L.red}/>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div style={{
            background: P.primarySoft + '70', borderRadius: 18, padding: 18,
            border: `1.5px solid ${P.primarySoft}`,
          }}>
            <MonoLabel color={P.primaryDeep}>Con POLOLITOTRABAJOS</MonoLabel>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {['Perfiles con calificaciones reales', 'Contacto directo, sin intermediarios', 'Maestros de tu comuna, al tiro'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: P.primaryInk, fontWeight: 600 }}>
                  <Icon name="check" size={13} color={P.primaryDeep} stroke={2.6}/>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: '8px 18px 24px' }}>
        <MonoLabel color={P.primary}>03 · Cómo funciona</MonoLabel>
        <h2 style={{
          fontFamily: window.PT_FONT.display, fontSize: 26, fontWeight: 800,
          letterSpacing: -1, margin: '6px 0 16px',
        }}>Cuatro pasos. Un pololito listo.</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { n: '01', t: 'Publica o busca', d: 'Cuenta qué necesitas o explora maestros cerca tuyo.' },
            { n: '02', t: 'Conecta', d: 'Contacta directo. El maestro responde por chat.' },
            { n: '03', t: 'Coordina', d: 'Definen visita, presupuesto y fecha. Sin vueltas.' },
            { n: '04', t: 'Califica', d: 'Termina el pololito y ayudas a otros con tu reseña.' },
          ].map((s) => (
            <div key={s.n} style={{
              background: '#fff', borderRadius: 16, padding: '14px 16px',
              border: `1px solid ${L.border}`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span style={{
                fontFamily: window.PT_FONT.mono, fontWeight: 800, fontSize: 22,
                color: P.primary, letterSpacing: -0.5, minWidth: 36,
              }}>{s.n}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: window.PT_FONT.display, fontWeight: 800, fontSize: 14, color: L.ink }}>{s.t}</div>
                <div style={{ fontSize: 12, color: L.inkMuted, marginTop: 2, lineHeight: 1.4 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ padding: '14px 18px 28px' }}>
        <MonoLabel color={P.primary}>04 · Categorías</MonoLabel>
        <h2 style={{
          fontFamily: window.PT_FONT.display, fontSize: 26, fontWeight: 800,
          letterSpacing: -1, margin: '6px 0 14px',
        }}>Para todo tipo de pega.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { icon: 'plug', name: 'Eléctrico' },
            { icon: 'wrench', name: 'Gasfiter' },
            { icon: 'hammer', name: 'Construcción' },
            { icon: 'home', name: 'Carpintería' },
            { icon: 'roof', name: 'Techumbre' },
            { icon: 'paint', name: 'Pintura' },
          ].map((c) => (
            <div key={c.name} style={{
              padding: '14px 8px', borderRadius: 14,
              background: '#fff', border: `1px solid ${L.border}`,
              textAlign: 'center',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundImage: P.grad, margin: '0 auto 8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={c.icon} size={18} color="#fff"/>
              </div>
              <div style={{ fontWeight: 700, fontSize: 11.5, color: L.ink }}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: '8px 18px 28px' }}>
        <div style={{
          backgroundImage: P.grad, borderRadius: 22, padding: '24px 22px',
          color: '#fff', textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: window.PT_FONT.display, fontSize: 28, fontWeight: 900,
            letterSpacing: -1, margin: '0 0 6px', lineHeight: 1,
          }}>Empieza ahora.</h2>
          <p style={{ fontSize: 13, opacity: 0.9, margin: '0 0 18px' }}>Es gratis y toma menos de 2 min.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{
              height: 50, borderRadius: 13, border: 'none',
              background: '#fff', color: P.primaryDeep,
              fontWeight: 800, fontSize: 14, fontFamily: window.PT_FONT.display,
            }}>Buscar maestro</button>
            <button style={{
              height: 50, borderRadius: 13,
              background: 'transparent', border: `1.5px solid rgba(255,255,255,0.5)`, color: '#fff',
              fontWeight: 800, fontSize: 14, fontFamily: window.PT_FONT.display,
            }}>Publicar trabajo</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: '16px 18px 28px' }}>
        <Wordmark palette="violeta" size={14}/>
        <p style={{ fontSize: 11, lineHeight: 1.55, color: L.inkSoft, marginTop: 12 }}>
          Somos <b>solo intermediaria</b> entre clientes y maestros. No garantizamos calidad ni respondemos por incumplimientos, pagos o resultados. Cada usuario es responsable de sus acuerdos. Revisa calificaciones antes de contratar.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11, fontWeight: 700, color: L.inkMuted }}>
          <span>Términos</span>
          <span>Privacidad</span>
          <span>Soporte</span>
        </div>
      </div>
    </PhoneShell>
  );
}

/* =========================================================
 * VARIANT 3 — "ATARDECER" — duo gradient, premium, big imagery
 * Per user's "asi:" — the duo-gradient palette they liked.
 * ========================================================= */

function LandingAtardecer() {
  const P = PALETTES.duo;
  return (
    <PhoneShell height={1500} bg="#FDF8F4">
      {/* NAV */}
      <div style={{ padding: '6px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Wordmark palette="duo" size={17}/>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            height: 36, padding: '0 14px', borderRadius: 99,
            background: 'transparent', border: 'none',
            fontWeight: 700, fontSize: 12, color: L.ink,
          }}>Entrar</button>
          <button style={{
            height: 36, padding: '0 14px', borderRadius: 99,
            backgroundImage: P.gradStrong, color: '#fff', border: 'none',
            fontWeight: 800, fontSize: 12,
          }}>Registrar</button>
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: '24px 18px 0', position: 'relative' }}>
        {/* Eyebrow with avatars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ display: 'flex' }}>
            {['#FF6B35', '#9333EA', '#7C3AED'].map((c, i) => (
              <div key={i} style={{
                width: 24, height: 24, borderRadius: '50%',
                background: c, border: '2px solid #FDF8F4',
                marginLeft: i === 0 ? 0 : -8,
              }}/>
            ))}
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: L.inkSoft, fontFamily: window.PT_FONT.mono, letterSpacing: 0.4 }}>
            +1.240 maestros activos
          </span>
        </div>

        <h1 style={{
          fontFamily: window.PT_FONT.display,
          fontSize: 48, lineHeight: 0.92,
          fontWeight: 900,
          letterSpacing: -2.2,
          margin: 0,
          textWrap: 'balance',
          color: L.ink,
        }}>
          Tu próximo<br/>
          <span style={{
            backgroundImage: P.grad,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent',
            fontStyle: 'italic',
            fontWeight: 800,
          }}>pololito</span><br/>
          empieza acá.
        </h1>

        <p style={{
          fontSize: 15.5, lineHeight: 1.5,
          color: L.inkSoft, margin: '18px 0 0',
          textWrap: 'pretty', maxWidth: 320,
        }}>
          Conectamos clientes con maestros confiables de todo Chile. Rápido, simple y al tiro.
        </p>
      </div>

      {/* HERO IMAGE — large, with trust badges floating */}
      <div style={{ padding: '22px 18px 0', position: 'relative' }}>
        <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
          <StripePlaceholder height={260} label="MAESTRO TRABAJANDO · FOTO REAL" palette="duo" radius={24}/>
          {/* gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)',
            borderRadius: 24,
          }}/>

          {/* floating trust badges */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
            padding: '6px 10px', borderRadius: 99,
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          }}>
            <Icon name="star" size={11} color="#F59E0B"/>
            <span style={{ fontSize: 11, fontWeight: 800, color: L.ink }}>4.9 · Don Luis</span>
          </div>

          <div style={{
            position: 'absolute', bottom: 14, right: 14,
            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
            padding: '8px 12px', borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          }}>
            <div style={{ fontFamily: window.PT_FONT.mono, fontSize: 9, color: L.inkMuted, letterSpacing: 0.4, fontWeight: 700 }}>RESPONDIÓ EN</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: P.primaryDeep, fontFamily: window.PT_FONT.display }}>12 minutos</div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: '22px 18px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={{
          height: 58, borderRadius: 18, border: 'none',
          backgroundImage: P.grad, color: '#fff',
          fontWeight: 800, fontSize: 15.5, fontFamily: window.PT_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px',
          boxShadow: `0 14px 32px ${P.primary}33`,
          letterSpacing: -0.2,
        }}>
          <span>Buscar un maestro</span>
          <span style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="arrow-right" size={15} color="#fff"/>
          </span>
        </button>
        <button style={{
          height: 58, borderRadius: 18,
          background: '#fff', color: L.ink, border: `1.5px solid ${L.border}`,
          fontWeight: 800, fontSize: 15.5, fontFamily: window.PT_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px', letterSpacing: -0.2,
        }}>
          <span>Publicar trabajo</span>
          <span style={{
            width: 30, height: 30, borderRadius: 9,
            background: L.bgAlt,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="plus" size={15} color={L.ink}/>
          </span>
        </button>
      </div>

      {/* TRUST INDICATORS */}
      <div style={{
        padding: '24px 18px 28px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      }}>
        {[
          { v: '4.8★', l: 'Calificación' },
          { v: '< 2h', l: 'Respuesta' },
          { v: '+50', l: 'Comunas' },
        ].map((t) => (
          <div key={t.l} style={{ textAlign: 'center', padding: '4px 0' }}>
            <div style={{
              fontFamily: window.PT_FONT.display, fontSize: 22, fontWeight: 900,
              backgroundImage: P.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text',
              color: 'transparent', letterSpacing: -0.8,
            }}>{t.v}</div>
            <div style={{ fontSize: 10.5, color: L.inkMuted, marginTop: 2, fontFamily: window.PT_FONT.mono, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>{t.l}</div>
          </div>
        ))}
      </div>

      {/* PROBLEMA VS SOLUCIÓN — split card */}
      <div style={{ padding: '0 18px 28px' }}>
        <MonoLabel color={P.primary}>02 · Antes y después</MonoLabel>
        <h2 style={{
          fontFamily: window.PT_FONT.display, fontSize: 30, fontWeight: 900,
          letterSpacing: -1.4, margin: '6px 0 16px', lineHeight: 1, textWrap: 'balance',
        }}>De caos a calma.</h2>

        <div style={{
          background: '#fff', borderRadius: 22, overflow: 'hidden',
          border: `1px solid ${L.border}`,
        }}>
          <div style={{ padding: 18, borderBottom: `1px solid ${L.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', background: L.redSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="x" size={14} color={L.red} stroke={2.4}/>
              </span>
              <MonoLabel color={L.red}>Antes</MonoLabel>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Buscar a ciegas en redes sociales', 'No saber si confiar en el maestro', 'Precios poco claros'].map((t) => (
                <div key={t} style={{ fontSize: 13.5, color: L.inkSoft, paddingLeft: 32 }}>· {t}</div>
              ))}
            </div>
          </div>
          <div style={{
            padding: 18,
            backgroundImage: `linear-gradient(135deg, ${P.primarySoft}40 0%, transparent 100%)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', backgroundImage: P.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="check" size={13} color="#fff" stroke={2.6}/>
              </span>
              <MonoLabel color={P.primaryDeep}>Con POLOLITOTRABAJOS</MonoLabel>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Perfiles con calificaciones reales', 'Contacto directo, sin intermediarios', 'Maestros cercanos al tiro'].map((t) => (
                <div key={t} style={{ fontSize: 13.5, color: L.ink, paddingLeft: 32, fontWeight: 600 }}>· {t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES — visual grid with imagery */}
      <div style={{ padding: '0 18px 28px' }}>
        <MonoLabel color={P.primary}>03 · Categorías</MonoLabel>
        <h2 style={{
          fontFamily: window.PT_FONT.display, fontSize: 28, fontWeight: 900,
          letterSpacing: -1.2, margin: '6px 0 14px',
        }}>Cualquier pega. Ahora.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { icon: 'plug', name: 'Electricista', count: '320 maestros' },
            { icon: 'wrench', name: 'Gasfitería', count: '180 maestros' },
            { icon: 'hammer', name: 'Construcción', count: '420 maestros' },
            { icon: 'home', name: 'Carpintería', count: '210 maestros' },
            { icon: 'roof', name: 'Techumbre', count: '95 maestros' },
            { icon: 'paint', name: 'Pintura', count: '150 maestros' },
          ].map((c, i) => (
            <div key={c.name} style={{
              padding: 14, borderRadius: 16,
              background: '#fff', border: `1px solid ${L.border}`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', right: -20, top: -20,
                width: 70, height: 70, borderRadius: '50%',
                backgroundImage: P.grad, opacity: 0.08,
              }}/>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundImage: P.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <Icon name={c.icon} size={18} color="#fff"/>
              </div>
              <div style={{ fontFamily: window.PT_FONT.display, fontWeight: 800, fontSize: 13.5, color: L.ink }}>{c.name}</div>
              <div style={{ fontSize: 10.5, color: L.inkMuted, marginTop: 2, fontFamily: window.PT_FONT.mono }}>{c.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIAL bloque confianza */}
      <div style={{ padding: '0 18px 28px' }}>
        <div style={{
          background: L.ink, color: '#fff', borderRadius: 22, padding: 22,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -30, bottom: -30,
            width: 160, height: 160, borderRadius: '50%',
            backgroundImage: P.grad, opacity: 0.3, filter: 'blur(20px)',
          }}/>
          <MonoLabel color={P.accent}>04 · Confianza</MonoLabel>
          <h2 style={{
            fontFamily: window.PT_FONT.display, fontSize: 26, fontWeight: 900,
            letterSpacing: -1, margin: '6px 0 16px', lineHeight: 1, position: 'relative',
          }}>Más confianza,<br/>menos riesgo.</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
            {[
              { i: 'star', t: 'Calificaciones reales', d: 'Cada trabajo se califica por ambas partes.' },
              { i: 'shield', t: 'Historial visible', d: 'Mira pegas anteriores antes de contratar.' },
              { i: 'chat', t: 'Contacto en la app', d: 'Conversa, comparte fotos, coordina todo acá.' },
            ].map((t) => (
              <div key={t.t} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundImage: P.grad,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}><Icon name={t.i} size={16} color="#fff"/></div>
                <div>
                  <div style={{ fontFamily: window.PT_FONT.display, fontWeight: 800, fontSize: 14 }}>{t.t}</div>
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2, lineHeight: 1.4 }}>{t.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: '0 18px 28px' }}>
        <h2 style={{
          fontFamily: window.PT_FONT.display, fontSize: 38, fontWeight: 900,
          letterSpacing: -1.6, margin: '0 0 6px', textAlign: 'center', lineHeight: 1, textWrap: 'balance',
        }}>
          Empieza{' '}
          <span style={{
            backgroundImage: P.grad,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent', fontStyle: 'italic',
          }}>al tiro.</span>
        </h2>
        <p style={{
          fontSize: 14, color: L.inkSoft, margin: '0 0 18px', textAlign: 'center',
        }}>Es gratis. Toma 2 minutos. Sin compromiso.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={{
            height: 56, borderRadius: 16, border: 'none',
            backgroundImage: P.grad, color: '#fff',
            fontWeight: 800, fontSize: 15, fontFamily: window.PT_FONT.display,
            boxShadow: `0 12px 28px ${P.primary}33`,
          }}>Buscar maestro</button>
          <button style={{
            height: 56, borderRadius: 16,
            background: '#fff', color: L.ink, border: `1.5px solid ${L.border}`,
            fontWeight: 800, fontSize: 15, fontFamily: window.PT_FONT.display,
          }}>Publicar trabajo</button>
        </div>
      </div>

      {/* FOOTER LEGAL */}
      <div style={{
        padding: '20px 18px 28px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.03) 100%)',
        borderTop: `1px solid ${L.border}`,
      }}>
        <Wordmark palette="duo" size={13}/>
        <p style={{ fontSize: 11, lineHeight: 1.55, color: L.inkSoft, marginTop: 12 }}>
          POLOLITOTRABAJOS es <b>solo intermediaria</b>. No garantizamos calidad ni respondemos por incumplimientos, problemas de pago o resultados. Cada usuario es responsable de sus acuerdos. Revisa calificaciones antes de contratar.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11, fontWeight: 700, color: L.inkMuted }}>
          <span>Términos</span><span>Privacidad</span><span>Soporte</span>
          <span style={{ marginLeft: 'auto', fontFamily: window.PT_FONT.mono, fontSize: 9, opacity: 0.7 }}>v1.0</span>
        </div>
      </div>
    </PhoneShell>
  );
}

window.LandingFuego = LandingFuego;
window.LandingPololo = LandingPololo;
window.LandingAtardecer = LandingAtardecer;
