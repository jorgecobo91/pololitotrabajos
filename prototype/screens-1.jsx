// POLOLITOTRABAJOS — Screens part 1: Catalog, Maestro detail
// Uses primitives + data on window.

// ───────────── Catalog screen
function ScreenCatalog({ theme, onOpenMaestro, role }) {
  const [filter, setFilter] = React.useState('Todos');
  const [search, setSearch] = React.useState('');
  const filters = ['Todos', 'Electricidad', 'Gasfitería', 'Construcción', 'Pintura', 'Carpintería'];
  const list = window.PT_DATA.maestros.filter(m =>
    (filter === 'Todos' || m.especialidades.some(e => e.toLowerCase().includes(filter.toLowerCase()))) &&
    (!search || m.nombre.toLowerCase().includes(search.toLowerCase()) || m.oficio.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ height: '100%', overflow: 'auto', background: theme.bg }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 12px', background: theme.bg, position: 'sticky', top: 0, zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <PTLogo theme={theme} size={20} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button style={{
              width: 36, height: 36, borderRadius: 12, border: `1px solid ${theme.border}`,
              background: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative',
            }}>
              <PTIcon name="bell" size={16} color={theme.ink} />
              <span style={{
                position: 'absolute', top: 6, right: 7, width: 8, height: 8, borderRadius: 4,
                background: theme.primary, border: `1.5px solid ${theme.surface}`,
              }} />
            </button>
          </div>
        </div>

        {/* Hello + greeting */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: theme.inkMuted, fontWeight: 600 }}>
            {role === 'cliente' ? 'Hola María 👋' : 'Hola Juan 👋'}
          </div>
          <h1 style={{
            margin: '2px 0 0', fontSize: 24, fontWeight: 800, letterSpacing: -0.7,
            color: theme.ink, fontFamily: window.PT_FONT.display, lineHeight: 1.15,
          }}>
            {role === 'cliente' ? '¿Qué necesitas\narreglar hoy?' : 'Maestros cerca\ntuyo'}
          </h1>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', borderRadius: 14,
          background: theme.surface, border: `1px solid ${theme.border}`,
        }}>
          <PTIcon name="search" size={16} color={theme.inkMuted} />
          <input
            placeholder="Buscar maestro u oficio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontSize: 13.5, color: theme.ink, fontFamily: window.PT_FONT.body,
            }}
          />
          <div style={{
            width: 28, height: 28, borderRadius: 10, background: theme.bgAlt,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}><PTIcon name="filter" size={14} color={theme.ink} /></div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto',
          paddingBottom: 4, marginLeft: -18, marginRight: -18, paddingLeft: 18, paddingRight: 18,
          scrollbarWidth: 'none',
        }}>
          {filters.map(f => (
            <PTChip key={f} theme={theme} active={filter === f} onClick={() => setFilter(f)}
              accent={filter === f ? theme.primary : null}>
              {f}
            </PTChip>
          ))}
        </div>
      </div>

      {/* Featured banner */}
      <div style={{ padding: '4px 18px 0' }}>
        <div style={{
          background: theme.grad, borderRadius: 18, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12, color: '#fff', overflow: 'hidden', position: 'relative',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}>
            <PTIcon name="sparkles" size={20} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, lineHeight: 1.2 }}>Encuentra tu maestro</div>
            <div style={{ fontSize: 11.5, opacity: 0.92, marginTop: 2 }}>Para cualquier pololito al tiro</div>
          </div>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        </div>
      </div>

      {/* Section */}
      <div style={{ padding: '18px 0 8px' }}>
        <PTSectionTitle theme={theme} action="Ordenar">
          {list.length} maestros disponibles
        </PTSectionTitle>
      </div>

      {/* Cards */}
      <div style={{ padding: '0 18px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.map(m => <MaestroCard key={m.id} m={m} theme={theme} onClick={() => onOpenMaestro && onOpenMaestro(m.id)} />)}
      </div>
    </div>
  );
}

