'use client';

import { AppProviders } from '@/lib/providers';
import { useAuthStore } from '@/lib/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, PlusCircle, User,
  Menu, X, LogOut, FileText, Star,
  ChevronRight, Wrench, Mail, Settings,
} from 'lucide-react';

// Routes that REQUIRE maestro auth. Anyone else is redirected to /maestro/login.
const MAESTRO_ROUTES = ['/app/publicaciones', '/app/perfil'];

function isMaestroRoute(pathname: string) {
  return MAESTRO_ROUTES.some((r) => pathname.startsWith(r));
}

// ============================================================
// Maestro drawer
// ============================================================

function MaestroDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    onClose();
    await signOut();
    router.push('/');
  };

  // Only items with real implementation. "Próximamente" placeholders removed.
  const menuItems = [
    { href: '/app/perfil/completar', icon: User, label: 'Mi perfil', sub: 'Editar información profesional' },
    { href: '/app/perfil', icon: Star, label: 'Mis reseñas', sub: 'Calificaciones recibidas' },
  ];

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 left-0 bottom-0 w-[300px] lg:w-[340px] bg-surface z-[70] shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
        <div className="bg-grad-cta p-5 pb-6 relative overflow-hidden">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-[52px] h-[52px] rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {user?.nombre?.charAt(0) || '?'}
            </div>
            <div>
              <p className="text-white font-extrabold text-[15px]">{user?.nombre}</p>
              <p className="text-white/70 text-[11.5px]">{user?.email}</p>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-[100px] h-[100px] rounded-full bg-white/10" />
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-5 py-[14px] hover:bg-bg-alt transition-colors"
            >
              <div className="w-[34px] h-[34px] rounded-[10px] bg-bg-alt flex items-center justify-center shrink-0">
                <item.icon size={15} className="text-ink" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-ink">{item.label}</p>
                <p className="text-[11px] text-ink-muted">{item.sub}</p>
              </div>
              <ChevronRight size={14} className="text-ink-muted" />
            </Link>
          ))}
        </div>

        <div className="border-t border-border p-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-[10px] rounded-[12px] bg-red-soft text-red text-[13px] font-bold hover:bg-red/10 transition-colors"
          >
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
}

// ============================================================
// Cliente Desktop Nav
// Cliente NO tiene cuenta persistente: solo "Buscar maestros",
// "Publicar trabajo" y "Mis publicaciones" (recuperación por email).
// ============================================================

