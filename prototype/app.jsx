// POLOLITOTRABAJOS — Main app
// Phone-shell prototype with role toggle, palette switch, dark mode.
// Integrates all screens via bottom-nav navigation.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "duo",
  "role": "cliente",
  "dark": false
}/*EDITMODE-END*/;

function PTApp({ paletteOverride, roleOverride, darkOverride, embedded }) {
  const palette = paletteOverride || 'duo';
  const role = roleOverride || 'cliente';
  const dark = !!darkOverride;
  const theme = window.PT_THEME(palette, dark);

  const [tab, setTab] = React.useState('catalog');
  const [maestroId, setMaestroId] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [publishedJustNow, setPublishedJustNow] = React.useState(false);

  React.useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handlePublish = () => {
    setPublishedJustNow(true);
    setToast({ kind: 'success', icon: 'check-circle', title: '¡Publicado al tiro!', body: 'Los maestros ya pueden ver tu solicitud' });
    setTimeout(() => setPublishedJustNow(false), 4000);
  };

  let content;
  if (maestroId) {
    content = <ScreenMaestroDetail theme={theme} maestroId={maestroId} onBack={() => setMaestroId(null)} />;
  } else if (tab === 'catalog') {
    content = <ScreenCatalog theme={theme} onOpenMaestro={(id) => setMaestroId(id)} role={role} />;
  } else if (tab === 'publish') {
    content = <ScreenPublish theme={theme} role={role} onPublish={handlePublish} />;
  } else if (tab === 'chats') {
    content = <ScreenChats theme={theme} role={role} />;
  } else if (tab === 'profile') {
    content = role === 'maestro' ? <ScreenProfileMaestro theme={theme} /> : <ScreenProfileCliente theme={theme} />;
  }

  return (
    <PTPhone theme={theme}>
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{content}</div>

        {/* Toast */}
        {toast && (
          <div style={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 50, animation: 'pt-slide-down .25s ease' }}>
            <PTToast theme={theme} {...toast} onClose={() => setToast(null)} />
          </div>
        )}

        {/* Mock incoming-contact notification (maestro view) */}
        {role === 'maestro' && tab === 'catalog' && !maestroId && (
          <div style={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 40, animation: 'pt-slide-down .35s ease' }}>
            <ContactRequestToast theme={theme} onAccept={() => { setTab('chats'); }} />
          </div>
        )}
      </div>

      {!maestroId && <PTBottomNav theme={theme} current={tab} onTab={(t) => { setTab(t); }} />}
    </PTPhone>
  );
}