function MaestroCard({ m, theme, onClick }) {
  return (
    <PTCard theme={theme} padding={0} onClick={onClick} style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 14, padding: 14 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <PTAvatar size={68} theme={theme} label={`foto · ${m.nombre.split(' ')[0].toLowerCase()}`} />
          {m.disponible && (
            <div style={{
              position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7,
              background: theme.green, border: `2.5px solid ${theme.surface}`,
            }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: theme.primary,
                textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 1,
              }}>{m.oficio}</div>
              <div style={{
                fontSize: 15.5, fontWeight: 700, color: theme.ink,
                fontFamily: window.PT_FONT.display, letterSpacing: -0.2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{m.nombre}</div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0,
              background: theme.bgAlt, padding: '4px 8px', borderRadius: 8,
            }}>
              <PTIcon name="star" size={11} filled color="#F59E0B" stroke={0} />
              <span style={{ fontSize: 12, fontWeight: 700, color: theme.ink }}>{m.rating}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: theme.inkMuted, fontSize: 11.5 }}>
            <PTIcon name="pin" size={11} color={theme.inkMuted} stroke={2} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.zona}</span>
            <span style={{ margin: '0 4px', opacity: 0.5 }}>·</span>
            <span>{m.reviews} trabajos</span>
          </div>
          <p style={{
            margin: '8px 0 0', fontSize: 12.5, color: theme.inkSoft, lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            textWrap: 'pretty',
          }}>{m.bio}</p>
        </div>
      </div>
      {/* CTAs */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 14px 14px',
      }}>
        {m.telefonoPublico && (
          <PTButton theme={theme} variant="outline" size="sm" icon="phone" full
            style={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); }}>
            Llamar
          </PTButton>
        )}
        <PTButton theme={theme} variant="primary" size="sm" full icon="chat"
          style={{ flex: m.telefonoPublico ? 1.4 : 1 }} onClick={(e) => { e.stopPropagation(); }}>
          Contactar
        </PTButton>
      </div>
    </PTCard>
  );
}