function ClienteDesktopNav() {
  const pathname = usePathname();
  const onPublicar = pathname.startsWith('/app/publicar');

  const tabs = [
    { href: '/app', label: 'Buscar maestros', icon: Users },
    { href: '/app/publicar', label: '+ Publicar trabajo', icon: PlusCircle, highlight: true },
    { href: '/recuperar-publicacion', label: 'Mis publicaciones', icon: Mail },
  ];

  return (
    <header className="hidden lg:flex sticky top-0 z-50 h-16 bg-surface border-b border-border items-center px-8">
      <Link href="/app" className="shrink-0 mr-8">
        <span className="font-extrabold text-[18px] tracking-[-0.4px]">
          <span className="text-gradient">pololito</span>
          <span className="text-ink font-medium opacity-65">trabajos</span>
        </span>
      </Link>

      <nav className="flex items-center gap-1">
        {tabs.map(({ href, label, icon: Icon, ...rest }) => {
          const highlight = 'highlight' in rest ? rest.highlight : false;
          const active = href === '/app' ? pathname === '/app' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-[14px] py-[9px] rounded-xl text-[13px] font-bold transition-colors ${
                active
                  ? 'bg-primary-soft text-primary-deep'
                  : highlight
                  ? 'text-violet hover:bg-primary-soft/50'
                  : 'text-ink-muted hover:bg-bg-alt hover:text-ink'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      {!onPublicar && (
        <Link
          href="/maestro/login"
          className="flex items-center gap-2 px-4 py-[8px] rounded-full bg-grad-cta text-white text-[12px] font-bold hover:opacity-90 transition-opacity"
        >
          <Wrench size={13} />
          Soy maestro
        </Link>
      )}
    </header>
  );
}

// ============================================================
// Avatar popover (maestro only)
// ============================================================

function AvatarPopover({ user, onClose }: { user: any; onClose: () => void }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;
    import('@/lib/supabase').then(({ supabase }) => {
      supabase.from('maestro_profiles').select('oficio, disponible, experiencia_anios, rating_promedio, zona_cobertura')
        .eq('user_id', user.id).single().then(({ data }) => setProfile(data));
    });
  }, [user?.id]);

  return (
    <>
      <div className="fixed inset-0 z-[55]" onClick={onClose} />
      <div className="absolute right-0 top-[calc(100%+8px)] w-[260px] bg-surface rounded-[16px] border border-border shadow-xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="bg-grad-cta p-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {user?.nombre?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-extrabold text-[14px] truncate">{user?.nombre}</p>
              <p className="text-white/80 text-[11px]">
                {profile?.oficio || 'Maestro'}{user?.comuna ? ` · ${user.comuna}` : ''}
              </p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-[70px] h-[70px] rounded-full bg-white/10" />
        </div>

        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between px-2 py-[6px]">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${profile?.disponible ? 'bg-green' : 'bg-ink-muted'}`} />
              <span className="text-[12px] font-semibold text-ink">
                {profile?.disponible ? 'Disponible' : 'No disponible'}
              </span>
            </div>
            <span className="text-[11px] text-ink-muted flex items-center gap-1">
              <Star size={10} className="text-orange fill-orange" />
              {profile?.rating_promedio?.toFixed?.(1) || '0.0'}
            </span>
          </div>

          <div className="flex gap-2 px-1">
            <div className="flex-1 bg-bg-alt rounded-[10px] p-2 text-center">
              <p className="text-[14px] font-extrabold text-ink">{profile?.experiencia_anios || 0}</p>
              <p className="text-[10px] text-ink-muted">Años exp.</p>
            </div>
            <div className="flex-1 bg-bg-alt rounded-[10px] p-2 text-center">
              <p className="text-[14px] font-extrabold text-ink">{profile?.rating_promedio?.toFixed?.(1) || '0.0'}</p>
              <p className="text-[10px] text-ink-muted">Rating</p>
            </div>
          </div>

          <Link
            href="/app/perfil/completar"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-[8px] rounded-[10px] bg-primary-soft text-violet text-[12px] font-bold hover:bg-violet/15 transition-colors"
          >
            <Settings size={12} /> Editar perfil
          </Link>
        </div>
      </div>
    </>
  );
}

// ============================================================
// Maestro Desktop Nav
// Bell removed (no notification center implemented yet).
// ============================================================

function MaestroDesktopNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const tabs = [
    { href: '/app', label: 'Publicaciones', icon: FileText },
    { href: '/app/perfil', label: 'Mi perfil', icon: User },
  ];

  return (
    <>
      <header className="hidden lg:flex sticky top-0 z-50 h-16 bg-surface border-b border-border items-center px-8">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center hover:bg-bg-alt transition-colors mr-4"
        >
          <Menu size={18} className="text-ink" />
        </button>

        <Link href="/app" className="shrink-0 mr-8">
          <span className="font-extrabold text-[18px] tracking-[-0.4px]">
            <span className="text-gradient">pololito</span>
            <span className="text-ink font-medium opacity-65">trabajos</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = href === '/app' ? pathname === '/app' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-[14px] py-[9px] rounded-xl text-[13px] font-bold transition-colors ${
                  active
                    ? 'bg-primary-soft text-primary-deep'
                    : 'text-ink-muted hover:bg-bg-alt hover:text-ink'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="relative">
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="w-9 h-9 rounded-full bg-grad-cta flex items-center justify-center text-white text-[13px] font-bold shrink-0 hover:opacity-90 transition-opacity"
          >
            {user?.nombre?.charAt(0) || '?'}
          </button>
          {avatarOpen && <AvatarPopover user={user} onClose={() => setAvatarOpen(false)} />}
        </div>
      </header>
      <MaestroDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

// ============================================================
// Cliente Mobile Nav
// ============================================================

function ClienteMobileNav() {
  const pathname = usePathname();
  const onPublicar = pathname.startsWith('/app/publicar');

  const baseLinks = [
    { href: '/app', label: 'Buscar', icon: Users },
    { href: '/app/publicar', label: 'Publicar', icon: PlusCircle },
    { href: '/recuperar-publicacion', label: 'Mis pub.', icon: Mail },
  ];
  const links = onPublicar
    ? baseLinks
    : [...baseLinks, { href: '/maestro/login', label: 'Soy maestro', icon: Wrench }];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex items-stretch justify-around py-[8px] px-1 z-50 lg:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === '/app' ? pathname === '/app' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-[3px] flex-1 py-[6px] transition-colors ${
              active ? 'text-primary-deep' : 'text-ink-muted'
            }`}
          >
            <div className={`w-10 h-[26px] rounded-[13px] flex items-center justify-center transition-colors ${
              active ? 'bg-primary-soft' : ''
            }`}>
              <Icon size={18} />
            </div>
            <span className={`text-[10.5px] leading-none ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// ============================================================
// Maestro Mobile Nav
// ============================================================

function MaestroMobileNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = [
    { href: '/app', label: 'Feed', icon: FileText },
    { href: '/app/perfil', label: 'Perfil', icon: User },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex items-stretch justify-around py-[8px] px-1 z-50 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-[3px] flex-1 py-[6px] text-ink-muted"
        >
          <div className="w-10 h-[26px] rounded-[13px] flex items-center justify-center">
            <Menu size={18} />
          </div>
          <span className="text-[10.5px] leading-none font-medium">Menú</span>
        </button>
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === '/app' ? pathname === '/app' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-[3px] flex-1 py-[6px] transition-colors ${
                active ? 'text-primary-deep' : 'text-ink-muted'
              }`}
            >
              <div className={`w-10 h-[26px] rounded-[13px] flex items-center justify-center transition-colors ${
                active ? 'bg-primary-soft' : ''
              }`}>
                <Icon size={18} />
              </div>
              <span className={`text-[10.5px] leading-none ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </Link>
          );
        })}
      </nav>
      <MaestroDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

// ============================================================
// AppShell
// Demo mode REMOVED. Cliente anónimo navega libremente; maestro
// pages requieren auth y redirigen a /maestro/login si no hay session.
// ============================================================

function AppShell({ children }: { children: React.ReactNode }) {
  const { session, isLoading, viewMode } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!session;
  const isMaestroPage = isMaestroRoute(pathname);

  useEffect(() => {
    if (isLoading) return;
    if (isMaestroPage && !isAuthenticated) {
      router.replace('/maestro/login');
    }
  }, [isLoading, isAuthenticated, isMaestroPage, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-primary-soft border-t-violet rounded-full animate-spin" />
          <span className="text-sm text-ink-muted font-medium">Cargando...</span>
        </div>
      </div>
    );
  }

  if (isMaestroPage && !isAuthenticated) return null;

  const showMaestroNav = isAuthenticated && viewMode === 'maestro';

  return (
    <div className="min-h-screen bg-bg">
      {showMaestroNav ? <MaestroDesktopNav /> : <ClienteDesktopNav />}
      <main className="pb-[72px] lg:pb-0">
        {children}
      </main>
      {showMaestroNav ? <MaestroMobileNav /> : <ClienteMobileNav />}
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}