// ───────────── Chats screen (inline; small enough)
function ScreenChats({ theme, role }) {
  const [openId, setOpenId] = React.useState(null);
  const chats = [
    { id: 'c1', nombre: role === 'maestro' ? 'María González' : 'Juan Carrasco', label: role === 'maestro' ? 'foto · maría' : 'foto · juan', last: '¡Bacán! Llego a las 3 entonces', when: 'hace 12 min', unread: 2, status: 'En negociación', color: theme.primary },
    { id: 'c2', nombre: role === 'maestro' ? 'Cristián Rojas' : 'Don Luis Muñoz', label: role === 'maestro' ? 'foto · cristián' : 'foto · luis', last: 'Te paso la dirección al tiro', when: 'hace 2 h', unread: 0, status: 'Aceptado', color: theme.green },
    { id: 'c3', nombre: role === 'maestro' ? 'Javiera Pizarro' : 'Patricia Soto', label: role === 'maestro' ? 'foto · javiera' : 'foto · patricia', last: 'Listo, ¿puedes calificarme? ⭐', when: 'ayer', unread: 0, status: 'Completado', color: theme.inkMuted },
    { id: 'c4', nombre: role === 'maestro' ? 'Andrés Toro' : 'Rodrigo Vargas', label: 'foto', last: 'Hola, vi tu solicitud', when: 'ayer', unread: 0, status: 'Nuevo', color: theme.yellow },
  ];

  if (openId) {
    const ch = chats.find(c => c.id === openId);
    return <ChatDetail theme={theme} chat={ch} onBack={() => setOpenId(null)} />;
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', background: theme.bg }}>
      <div style={{ padding: '14px 18px 8px' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.5, color: theme.ink, fontFamily: window.PT_FONT.display }}>Chats</h1>
        <p style={{ margin: '2px 0 0', fontSize: 12.5, color: theme.inkMuted }}>{chats.filter(c => c.unread).length} sin leer</p>
      </div>
      <div style={{ padding: '4px 0 24px' }}>
        {chats.map(c => (
          <button key={c.id} onClick={() => setOpenId(c.id)} style={{
            width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', gap: 12, padding: '12px 18px', alignItems: 'center',
          }}>
            <div style={{ position: 'relative' }}>
              <PTAvatar size={52} theme={theme} label={c.label} />
              {c.unread > 0 && (
                <div style={{
                  position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9,
                  background: theme.primary, color: '#fff', fontSize: 10, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
                  border: `2px solid ${theme.bg}`,
                }}>{c.unread}</div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: theme.ink, fontFamily: window.PT_FONT.display, letterSpacing: -0.1 }}>{c.nombre}</span>
                <span style={{ fontSize: 10.5, color: theme.inkMuted, flexShrink: 0 }}>{c.when}</span>
              </div>
              <div style={{ fontSize: 12.5, color: c.unread ? theme.ink : theme.inkSoft, fontWeight: c.unread ? 600 : 400, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.last}</div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                marginTop: 5, fontSize: 10, fontWeight: 700,
                color: c.color, padding: '2px 7px', borderRadius: 999,
                background: `${c.color}1A`, letterSpacing: 0.2,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: 3, background: c.color }}/>
                {c.status}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatDetail({ theme, chat, onBack }) {
  const messages = [
    { from: 'them', text: 'Hola! Vi tu publicación del califont 👋' },
    { from: 'me', text: 'Hola don Luis! Si, gracias por escribir' },
    { from: 'them', text: '¿Podría ir a verlo hoy en la tarde? Cobro $25.000 la visita + repuestos' },
    { from: 'me', text: 'Bacán, ¿a las 3 te calza?' },
    { from: 'them', text: '¡Bacán! Llego a las 3 entonces' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        background: theme.surface, borderBottom: `1px solid ${theme.border}`, flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 6, cursor: 'pointer' }}>
          <PTIcon name="arrow-left" size={18} color={theme.ink} />
        </button>
        <PTAvatar size={36} theme={theme} label={chat.label} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: theme.ink, fontFamily: window.PT_FONT.display }}>{chat.nombre}</div>
          <div style={{ fontSize: 10.5, color: theme.green, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: 3, background: theme.green }}/> En línea
          </div>
        </div>
        <PTIcon name="phone" size={18} color={theme.ink} />
      </div>

      {/* Status banner */}
      <div style={{ padding: '8px 14px', background: theme.bgAlt, fontSize: 11.5, color: theme.inkSoft, textAlign: 'center', fontFamily: window.PT_FONT.body, flexShrink: 0 }}>
        Trabajo: <strong style={{ color: theme.ink }}>Reparar califont</strong> · Estado <strong style={{ color: chat.color }}>{chat.status}</strong>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '76%',
            background: m.from === 'me' ? theme.primary : theme.surface,
            color: m.from === 'me' ? '#fff' : theme.ink,
            padding: '9px 12px', borderRadius: 16,
            borderBottomRightRadius: m.from === 'me' ? 4 : 16,
            borderBottomLeftRadius: m.from === 'me' ? 16 : 4,
            border: m.from === 'me' ? 'none' : `1px solid ${theme.border}`,
            fontSize: 13, lineHeight: 1.4,
          }}>{m.text}</div>
        ))}
        {chat.status === 'Completado' && (
          <div style={{ alignSelf: 'center', marginTop: 10 }}>
            <PTButton theme={theme} variant="primary" size="md" icon="star">Calificar a {chat.nombre.split(' ')[0]}</PTButton>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', gap: 8, padding: 10, alignItems: 'center',
        background: theme.surface, borderTop: `1px solid ${theme.border}`, flexShrink: 0,
      }}>
        <button style={{ background: theme.bgAlt, border: 'none', width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <PTIcon name="paperclip" size={16} color={theme.ink} />
        </button>
        <div style={{
          flex: 1, height: 38, padding: '0 14px', borderRadius: 19,
          background: theme.bgAlt, display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12.5, color: theme.inkMuted,
        }}>Escribe un mensaje...</div>
        <button style={{
          width: 38, height: 38, borderRadius: 19, border: 'none',
          background: theme.grad, color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PTIcon name="send" size={15} color="#fff" />
        </button>
      </div>
    </div>
  );
}

// ───────────── Contact request notification (for maestro)
function ContactRequestToast({ theme, onAccept }) {
  return (
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 16, padding: 12,
      boxShadow: '0 16px 40px -12px rgba(0,0,0,.3)',
      borderLeft: `3px solid ${theme.primary}`,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <PTAvatar size={40} theme={theme} label="foto · maría" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: theme.ink, fontFamily: window.PT_FONT.display }}>María quiere contactarte</div>
          <div style={{ fontSize: 11, color: theme.inkSoft }}>Gásfiter urgente · hace 1 min</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        <PTButton theme={theme} variant="ghost" size="sm" full icon="x">Rechazar</PTButton>
        <PTButton theme={theme} variant="primary" size="sm" full icon="check" onClick={onAccept}>Atender</PTButton>
      </div>
    </div>
  );
}

Object.assign(window, { PTApp, ScreenChats, ChatDetail, ContactRequestToast });