// ───────────── Maestro Detail screen
function ScreenMaestroDetail({ theme, maestroId, onBack }) {
  const m = window.PT_DATA.maestros.find(x => x.id === maestroId) || window.PT_DATA.maestros[0];
  return (
    <div style={{ height: '100%', overflow: 'auto', background: theme.bg }}>
      {/* Hero with gradient bg */}
      <div style={{ position: 'relative', background: theme.grad, padding: '14px 18px 80px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} style={{
            width: 38, height: 38, borderRadius: 12, border: 'none',
            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff',
          }}><PTIcon name="arrow-left" size={18} color="#fff" /></button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              width: 38, height: 38, borderRadius: 12, border: 'none',
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}><PTIcon name="shield" size={16} color="#fff" /></button>
          </div>
        </div>
      </div>

      {/* Avatar + name overlay */}
      <div style={{ padding: '0 18px', marginTop: -56 }}>
        <PTCard theme={theme} padding={16}>
          <div style={{ display: 'flex', gap: 14, marginTop: -42, alignItems: 'flex-end' }}>
            <PTAvatar size={84} theme={theme} label={`foto · ${m.nombre.split(' ')[0].toLowerCase()}`} ring />
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: m.disponible ? theme.greenSoft : theme.bgAlt,
                color: m.disponible ? theme.green : theme.inkMuted,
                padding: '3px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 700,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: m.disponible ? theme.green : theme.inkMuted }}/>
                {m.disponible ? 'Disponible al tiro' : 'No disponible'}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: theme.primary,
              textTransform: 'uppercase', letterSpacing: 0.4,
            }}>{m.oficio}</div>
            <h2 style={{
              margin: '2px 0 0', fontSize: 22, fontWeight: 800, letterSpacing: -0.5,
              color: theme.ink, fontFamily: window.PT_FONT.display,
            }}>{m.nombre}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12.5, color: theme.inkSoft }}>
              <PTStars value={m.rating} size={13} theme={theme} />
              <span style={{ fontWeight: 700, color: theme.ink }}>{m.rating}</span>
              <span style={{ opacity: 0.7 }}>· {m.reviews} reseñas</span>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14,
            padding: '12px 0 4px', borderTop: `1px solid ${theme.border}`,
          }}>
            {[
              { k: 'Años', v: m.experiencia },
              { k: 'Trabajos', v: m.reviews },
              { k: 'En PT desde', v: m.desde.split(' ')[1] },
            ].map(s => (
              <div key={s.k} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: theme.ink, fontFamily: window.PT_FONT.display, letterSpacing: -0.3 }}>{s.v}</div>
                <div style={{ fontSize: 10.5, color: theme.inkMuted, fontWeight: 600, marginTop: 2 }}>{s.k}</div>
              </div>
            ))}
          </div>
        </PTCard>
      </div>

      {/* Sobre mí */}
      <div style={{ padding: '18px 18px 0' }}>
        <h4 style={sectH(theme)}>Sobre mí</h4>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: theme.inkSoft, lineHeight: 1.5, textWrap: 'pretty' }}>
          {m.bio} Llevo {m.experiencia} años en el oficio, atiendo en {m.zona.split(',')[0]} y alrededores. Cualquier duda escríbeme nomás, cachái.
        </p>
      </div>

      {/* Especialidades */}
      <div style={{ padding: '16px 18px 0' }}>
        <h4 style={sectH(theme)}>Especialidades</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {m.especialidades.map(e => (
            <PTChip key={e} theme={theme}>{e}</PTChip>
          ))}
        </div>
      </div>

      {/* Calificaciones desglose */}
      <div style={{ padding: '20px 18px 0' }}>
        <h4 style={sectH(theme)}>Calificaciones</h4>
        <PTCard theme={theme} padding={14} style={{ marginTop: 10 }}>
          {Object.entries(m.desglose).map(([k, v]) => {
            const labels = { calidad: 'Calidad', puntualidad: 'Puntualidad', comunicacion: 'Comunicación', precio: 'Precio justo' };
            const pct = (v / 5) * 100;
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, color: theme.ink, fontWeight: 600, marginBottom: 4 }}>{labels[k]}</div>
                  <div style={{ height: 5, background: theme.bgAlt, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: theme.grad, borderRadius: 3 }} />
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.ink, width: 24, textAlign: 'right' }}>{v.toFixed(1)}</div>
              </div>
            );
          })}
        </PTCard>
      </div>

      {/* Portfolio */}
      <div style={{ padding: '20px 18px 0' }}>
        <h4 style={sectH(theme)}>Trabajos realizados</h4>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 10,
        }}>
          {m.portfolio.slice(0, 6).map((p, i) => (
            <PTImagePlaceholder key={i} theme={theme} h={88} radius={10} label={p} />
          ))}
        </div>
      </div>

      {/* CTAs sticky-feeling at bottom */}
      <div style={{ padding: '24px 18px 28px', display: 'flex', gap: 10 }}>
        {m.telefonoPublico && (
          <PTButton theme={theme} variant="outline" size="lg" icon="phone" style={{ flex: 1 }}>
            Llamar
          </PTButton>
        )}
        <PTButton theme={theme} variant="primary" size="lg" icon="send" full style={{ flex: 2 }}>
          Contactar
        </PTButton>
      </div>
    </div>
  );
}

function sectH(theme) {
  return {
    fontFamily: window.PT_FONT.display, fontSize: 13, fontWeight: 800,
    color: theme.ink, margin: 0, letterSpacing: -0.2, textTransform: 'uppercase',
    opacity: 0.9,
  };
}

Object.assign(window, { ScreenCatalog, ScreenMaestroDetail, MaestroCard });
