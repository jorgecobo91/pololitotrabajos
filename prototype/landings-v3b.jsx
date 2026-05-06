/* global React */
// POLOLITOTRABAJOS — Landing v3 "Equilibrio Atardecer"
// Copy + estructura de la 03 Atardecer · Sistema cromático de la 07 Equilibrio
// 70% neutros · 20% violeta · 10% gradiente naranja→violeta (solo CTAs y momentos clave)

const LV3B_FONT = window.PT_FONT;

const PEA = {
  grad: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)',
  gradVertical: 'linear-gradient(180deg, #FF6B35 0%, #7C3AED 100%)',
  violeta: '#7C3AED',
  violetaDeep: '#5B21B6',
  violetaSoft: '#EDE4FE',
  violetaInk: '#1E0E40',
  naranja: '#FF6B35',
  bg: '#FFFFFF',
  bgAlt: '#F7F7F9',
  surface: '#FFFFFF',
  border: '#E8E6EF',
  ink: '#0F0B1A',
  inkSoft: '#3F3A4F',
  inkMuted: '#7B7689',
  red: '#EF4444',
  redSoft: '#FEE2E2',
  yellow: '#F59E0B',
  green: '#10B981',
};

function EAWordmark({ size = 17 }) {
  return (
    <span style={{
      fontFamily: LV3B_FONT.display, fontWeight: 900, fontSize: size,
      letterSpacing: -0.6, lineHeight: 1, color: PEA.violetaDeep,
    }}>
      pololito<span style={{ fontWeight: 500, opacity: 0.6, color: PEA.violeta }}>trabajos</span>
    </span>
  );
}

function EAMono({ children, color, size = 10 }) {
  return (
    <span style={{
      fontFamily: LV3B_FONT.mono, fontSize: size,
      letterSpacing: 0.7, textTransform: 'uppercase',
      color, fontWeight: 700,
    }}>{children}</span>
  );
}

