import React, { createElement as h } from 'react';
import { View, useWindowDimensions, Platform } from 'react-native';

interface Props {
  children: React.ReactNode;
}

export function DesktopAuthShell({ children }: Props) {
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web' || width < 1024) {
    return <>{children}</>;
  }

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";
  const mono = "'JetBrains Mono', monospace";

  return h('div', {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column' as const,
      background: '#FFFFFF',
      fontFamily: font,
      WebkitFontSmoothing: 'antialiased',
      overflowY: 'auto' as const,
    },
  },
    // ─── NAV ───
    h('nav', {
      style: {
        position: 'sticky' as const,
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E8E4DC',
        flexShrink: 0,
      },
    },
      h('div', {
        style: {
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 32px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      },
        h('span', {
          style: { fontWeight: 900, fontSize: 18, letterSpacing: -0.5, color: '#0F0B1A' },
        }, 'POLOLITOTRABAJOS'),
        h('span', {
          style: { fontWeight: 500, fontSize: 13, color: '#71717A' },
        }, 'Hecho en Chile \u{1F1E8}\u{1F1F1}'),
      ),
    ),

    // ─── HERO ───
    h('section', {
      style: {
        position: 'relative' as const,
        minHeight: 'calc(100vh - 64px)',
        padding: '60px 32px',
        overflow: 'hidden' as const,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
      // Decorative blobs
      h('div', {
        style: {
          position: 'absolute' as const, top: -120, right: -120,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, rgba(124,58,237,0.08) 100%)',
          filter: 'blur(80px)', pointerEvents: 'none' as const,
        },
      }),
      h('div', {
        style: {
          position: 'absolute' as const, bottom: -80, left: -120,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(236,72,153,0.06) 100%)',
          filter: 'blur(80px)', pointerEvents: 'none' as const,
        },
      }),

      // Grid
      h('div', {
        style: {
          position: 'relative' as const,
          maxWidth: 1280, width: '100%', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 440px',
          gap: 64,
          alignItems: 'center',
        },
      },
        // ─── Left ───
        h('div', {},
          // Eyebrow
          h('div', {
            style: {
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#F3EEFF', padding: '6px 14px',
              borderRadius: 9999, marginBottom: 24,
            },
          },
            h('div', { style: { display: 'flex' } },
              h('div', { style: { width: 24, height: 24, borderRadius: '50%', background: 'rgba(124,58,237,0.4)', border: '2px solid white' } }),
              h('div', { style: { width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,107,53,0.4)', border: '2px solid white', marginLeft: -8 } }),
              h('div', { style: { width: 24, height: 24, borderRadius: '50%', background: 'rgba(124,58,237,0.6)', border: '2px solid white', marginLeft: -8 } }),
            ),
            h('span', {
              style: { fontFamily: mono, fontWeight: 700, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase' as const, color: '#5B21B6' },
            }, '+1.240 maestros activos hoy'),
          ),

          // Title
          h('h1', {
            style: {
              fontWeight: 900, fontSize: 72, lineHeight: 1,
              letterSpacing: -2.5, color: '#0F0B1A',
              marginTop: 0, marginBottom: 24, maxWidth: 600,
            },
          },
            'Tu próximo',
            h('br'),
            h('span', {
              style: {
                background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              },
            }, 'pololito'),
            h('br'),
            'empieza acá.',
          ),

          // Subtitle
          h('p', {
            style: { fontWeight: 500, fontSize: 20, lineHeight: 1.6, color: '#71717A', maxWidth: 520, marginTop: 0, marginBottom: 32 },
          }, 'Conectamos clientes con maestros confiables de todo Chile. Electricistas, gasfiteros, carpinteros y más. Rápido, simple y al tiro.'),

          // CTA buttons
          h('div', { style: { display: 'flex', gap: 12, marginBottom: 32 } },
            h('a', {
              href: '#',
              onClick: (e: React.MouseEvent) => e.preventDefault(),
              style: {
                background: 'linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)',
                color: 'white', fontWeight: 700, fontSize: 15,
                padding: '16px 28px', borderRadius: 12, textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
              },
            }, 'Buscar un maestro'),
            h('a', {
              href: '#',
              onClick: (e: React.MouseEvent) => e.preventDefault(),
              style: {
                border: '2px solid #7C3AED', color: '#7C3AED',
                fontWeight: 700, fontSize: 15, padding: '16px 28px',
                borderRadius: 12, textDecoration: 'none', background: 'transparent',
              },
            }, 'Soy maestro, quiero pega'),
          ),

          // Trust row
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 24, color: '#71717A' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
              h('span', { style: { color: '#F59E0B', fontSize: 14 } }, '★★★★★'),
              h('span', { style: { fontWeight: 700, fontSize: 13, color: '#0F0B1A' } }, '4.8/5'),
            ),
            h('div', { style: { width: 1, height: 20, background: '#E8E4DC' } }),
            h('span', { style: { fontWeight: 500, fontSize: 13 } }, '+15.000 trabajos completados'),
          ),
        ),

        // ─── Right: Auth card (React Native View for flex compat) ───
        h('div', {
          style: {
            width: 440, flexShrink: 0,
          },
        },
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              borderWidth: 1,
              borderColor: '#E8E4DC',
              overflow: 'hidden',
              height: 560,
              // @ts-expect-error web-only
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)',
            }}
          >
            {children}
          </View>,
        ),
      ),
    ),

    // ─── BOTTOM FEATURES ───
    h('section', {
      style: {
        background: '#FAFAFA', padding: '48px 32px', flexShrink: 0,
      },
    },
      h('div', {
        style: {
          maxWidth: 960, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32, textAlign: 'center' as const,
        },
      },
        ...([
          { icon: '⚡', title: 'Rápido', desc: 'Encuentra maestro en minutos' },
          { icon: '⭐', title: 'Confiable', desc: 'Calificaciones verificadas' },
          { icon: '📞', title: 'Directo', desc: 'WhatsApp sin intermediarios' },
          { icon: '🔒', title: 'Seguro', desc: 'Historial transparente' },
        ].map((item) =>
          h('div', { key: item.title, style: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center' } },
            h('div', {
              style: {
                width: 52, height: 52, borderRadius: 16, background: '#EDE4FE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12, fontSize: 24,
              },
            }, item.icon),
            h('div', { style: { fontWeight: 700, fontSize: 14, color: '#0F0B1A', marginBottom: 4 } }, item.title),
            h('div', { style: { fontWeight: 400, fontSize: 12, color: '#71717A' } }, item.desc),
          ),
        )),
      ),
    ),
  );
}
