// POLOLITOTRABAJOS — Screens part 2: Publish, Profile

// ───────────── Publish screen
function ScreenPublish({ theme, role, onPublish }) {
  const [titulo, setTitulo] = React.useState('Necesito gásfiter al tiro');
  const [desc, setDesc] = React.useState('Mi califont está perdiendo agua y se moja toda la cocina.');
  const [esp, setEsp] = React.useState('Gasfitería');
  const [ubic, setUbic] = React.useState('Antofagasta Centro');
  const [urgente, setUrgente] = React.useState(true);
  const [photos, setPhotos] = React.useState(2);

  const especialidades = ['Electricidad', 'Construcción', 'Gasfitería', 'Carpintería', 'Plomería', 'Pintura', 'Vidriería'];

  return (
    <div style={{ height: '100%', overflow: 'auto', background: theme.bg }}>
      <div style={{ padding: '14px 18px 8px', background: theme.bg, position: 'sticky', top: 0, zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: theme.ink, fontFamily: window.PT_FONT.display }}>
            {role === 'maestro' ? 'Feed de pegas' : 'Publica tu pololito'}
          </h1>
        </div>
        <p style={{ margin: '4px 0 0', fontSize: 12.5, color: theme.inkMuted, lineHeight: 1.4 }}>
          {role === 'maestro' ? 'Solicitudes cerca tuyo. Postúlate al tiro.' : 'Cuéntanos qué necesitas y los maestros te contactarán.'}
        </p>
      </div>

      {role === 'maestro' ? <FeedList theme={theme} /> : (
        <div style={{ padding: '8px 18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Title */}
          <Field theme={theme} label="Título" hint="Sé claro y directo">
            <input value={titulo} onChange={e => setTitulo(e.target.value)} style={inp(theme)} />
          </Field>

          {/* Description */}
          <Field theme={theme} label="Descripción" hint={`${desc.length}/300`}>
            <textarea value={desc} onChange={e => setDesc(e.target.value.slice(0, 300))} rows={3}
              style={{ ...inp(theme), resize: 'none', fontFamily: window.PT_FONT.body, lineHeight: 1.4 }} />
          </Field>

          {/* Especialidad */}
          <Field theme={theme} label="Especialidad">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {especialidades.map(e => (
                <PTChip key={e} theme={theme} active={esp === e} onClick={() => setEsp(e)}
                  accent={esp === e ? theme.primary : null}>{e}</PTChip>
              ))}
            </div>
          </Field>

          {/* Ubicación */}
          <Field theme={theme} label="Ubicación">
            <div style={{ ...inp(theme), display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
              <PTIcon name="pin" size={14} color={theme.primary} />
              <input value={ubic} onChange={e => setUbic(e.target.value)}
                style={{ flex: 1, height: 44, border: 'none', background: 'transparent', outline: 'none', fontSize: 13.5, color: theme.ink, fontFamily: window.PT_FONT.body }} />
              <button style={{
                padding: '5px 9px', fontSize: 11, fontWeight: 700, borderRadius: 8,
                border: 'none', background: theme.primarySoft, color: theme.primaryDeep,
                cursor: 'pointer', fontFamily: window.PT_FONT.body,
              }}>📍 GPS</button>
            </div>
          </Field>

          {/* Urgente */}
          <PTCard theme={theme} padding={14} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: urgente ? theme.redSoft : theme.surface,
            borderColor: urgente ? theme.red : theme.border,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: urgente ? theme.red : theme.bgAlt,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PTIcon name="zap" size={18} color={urgente ? '#fff' : theme.inkMuted} filled={urgente} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: theme.ink }}>¿Es urgente?</div>
              <div style={{ fontSize: 11.5, color: theme.inkSoft }}>Te llegan más maestros, al tiro</div>
            </div>
            <Toggle on={urgente} onChange={() => setUrgente(!urgente)} theme={theme} accent={theme.red} />
          </PTCard>

          {/* Photos */}
          <Field theme={theme} label="Fotos">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Array.from({ length: photos }).map((_, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <PTImagePlaceholder theme={theme} w={72} h={72} radius={12} label={`foto ${i+1}`} />
                  <button onClick={() => setPhotos(p => p - 1)} style={{
                    position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: 10,
                    background: theme.ink, color: theme.bg, border: `2px solid ${theme.bg}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}><PTIcon name="x" size={10} color={theme.bg} /></button>
                </div>
              ))}
              <button onClick={() => setPhotos(p => p + 1)} style={{
                width: 72, height: 72, borderRadius: 12,
                border: `1.5px dashed ${theme.borderStrong}`, background: theme.surface,
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                color: theme.inkSoft, fontFamily: window.PT_FONT.body,
              }}>
                <PTIcon name="camera" size={18} color={theme.inkSoft} />
                <span style={{ fontSize: 10, fontWeight: 600 }}>Agregar</span>
              </button>
            </div>
          </Field>

          {/* Submit */}
          <div style={{ marginTop: 4 }}>
            <PTButton theme={theme} variant="primary" size="lg" full icon="send" onClick={onPublish}>
              Publicar solicitud
            </PTButton>
            <p style={{ textAlign: 'center', fontSize: 11, color: theme.inkMuted, margin: '10px 0 0', lineHeight: 1.4 }}>
              Los maestros de tu zona verán tu publicación.<br />Es gratis, sin compromiso.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ theme, label, hint, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
        <label style={{ fontSize: 11.5, fontWeight: 700, color: theme.ink, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</label>
        {hint && <span style={{ fontSize: 11, color: theme.inkMuted }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function inp(theme) {
  return {
    width: '100%', height: 44, padding: '0 14px', borderRadius: 12,
    border: `1px solid ${theme.border}`, background: theme.surface,
    fontSize: 13.5, color: theme.ink, outline: 'none', fontFamily: window.PT_FONT.body,
    boxSizing: 'border-box',
  };
}

function Toggle({ on, onChange, theme, accent }) {
  const c = accent || theme.primary;
  return (
    <button onClick={onChange} style={{
      width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
      background: on ? c : theme.bgAlt, position: 'relative', transition: 'background .15s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: 10,
        background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </button>
  );
}

function FeedList({ theme }) {
  return (
    <div style={{ padding: '8px 18px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {window.PT_DATA.publicaciones.map(p => <PublicationCard key={p.id} p={p} theme={theme} maestroView />)}
    </div>
  );
}

function PublicationCard({ p, theme, maestroView }) {
  return (
    <PTCard theme={theme} padding={14}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <PTAvatar size={38} theme={theme} label={p.autorLabel} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.ink, fontFamily: window.PT_FONT.display, letterSpacing: -0.1 }}>{p.autor}</div>
          <div style={{ fontSize: 11, color: theme.inkMuted, display: 'flex', gap: 4, alignItems: 'center' }}>
            <PTIcon name="clock" size={10} color={theme.inkMuted} stroke={2} />
            {p.hace}
            <span style={{ opacity: 0.5 }}>·</span>
            <PTIcon name="pin" size={10} color={theme.inkMuted} stroke={2} />
            {p.ubicacion}
          </div>
        </div>
        {p.urgente && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            background: theme.redSoft, color: theme.red,
            padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: 0.4,
          }}>
            <PTIcon name="zap" size={10} filled color={theme.red} stroke={0} />
            URGENTE
          </div>
        )}
      </div>
      <h4 style={{
        margin: 0, fontSize: 15, fontWeight: 800, color: theme.ink,
        fontFamily: window.PT_FONT.display, letterSpacing: -0.2, lineHeight: 1.25,
      }}>{p.titulo}</h4>
      <p style={{
        margin: '6px 0 10px', fontSize: 12.5, color: theme.inkSoft, lineHeight: 1.45, textWrap: 'pretty',
      }}>{p.descripcion}</p>
      {p.fotos > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: p.fotos === 1 ? '1fr' : '1fr 1fr', gap: 6, marginBottom: 12 }}>
          {Array.from({ length: Math.min(p.fotos, 2) }).map((_, i) => (
            <PTImagePlaceholder key={i} theme={theme} h={p.fotos === 1 ? 130 : 100} label={`foto ${i+1}/${p.fotos}`} />
          ))}
        </div>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 10, borderTop: `1px solid ${theme.border}`,
      }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <PTChip theme={theme} size="sm">{p.especialidad}</PTChip>
          <span style={{ fontSize: 11, color: theme.inkMuted }}>{p.contactos} contactos</span>
        </div>
        <PTButton theme={theme} variant={maestroView ? 'primary' : 'soft'} size="sm" icon={maestroView ? 'send' : 'edit'}>
          {maestroView ? 'Postular' : 'Editar'}
        </PTButton>
      </div>
    </PTCard>
  );
}

// ───────────── Profile Maestro
function ScreenProfileMaestro({ theme }) {
  const m = window.PT_DATA.maestros[0];
  const [shown, setShown] = React.useState(true);
  const [available, setAvailable] = React.useState(true);
  return (
    <div style={{ height: '100%', overflow: 'auto', background: theme.bg }}>
      {/* Header gradient */}
      <div style={{ background: theme.grad, padding: '16px 18px 76px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, fontFamily: window.PT_FONT.display, letterSpacing: -0.3 }}>Mi perfil</h1>
          <button style={{
            width: 36, height: 36, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><PTIcon name="settings" size={16} color="#fff" /></button>
        </div>
        <div style={{ position: 'absolute', right: -30, bottom: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
      </div>

      <div style={{ padding: '0 18px', marginTop: -56 }}>
        <PTCard theme={theme} padding={16}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginTop: -42 }}>
            <PTAvatar size={84} theme={theme} label="foto · juan" ring />
            <div style={{ flex: 1, paddingBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <button style={{
                background: theme.bgAlt, border: 'none', padding: '7px 12px',
                borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                color: theme.ink, display: 'inline-flex', gap: 4, alignItems: 'center',
                fontFamily: window.PT_FONT.body, cursor: 'pointer',
              }}><PTIcon name="edit" size={11} color={theme.ink} /> Editar</button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: theme.primary,
              textTransform: 'uppercase', letterSpacing: 0.4,
            }}>{m.oficio}</div>
            <h2 style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: theme.ink, fontFamily: window.PT_FONT.display }}>{m.nombre}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 12.5, color: theme.inkSoft }}>
              <PTStars value={m.rating} size={12} theme={theme} />
              <span style={{ fontWeight: 700, color: theme.ink }}>{m.rating}</span>
              <span style={{ opacity: 0.7 }}>· {m.reviews} reseñas</span>
            </div>
          </div>

          {/* Toggles */}
          <div style={{ marginTop: 14, padding: '12px 0 0', borderTop: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ToggleRow theme={theme} icon="bell" label="Estoy disponible" sub="Maestros recibirán solicitudes" on={available} onChange={() => setAvailable(!available)} accent={theme.green} />
            <ToggleRow theme={theme} icon="phone" label="Mostrar teléfono público" sub={shown ? m.telefono : 'Solo por chat'} on={shown} onChange={() => setShown(!shown)} />
          </div>
        </PTCard>
      </div>

      {/* Especialidades + zona */}
      <div style={{ padding: '18px 18px 0' }}>
        <h4 style={sectH(theme)}>Especialidades</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {m.especialidades.map(e => <PTChip key={e} theme={theme} active accent={theme.primary}>{e}</PTChip>)}
          <button style={{
            padding: '7px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
            border: `1.5px dashed ${theme.borderStrong}`, background: 'transparent',
            color: theme.inkSoft, fontFamily: window.PT_FONT.body, cursor: 'pointer',
          }}>+ agregar</button>
        </div>
      </div>

      <div style={{ padding: '16px 18px 0' }}>
        <h4 style={sectH(theme)}>Zona de cobertura</h4>
        <PTCard theme={theme} padding={12} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PTIcon name="map" size={16} color={theme.primaryDeep} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.ink }}>{m.zona}</div>
            <div style={{ fontSize: 11, color: theme.inkMuted }}>Hasta 30 km a la redonda</div>
          </div>
          <PTIcon name="chevron-right" size={16} color={theme.inkMuted} />
        </PTCard>
      </div>

      {/* Calificaciones + portfolio (compact) */}
      <div style={{ padding: '20px 18px 0' }}>
        <h4 style={sectH(theme)}>Mis calificaciones</h4>
        <PTCard theme={theme} padding={14} style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: theme.grad, color: '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              fontFamily: window.PT_FONT.display,
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, letterSpacing: -0.5 }}>{m.rating}</div>
              <div style={{ fontSize: 9.5, opacity: 0.9, fontWeight: 600 }}>de 5.0</div>
            </div>
            <div style={{ flex: 1 }}>
              {Object.entries(m.desglose).map(([k, v]) => {
                const labels = { calidad: 'Calidad', puntualidad: 'Puntualidad', comunicacion: 'Comunicación', precio: 'Precio' };
                return (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ flex: 1, fontSize: 11.5, color: theme.inkSoft }}>{labels[k]}</div>
                    <div style={{ width: 70, height: 4, background: theme.bgAlt, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${(v/5)*100}%`, height: '100%', background: theme.primary }}/>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: theme.ink, width: 22, textAlign: 'right' }}>{v.toFixed(1)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </PTCard>
      </div>

      {/* Portfolio */}
      <div style={{ padding: '20px 18px 0' }}>
        <PTSectionTitle theme={theme} action="Editar">Mi portafolio</PTSectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 12, padding: '0 18px 24px' }}>
          {m.portfolio.slice(0, 6).map((p, i) => (
            <PTImagePlaceholder key={i} theme={theme} h={88} radius={10} label={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ theme, icon, label, sub, on, onChange, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: theme.bgAlt, color: theme.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><PTIcon name={icon} size={15} color={theme.ink} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.ink }}>{label}</div>
        <div style={{ fontSize: 11.5, color: theme.inkSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
      <Toggle on={on} onChange={onChange} theme={theme} accent={accent} />
    </div>
  );
}

// ───────────── Profile Cliente
function ScreenProfileCliente({ theme }) {
  const c = window.PT_DATA.cliente;
  return (
    <div style={{ height: '100%', overflow: 'auto', background: theme.bg }}>
      <div style={{ background: theme.grad, padding: '16px 18px 76px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, fontFamily: window.PT_FONT.display, letterSpacing: -0.3 }}>Mi perfil</h1>
          <button style={{
            width: 36, height: 36, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><PTIcon name="settings" size={16} color="#fff" /></button>
        </div>
        <div style={{ position: 'absolute', right: -30, bottom: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
      </div>

      <div style={{ padding: '0 18px', marginTop: -56 }}>
        <PTCard theme={theme} padding={16}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: -42 }}>
            <PTAvatar size={84} theme={theme} label="foto · maría" ring />
            <div style={{ flex: 1, paddingTop: 38 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: -0.4, color: theme.ink, fontFamily: window.PT_FONT.display }}>{c.nombre}</h2>
              <div style={{ fontSize: 12, color: theme.inkSoft }}>{c.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <PTButton theme={theme} variant="ghost" size="sm" icon="edit" full>Editar perfil</PTButton>
            <PTButton theme={theme} variant="ghost" size="sm" icon="phone" full>{c.telefono.split(' ').slice(0,2).join(' ')} ··</PTButton>
          </div>
        </PTCard>
      </div>

      {/* Stats grid */}
      <div style={{ padding: '14px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <PTCard theme={theme} padding={14}>
          <PTIcon name="briefcase" size={18} color={theme.primary} />
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.ink, fontFamily: window.PT_FONT.display, letterSpacing: -0.3, marginTop: 4 }}>{c.historial}</div>
          <div style={{ fontSize: 11.5, color: theme.inkSoft, marginTop: 1 }}>pololitos contratados</div>
        </PTCard>
        <PTCard theme={theme} padding={14}>
          <PTIcon name="thumbs-up" size={18} color={theme.primary} />
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.ink, fontFamily: window.PT_FONT.display, letterSpacing: -0.3, marginTop: 4 }}>{c.rating}</div>
          <div style={{ fontSize: 11.5, color: theme.inkSoft, marginTop: 1 }}>tu calificación · {c.reviewsRecibidos}</div>
        </PTCard>
      </div>

      {/* Direcciones */}
      <div style={{ padding: '20px 18px 0' }}>
        <PTSectionTitle theme={theme} action="+ agregar">Mis direcciones</PTSectionTitle>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {c.direcciones.map(d => (
            <PTCard key={d.label} theme={theme} padding={12} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: theme.primarySoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><PTIcon name="pin" size={15} color={theme.primaryDeep} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.ink }}>{d.label}</div>
                <div style={{ fontSize: 11.5, color: theme.inkSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.detalle}</div>
              </div>
              <PTIcon name="chevron-right" size={14} color={theme.inkMuted} />
            </PTCard>
          ))}
        </div>
      </div>

      {/* Menu list */}
      <div style={{ padding: '20px 18px 24px' }}>
        <PTSectionTitle theme={theme}>Configuración</PTSectionTitle>
        <PTCard theme={theme} padding={0} style={{ marginTop: 10 }}>
          {[
            { icon: 'briefcase', label: 'Historial de pololitos', sub: '7 trabajos completados' },
            { icon: 'bell', label: 'Notificaciones', sub: 'Activadas' },
            { icon: 'shield', label: 'Privacidad y seguridad', sub: 'Datos protegidos' },
            { icon: 'sparkles', label: 'Invitar amigos', sub: 'Gana $5.000 por referido' },
          ].map((it, i, a) => (
            <div key={it.label} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 14,
              borderBottom: i < a.length - 1 ? `1px solid ${theme.border}` : 'none',
              cursor: 'pointer',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: theme.bgAlt,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><PTIcon name={it.icon} size={15} color={theme.ink} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.ink }}>{it.label}</div>
                <div style={{ fontSize: 11, color: theme.inkMuted }}>{it.sub}</div>
              </div>
              <PTIcon name="chevron-right" size={14} color={theme.inkMuted} />
            </div>
          ))}
        </PTCard>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenPublish, ScreenProfileMaestro, ScreenProfileCliente, PublicationCard });