function EAStripe({ height = 260, label, radius = 24 }) {
  return (
    <div style={{
      width: '100%', height, borderRadius: radius,
      backgroundImage: `repeating-linear-gradient(135deg, ${PEA.violetaSoft} 0 14px, ${PEA.bgAlt} 14px 28px)`,
      border: `1px solid ${PEA.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      {label && (
        <span style={{
          fontFamily: LV3B_FONT.mono, fontSize: 10, letterSpacing: 0.7,
          textTransform: 'uppercase', color: PEA.violetaDeep,
          background: 'rgba(255,255,255,0.92)', padding: '6px 11px',
          borderRadius: 6, fontWeight: 700,
        }}>{label}</span>
      )}
    </div>
  );
}

function EAPhone({ children, height }) {
  return (
    <div style={{
      width: 380, height, background: PEA.bg,
      fontFamily: LV3B_FONT.body, color: PEA.ink,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        height: 28, padding: '0 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 11, fontWeight: 700, color: PEA.ink,
      }}>
        <span>9:41</span>
        <span style={{ width: 14, height: 8, border: `1.2px solid ${PEA.ink}`, borderRadius: 2, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1, background: PEA.ink, width: '70%' }}/>
        </span>
      </div>
      {children}
    </div>
  );
}

function EAIcon({ name, size = 18, color = 'currentColor', stroke = 1.8 }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth: stroke,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'star': return <svg {...props} fill={color}><path d="M12 2l3 7 7 .8-5.2 4.8L18 22l-6-3.5L6 22l1.2-7.4L2 9.8 9 9z"/></svg>;
    case 'check': return <svg {...props}><path d="m5 12 5 5 9-11"/></svg>;
    case 'x': return <svg {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case 'shield': return <svg {...props}><path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5z"/><path d="m9 12 2 2 4-4"/></svg>;
    case 'chat': return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'plug': return <svg {...props}><path d="M9 2v6M15 2v6"/><path d="M7 8h10v4a5 5 0 0 1-10 0z"/><path d="M12 17v5"/></svg>;
    case 'wrench': return <svg {...props}><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.7-1.7-1.6-1.7z"/></svg>;
    case 'hammer': return <svg {...props}><path d="m15 12-8 8-3-3 8-8"/><path d="m17 6 3 3-6 6-3-3z"/><path d="m17 6 4-4"/></svg>;
    case 'home': return <svg {...props}><path d="m3 11 9-8 9 8v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/></svg>;
    case 'paint': return <svg {...props}><path d="M19 11V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3M3 11h18v3H3z"/><path d="M12 14v8"/></svg>;
    case 'roof': return <svg {...props}><path d="m2 12 10-8 10 8"/><path d="M5 10v10h14V10"/></svg>;
    default: return null;
  }
}

function LandingEquilibrioAtardecer() {
  return (
    <EAPhone height={1640}>
      {/* NAV — Atardecer copy: Entrar / Registrar */}
      <div style={{ padding: '6px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <EAWordmark size={17}/>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            height: 36, padding: '0 14px', borderRadius: 99,
            background: 'transparent', border: 'none',
            fontWeight: 700, fontSize: 12, color: PEA.ink,
            fontFamily: LV3B_FONT.body,
          }}>Entrar</button>
          {/* Registrar — gradient como en Atardecer */}
          <button style={{
            height: 36, padding: '0 14px', borderRadius: 99,
            backgroundImage: PEA.grad, color: '#fff', border: 'none',
            fontWeight: 800, fontSize: 12, fontFamily: LV3B_FONT.body,
          }}>Registrar</button>
        </div>
      </div>

      {/* HERO — copy idéntico Atardecer, paleta Equilibrio (fondo blanco) */}
      <div style={{ padding: '24px 18px 0', position: 'relative' }}>
        {/* Eyebrow con avatares — gradiente sutil dentro del sistema */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ display: 'flex' }}>
            {[PEA.naranja, PEA.violeta, PEA.violetaDeep].map((c, i) => (
              <div key={i} style={{
                width: 24, height: 24, borderRadius: '50%',
                background: c, border: `2px solid ${PEA.bg}`,
                marginLeft: i === 0 ? 0 : -8,
              }}/>
            ))}
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: PEA.inkSoft, fontFamily: LV3B_FONT.mono, letterSpacing: 0.4 }}>
            +1.240 maestros activos
          </span>
        </div>

        <h1 style={{
          fontFamily: LV3B_FONT.display,
          fontSize: 48, lineHeight: 0.92,
          fontWeight: 900,
          letterSpacing: -2.2,
          margin: 0,
          textWrap: 'balance',
          color: PEA.ink,
        }}>
          Tu próximo<br/>
          <span style={{
            backgroundImage: PEA.grad,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent',
            fontStyle: 'italic',
            fontWeight: 800,
          }}>pololito</span><br/>
          empieza acá.
        </h1>

        <p style={{
          fontSize: 15.5, lineHeight: 1.5,
          color: PEA.inkSoft, margin: '18px 0 0',
          textWrap: 'pretty', maxWidth: 320,
        }}>
          Conectamos clientes con maestros confiables de todo Chile. Rápido, simple y al tiro.
        </p>
      </div>

      {/* HERO IMAGE — placeholder con badges flotantes (paleta neutra) */}
      <div style={{ padding: '22px 18px 0', position: 'relative' }}>
        <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
          <EAStripe height={260} label="MAESTRO TRABAJANDO · FOTO REAL" radius={24}/>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(15,11,26,0.35) 100%)',
            borderRadius: 24,
          }}/>

          {/* trust badge — neutro, rating amarillo */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)',
            padding: '6px 10px', borderRadius: 99,
            display: 'flex', alignItems: 'center', gap: 6,
            border: `1px solid ${PEA.border}`,
          }}>
            <EAIcon name="star" size={11} color={PEA.yellow}/>
            <span style={{ fontSize: 11, fontWeight: 800, color: PEA.ink }}>4.9 · Don Luis</span>
          </div>

          {/* respondió en — número en violeta sólido (no gradiente) */}
          <div style={{
            position: 'absolute', bottom: 14, right: 14,
            background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)',
            padding: '8px 12px', borderRadius: 12,
            border: `1px solid ${PEA.border}`,
          }}>
            <div style={{ fontFamily: LV3B_FONT.mono, fontSize: 9, color: PEA.inkMuted, letterSpacing: 0.4, fontWeight: 700 }}>RESPONDIÓ EN</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: PEA.violetaDeep, fontFamily: LV3B_FONT.display }}>12 minutos</div>
          </div>
        </div>
      </div>

      {/* CTAs — copy Atardecer · gradient solo en primario */}
      <div style={{ padding: '22px 18px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={{
          height: 58, borderRadius: 18, border: 'none',
          backgroundImage: PEA.grad, color: '#fff',
          fontWeight: 800, fontSize: 15.5, fontFamily: LV3B_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px', letterSpacing: -0.2,
        }}>
          <span>Buscar un maestro</span>
          <span style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <EAIcon name="arrow-right" size={15} color="#fff"/>
          </span>
        </button>
        <button style={{
          height: 58, borderRadius: 18,
          background: PEA.surface, color: PEA.violetaDeep,
          border: `1.5px solid ${PEA.violeta}`,
          fontWeight: 800, fontSize: 15.5, fontFamily: LV3B_FONT.display,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px', letterSpacing: -0.2,
        }}>
          <span>Publicar trabajo</span>
          <span style={{
            width: 30, height: 30, borderRadius: 9,
            background: PEA.violetaSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <EAIcon name="plus" size={15} color={PEA.violetaDeep}/>
          </span>
        </button>
      </div>

      {/* TRUST INDICATORS — copy Atardecer (4.8★ · <2h · +50 comunas) · números en gradient */}
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
              fontFamily: LV3B_FONT.display, fontSize: 22, fontWeight: 900,
              backgroundImage: PEA.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text',
              color: 'transparent', letterSpacing: -0.8,
            }}>{t.v}</div>
            <div style={{ fontSize: 10.5, color: PEA.inkMuted, marginTop: 2, fontFamily: LV3B_FONT.mono, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>{t.l}</div>
          </div>
        ))}
      </div>

      {/* PROBLEMA VS SOLUCIÓN — copy 02 · Antes y después / De caos a calma */}
      <div style={{ padding: '0 18px 28px' }}>
        <EAMono color={PEA.violeta}>02 · Antes y después</EAMono>
        <h2 style={{
          fontFamily: LV3B_FONT.display, fontSize: 30, fontWeight: 900,
          letterSpacing: -1.4, margin: '6px 0 16px', lineHeight: 1, textWrap: 'balance',
          color: PEA.ink,
        }}>De caos a calma.</h2>

        <div style={{
          background: PEA.surface, borderRadius: 22, overflow: 'hidden',
          border: `1px solid ${PEA.border}`,
        }}>
          <div style={{ padding: 18, borderBottom: `1px solid ${PEA.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', background: PEA.redSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <EAIcon name="x" size={14} color={PEA.red} stroke={2.4}/>
              </span>
              <EAMono color={PEA.red}>Antes</EAMono>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Buscar a ciegas en redes sociales', 'No saber si confiar en el maestro', 'Precios poco claros'].map((t) => (
                <div key={t} style={{ fontSize: 13.5, color: PEA.inkSoft, paddingLeft: 32 }}>· {t}</div>
              ))}
            </div>
          </div>
          <div style={{
            padding: 18,
            background: PEA.violetaSoft + '60',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', backgroundImage: PEA.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <EAIcon name="check" size={13} color="#fff" stroke={2.6}/>
              </span>
              <EAMono color={PEA.violetaDeep}>Con POLOLITOTRABAJOS</EAMono>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Perfiles con calificaciones reales', 'Contacto directo, sin intermediarios', 'Maestros cercanos al tiro'].map((t) => (
                <div key={t} style={{ fontSize: 13.5, color: PEA.violetaInk, paddingLeft: 32, fontWeight: 600 }}>· {t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES — 03 · Categorías / Cualquier pega. Ahora. — paleta neutra */}
      <div style={{ padding: '0 18px 28px' }}>
        <EAMono color={PEA.violeta}>03 · Categorías</EAMono>
        <h2 style={{
          fontFamily: LV3B_FONT.display, fontSize: 28, fontWeight: 900,
          letterSpacing: -1.2, margin: '6px 0 14px', color: PEA.ink, lineHeight: 1,
        }}>Cualquier pega. Ahora.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { icon: 'plug', name: 'Electricista', count: '320 maestros' },
            { icon: 'wrench', name: 'Gasfitería', count: '180 maestros' },
            { icon: 'hammer', name: 'Construcción', count: '420 maestros' },
            { icon: 'home', name: 'Carpintería', count: '210 maestros' },
            { icon: 'roof', name: 'Techumbre', count: '95 maestros' },
            { icon: 'paint', name: 'Pintura', count: '150 maestros' },
          ].map((c) => (
            <div key={c.name} style={{
              padding: 14, borderRadius: 16,
              background: PEA.surface, border: `1px solid ${PEA.border}`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Icono en violeta soft (no gradient) — disciplina del sistema */}
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: PEA.violetaSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <EAIcon name={c.icon} size={18} color={PEA.violetaDeep}/>
              </div>
              <div style={{ fontFamily: LV3B_FONT.display, fontWeight: 800, fontSize: 13.5, color: PEA.ink, letterSpacing: -0.2 }}>{c.name}</div>
              <div style={{ fontSize: 10.5, color: PEA.inkMuted, marginTop: 2, fontFamily: LV3B_FONT.mono, fontWeight: 600 }}>{c.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CONFIANZA — 04 · Confianza / Más confianza, menos riesgo. + 3 ítems */}
      <div style={{ padding: '0 18px 28px' }}>
        <div style={{
          background: PEA.violetaInk, color: '#fff', borderRadius: 22, padding: 22,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* sutil acento gradient — controlado */}
          <div style={{
            position: 'absolute', right: -30, bottom: -30,
            width: 160, height: 160, borderRadius: '50%',
            backgroundImage: PEA.grad, opacity: 0.28, filter: 'blur(30px)',
          }}/>
          <EAMono color="rgba(255,255,255,0.7)">04 · Confianza</EAMono>
          <h2 style={{
            fontFamily: LV3B_FONT.display, fontSize: 26, fontWeight: 900,
            letterSpacing: -1, margin: '6px 0 16px', lineHeight: 1, position: 'relative',
            color: '#fff',
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
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}><EAIcon name={t.i} size={16} color="#fff"/></div>
                <div>
                  <div style={{ fontFamily: LV3B_FONT.display, fontWeight: 800, fontSize: 14 }}>{t.t}</div>
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2, lineHeight: 1.4 }}>{t.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA — Empieza al tiro. */}
      <div style={{ padding: '0 18px 28px' }}>
        <h2 style={{
          fontFamily: LV3B_FONT.display, fontSize: 38, fontWeight: 900,
          letterSpacing: -1.6, margin: '0 0 6px', textAlign: 'center', lineHeight: 1, textWrap: 'balance',
          color: PEA.ink,
        }}>
          Empieza{' '}
          <span style={{
            backgroundImage: PEA.grad,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent', fontStyle: 'italic',
          }}>al tiro.</span>
        </h2>
        <p style={{
          fontSize: 14, color: PEA.inkSoft, margin: '0 0 18px', textAlign: 'center',
        }}>Es gratis. Toma 2 minutos. Sin compromiso.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={{
            height: 56, borderRadius: 16, border: 'none',
            backgroundImage: PEA.grad, color: '#fff',
            fontWeight: 800, fontSize: 15, fontFamily: LV3B_FONT.display,
          }}>Buscar maestro</button>
          <button style={{
            height: 56, borderRadius: 16,
            background: PEA.surface, color: PEA.violetaDeep,
            border: `1.5px solid ${PEA.violeta}`,
            fontWeight: 800, fontSize: 15, fontFamily: LV3B_FONT.display,
          }}>Publicar trabajo</button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding: '20px 18px 28px',
        background: PEA.bgAlt,
        borderTop: `1px solid ${PEA.border}`,
      }}>
        <EAWordmark size={13}/>
        <p style={{ fontSize: 11, lineHeight: 1.55, color: PEA.inkSoft, marginTop: 12 }}>
          POLOLITOTRABAJOS es <b>solo intermediaria</b>. No garantizamos calidad ni respondemos por incumplimientos, problemas de pago o resultados. Cada usuario es responsable de sus acuerdos. Revisa calificaciones antes de contratar.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11, fontWeight: 700, color: PEA.violeta }}>
          <span>Términos</span><span>Privacidad</span><span>Soporte</span>
          <span style={{ marginLeft: 'auto', fontFamily: LV3B_FONT.mono, fontSize: 9, opacity: 0.7, color: PEA.inkMuted }}>v1.0</span>
        </div>
      </div>
    </EAPhone>
  );
}

window.LandingEquilibrioAtardecer = LandingEquilibrioAtardecer;
