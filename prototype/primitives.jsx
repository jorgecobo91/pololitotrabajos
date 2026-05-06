// POLOLITOTRABAJOS — Reusable primitives
// Phone shell, headers, bottom nav, avatars, chips, buttons, placeholders.

const PT_PHONE_W = 380;
const PT_PHONE_H = 780;

// ───────────── Custom phone shell (uses our colors, not Material teal)
function PTPhone({ theme, children, statusDark }) {
  const dark = statusDark ?? theme.dark;
  return (
    <div style={{
      width: PT_PHONE_W, height: PT_PHONE_H, borderRadius: 36, overflow: 'hidden',
      background: theme.bg,
      border: `8px solid ${theme.dark ? '#1f1d1b' : '#2a2724'}`,
      boxShadow: '0 30px 80px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.08)',
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
      position: 'relative',
      fontFamily: window.PT_FONT.body,
      color: theme.ink,
    }}>
      <PTStatusBar dark={dark} ink={theme.ink} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {children}
      </div>
      <PTGestureBar ink={theme.ink} />
    </div>
  );
}

function PTStatusBar({ ink }) {
  return (
    <div style={{
      height: 32, padding: '6px 22px 0', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      fontFamily: window.PT_FONT.body, position: 'relative', flexShrink: 0,
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: ink, letterSpacing: 0.2 }}>9:41</span>
      <div style={{
        position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
        width: 90, height: 22, borderRadius: 12, background: '#0a0a0a',
      }} />
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', color: ink }}>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M0 8h2v2H0V8zm4-2h2v4H4V6zm4-3h2v7H8V3zm4-3h2v10h-2V0z"/></svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M7 1.5c1.6 0 3.2.6 4.4 1.7l1.1-1.2A8 8 0 007 0a8 8 0 00-5.5 2L2.6 3.2A6.4 6.4 0 017 1.5zm0 3.2c.9 0 1.7.3 2.3.9l1.1-1.2A4.8 4.8 0 007 3.2a4.8 4.8 0 00-3.4 1.4l1.1 1.2c.6-.6 1.4-.9 2.3-.9zM7 8L9 6a2.8 2.8 0 00-4 0l2 2z"/></svg>
        <div style={{ width: 22, height: 11, borderRadius: 3, border: '1.2px solid currentColor', position: 'relative', padding: 1.5, boxSizing: 'border-box' }}>
          <div style={{ width: '78%', height: '100%', background: 'currentColor', borderRadius: 1 }} />
          <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 5, background: 'currentColor', borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}

function PTGestureBar({ ink }) {
  return (
    <div style={{ height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: 120, height: 4, borderRadius: 2, background: ink, opacity: 0.5 }} />
    </div>
  );
}

// ───────────── Bottom nav
function PTBottomNav({ theme, current, onTab }) {
  const tabs = [
    { id: 'catalog', label: 'Maestros', icon: 'users' },
    { id: 'publish', label: 'Publicar', icon: 'plus' },
    { id: 'chats', label: 'Chats', icon: 'chat' },
    { id: 'profile', label: 'Perfil', icon: 'user' },
  ];
  return (
    <div style={{
      borderTop: `1px solid ${theme.border}`,
      background: theme.surface,
      padding: '8px 4px 6px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'stretch',
      flexShrink: 0,
    }}>
      {tabs.map(t => {
        const active = current === t.id;
        return (
          <button key={t.id} onClick={() => onTab && onTab(t.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 10px', borderRadius: 12, flex: 1,
            color: active ? theme.primary : theme.inkMuted,
            fontFamily: window.PT_FONT.body,
          }}>
            <div style={{
              width: 40, height: 26, borderRadius: 13,
              background: active ? theme.primarySoft : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .15s',
            }}>
              <PTIcon name={t.icon} size={18} color={active ? theme.primaryDeep : theme.inkMuted} filled={active} />
            </div>
            <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500, letterSpacing: 0.1 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ───────────── Logo (wordmark)
function PTLogo({ theme, size = 18, mono = false }) {
  return (
    <span style={{
      fontFamily: window.PT_FONT.display,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: -0.4,
      lineHeight: 1,
      color: mono ? theme.ink : 'transparent',
      background: mono ? 'none' : theme.grad,
      WebkitBackgroundClip: mono ? 'initial' : 'text',
      backgroundClip: mono ? 'initial' : 'text',
      display: 'inline-block',
    }}>
      pololito<span style={{ fontWeight: 500 }}>trabajos</span>
    </span>
  );
}

// ───────────── Avatar placeholder (monospace label, striped)
function PTAvatar({ size = 56, label = 'foto', theme, ring }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2, flexShrink: 0,
      background: `repeating-linear-gradient(45deg, ${theme.bgAlt} 0 6px, ${theme.surface} 6px 12px)`,
      border: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: window.PT_FONT.mono,
      fontSize: Math.max(8, size * 0.16),
      color: theme.inkMuted,
      boxShadow: ring ? `0 0 0 3px ${theme.primarySoft}, 0 0 0 4px ${theme.primary}` : 'none',
      overflow: 'hidden',
      letterSpacing: -0.3,
    }}>{label}</div>
  );
}

// ───────────── Image placeholder (rectangular)
function PTImagePlaceholder({ w = '100%', h = 140, label = 'imagen', theme, radius = 12 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: `repeating-linear-gradient(45deg, ${theme.bgAlt} 0 8px, ${theme.surface} 8px 16px)`,
      border: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: window.PT_FONT.mono, fontSize: 10, color: theme.inkMuted,
      letterSpacing: -0.2, flexShrink: 0,
    }}>// {label}</div>
  );
}

// ───────────── Pill / Chip
function PTChip({ children, theme, active, onClick, accent, icon, size = 'md' }) {
  const padding = size === 'sm' ? '5px 10px' : '7px 14px';
  const fs = size === 'sm' ? 11 : 12.5;
  return (
    <button onClick={onClick} style={{
      padding, borderRadius: 999, fontSize: fs, fontWeight: 600,
      border: `1px solid ${active ? 'transparent' : theme.border}`,
      background: active ? (accent || theme.ink) : theme.surface,
      color: active ? (theme.dark && !accent ? theme.bg : '#fff') : theme.inkSoft,
      fontFamily: window.PT_FONT.body, cursor: onClick ? 'pointer' : 'default',
      display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
      lineHeight: 1.2, flexShrink: 0,
    }}>
      {icon && <PTIcon name={icon} size={12} color={active ? '#fff' : theme.inkSoft} />}
      {children}
    </button>
  );
}

// ───────────── Button — gradient primary, outline secondary
function PTButton({ children, theme, variant = 'primary', size = 'md', icon, onClick, full, style }) {
  const styles = {
    primary: { background: theme.grad, color: '#fff', border: 'none' },
    solid: { background: theme.ink, color: theme.bg, border: 'none' },
    outline: { background: 'transparent', color: theme.ink, border: `1.5px solid ${theme.borderStrong}` },
    ghost: { background: theme.bgAlt, color: theme.ink, border: 'none' },
    soft: { background: theme.primarySoft, color: theme.primaryDeep, border: 'none' },
  }[variant];
  const sizing = {
    sm: { padding: '8px 12px', fontSize: 12, borderRadius: 10 },
    md: { padding: '11px 18px', fontSize: 13.5, borderRadius: 12 },
    lg: { padding: '15px 22px', fontSize: 15, borderRadius: 14 },
  }[size];
  return (
    <button onClick={onClick} style={{
      ...styles, ...sizing,
      fontFamily: window.PT_FONT.body, fontWeight: 700, letterSpacing: 0.1,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: 8, width: full ? '100%' : 'auto',
      boxShadow: variant === 'primary' ? '0 6px 18px -6px rgba(0,0,0,.28)' : 'none',
      transition: 'transform .1s', ...style,
    }}>
      {icon && <PTIcon name={icon} size={size === 'sm' ? 13 : 15} color="currentColor" />}
      {children}
    </button>
  );
}

// ───────────── Iconset (lucide-style stroked icons, custom paths)
function PTIcon({ name, size = 16, color = 'currentColor', filled = false, stroke = 1.8 }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: filled ? color : 'none', stroke: color, strokeWidth: stroke,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'users': return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'plus': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>;
    case 'chat': return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'user': return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>;
    case 'filter': return <svg {...props}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>;
    case 'star': return <svg {...{...props, fill: filled ? color : 'none'}}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
    case 'pin': return <svg {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case 'phone': return <svg {...{...props, fill: filled ? color : 'none'}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>;
    case 'send': return <svg {...{...props, fill: filled ? color : 'none'}}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case 'arrow-left': return <svg {...props}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
    case 'check': return <svg {...props}><path d="M20 6 9 17l-5-5"/></svg>;
    case 'x': return <svg {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case 'camera': return <svg {...props}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
    case 'image': return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>;
    case 'bell': return <svg {...{...props, fill: filled ? color : 'none'}}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
    case 'zap': return <svg {...{...props, fill: filled ? color : 'none'}}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
    case 'tools': return <svg {...props}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2 2-2-2 2-2-1-1z"/></svg>;
    case 'check-circle': return <svg {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>;
    case 'edit': return <svg {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case 'chevron-down': return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case 'chevron-right': return <svg {...props}><path d="m9 18 6-6-6-6"/></svg>;
    case 'briefcase': return <svg {...props}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
    case 'settings': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case 'shield': return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'sparkles': return <svg {...props}><path d="M12 3v3M12 18v3M5 12H2M22 12h-3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>;
    case 'map': return <svg {...props}><path d="M9 2 3 4v18l6-2 6 2 6-2V2l-6 2-6-2z"/><path d="M9 2v18M15 4v18"/></svg>;
    case 'clock': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'mic': return <svg {...{...props, fill: filled ? color : 'none'}}><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M19 11a7 7 0 0 1-14 0M12 19v3"/></svg>;
    case 'paperclip': return <svg {...props}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>;
    case 'thumbs-up': return <svg {...props}><path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.95 2.44l-1.34 6A2 2 0 0 1 18.49 20H7V10l4.66-9.31A1 1 0 0 1 13.27 1L14 1.59A2 2 0 0 1 14.61 4l-1 1.88z"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

// ───────────── Star rating
function PTStars({ value, size = 12, theme, gap = 1 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span style={{ display: 'inline-flex', gap, alignItems: 'center', color: '#F59E0B' }}>
      {[0,1,2,3,4].map(i => {
        const filled = i < full || (i === full && half);
        return <PTIcon key={i} name="star" size={size} filled={filled} color={filled ? '#F59E0B' : (theme?.border || '#E8E4DC')} stroke={1.5} />;
      })}
    </span>
  );
}

// ───────────── Section card
function PTCard({ children, theme, padding = 16, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: theme.surface, borderRadius: 18,
      border: `1px solid ${theme.border}`,
      padding, ...style,
      cursor: onClick ? 'pointer' : 'default',
    }}>{children}</div>
  );
}

// ───────────── Toast (notification)
function PTToast({ theme, kind = 'info', icon, title, body, onClose }) {
  const tone = kind === 'success' ? theme.green : kind === 'urgent' ? theme.red : theme.primary;
  return (
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 16, padding: '12px 14px',
      boxShadow: '0 12px 30px -12px rgba(0,0,0,.25)',
      display: 'flex', gap: 12, alignItems: 'flex-start',
      borderLeft: `3px solid ${tone}`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: kind === 'success' ? theme.greenSoft : kind === 'urgent' ? theme.redSoft : theme.primarySoft,
        color: tone,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <PTIcon name={icon || 'bell'} size={16} color={tone} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.ink, lineHeight: 1.3 }}>{title}</div>
        {body && <div style={{ fontSize: 12, color: theme.inkSoft, lineHeight: 1.4, marginTop: 2 }}>{body}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} style={{
          border: 'none', background: 'transparent', color: theme.inkMuted,
          padding: 4, cursor: 'pointer', display: 'flex',
        }}><PTIcon name="x" size={14} color={theme.inkMuted} /></button>
      )}
    </div>
  );
}

// ───────────── Section title
function PTSectionTitle({ children, theme, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 18px' }}>
      <h3 style={{
        fontFamily: window.PT_FONT.display, fontSize: 16, fontWeight: 800,
        color: theme.ink, margin: 0, letterSpacing: -0.3,
      }}>{children}</h3>
      {action && (
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: theme.primary, fontWeight: 600, fontSize: 12,
          fontFamily: window.PT_FONT.body, padding: 0,
        }}>{action}</button>
      )}
    </div>
  );
}

Object.assign(window, {
  PTPhone, PTBottomNav, PTLogo, PTAvatar, PTImagePlaceholder,
  PTChip, PTButton, PTIcon, PTStars, PTCard, PTToast, PTSectionTitle,
  PT_PHONE_W, PT_PHONE_H,
});
