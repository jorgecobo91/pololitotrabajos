'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMaestros, usePublicaciones } from '@/lib/hooks';
import { useAuthStore } from '@/lib/authStore';
import { OFICIOS } from '@/lib/constants';
import Link from 'next/link';
import {
  Search, Star, MapPin, SlidersHorizontal, Sparkles,
  Zap, Hammer, Droplets, HardHat, Paintbrush, KeyRound, Flower2, ChevronDown,
  ToggleLeft, ToggleRight, Sofa, Wrench, BrickWall, Fence, Flame, Monitor,
  Tv, GlassWater, Wind, Thermometer, ShieldCheck, Armchair, SprayCan, Bug,
  Waves, Droplet, TreePine, PenTool, Ruler, X, Clock, Send, User,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  'Electricista': Zap,
  'Gasfitería': Droplets,
  'Construcción': HardHat,
  'Carpintería': Hammer,
  'Pintura': Paintbrush,
  'Techumbre': HardHat,
  'Cerrajería': KeyRound,
  'Jardinería': Flower2,
  'Mueblería': Sofa,
  'Plomería': Droplet,
  'Albañilería': BrickWall,
  'Herrería': Fence,
  'Soldadura': Flame,
  'Instalación de equipos': Monitor,
  'Reparación de electrodomésticos': Tv,
  'Vidriería': GlassWater,
  'Ventilación y aire acondicionado': Wind,
  'Calefacción': Thermometer,
  'Insulación térmica': ShieldCheck,
  'Tapicería': Armchair,
  'Limpieza especializada': SprayCan,
  'Desinfección': Bug,
  'Mantenimiento de piscinas': Waves,
  'Riego y sistemas de riego': Droplet,
  'Arboricultura': TreePine,
  'Diseño de interiores': PenTool,
  'Arquitectura': Ruler,
};

const COMUNAS = [
  'Antofagasta', 'Calama', 'Tocopilla', 'Mejillones',
  'Taltal', 'San Pedro de Atacama', 'María Elena', 'Sierra Gorda', 'Ollagüe',
];

const RATINGS = [5, 4, 3];

interface Filtros {
  oficio: string;
  comuna: string;
  soloDisponibles: boolean;
  verificados: boolean;
  rating: number | null;
  search: string;
}

const FILTROS_INICIAL: Filtros = {
  oficio: '',
  comuna: '',
  soloDisponibles: false,
  verificados: false,
  rating: null,
  search: '',
};

function MaestroCard({ m }: { m: any }) {
  return (
    <Link
      href={`/app/maestro/${m.user_id}`}
      className="block bg-surface rounded-[18px] border border-border overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all"
    >
      <div className="flex lg:flex-col gap-[14px] p-[14px]">
        <div className="relative shrink-0 lg:flex lg:justify-center">
          <div className="w-[68px] h-[68px] lg:w-[72px] lg:h-[72px] rounded-full bg-primary-soft flex items-center justify-center text-violet font-bold text-xl overflow-hidden">
            {m.user?.foto_url ? (
              <img src={m.user.foto_url} alt="" className="w-full h-full object-cover" />
            ) : (
              m.user?.nombre?.charAt(0) || '?'
            )}
          </div>
          {m.disponible && (
            <div className="absolute bottom-[2px] right-[2px] lg:bottom-0 lg:right-auto lg:left-1/2 lg:translate-x-[18px] w-[14px] h-[14px] rounded-full bg-green border-[2.5px] border-surface" />
          )}
        </div>
        <div className="flex-1 min-w-0 lg:text-center">
          <div className="flex items-start justify-between gap-2 lg:flex-col lg:items-center">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.4px] text-violet mb-[1px]">{m.oficio}</p>
              <p className="text-[15.5px] lg:text-[14.5px] font-bold text-ink tracking-[-0.2px] truncate">{m.user?.nombre}</p>
            </div>
            <div className="flex items-center gap-[3px] bg-bg-alt px-2 py-1 rounded-lg shrink-0">
              <Star size={11} className="text-amber fill-amber" />
              <span className="text-[12px] font-bold text-ink">{(m.rating_promedio || 0).toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1 text-ink-muted text-[11.5px] lg:justify-center">
            <MapPin size={11} />
            <span className="truncate">{m.user?.comuna || 'Sin ubicación'}</span>
            <span className="mx-1 opacity-50">·</span>
            <span>{m.total_trabajos || 0} trabajos</span>
          </div>
          {m.bio && (
            <p className="mt-2 text-[12.5px] text-ink-soft leading-[1.4] line-clamp-2 lg:line-clamp-1">{m.bio}</p>
          )}
        </div>
      </div>
      <div className="px-[14px] pb-[14px]">
        <span className="block text-center py-2 rounded-[10px] bg-grad-cta text-white text-[12px] font-bold shadow-[0_6px_18px_-6px_rgba(0,0,0,0.28)] hover:opacity-90 transition-opacity">
          Ver perfil
        </span>
      </div>
    </Link>
  );
}

function DesktopSidebar({ filtros, setFiltros, allMaestros }: {
  filtros: Filtros;
  setFiltros: (f: Filtros) => void;
  allMaestros: any[];
}) {
  const countByCategory = (cat: string) =>
    allMaestros.filter((m: any) => m.oficio === cat || m.especialidades?.includes(cat)).length;

  const countByComuna = (comuna: string) =>
    allMaestros.filter((m: any) => {
      let zonas: string[] = [];
      try { zonas = typeof m.zona_cobertura === 'string' ? JSON.parse(m.zona_cobertura) : (m.zona_cobertura || []); } catch { zonas = []; }
      return zonas.includes(comuna) || m.user?.comuna === comuna;
    }).length;

  const hasActiveFilters = filtros.oficio || filtros.comuna || filtros.soloDisponibles || filtros.rating;

  return (
    <aside className="hidden lg:block w-[260px] shrink-0">
      <div className="sticky top-[80px] space-y-5 max-h-[calc(100vh-100px)] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
        {/* Categoría */}
        <div className="bg-surface rounded-[18px] border border-border p-[16px]">
          <h3 className="text-[11.5px] font-extrabold uppercase tracking-[0.5px] text-ink-muted mb-3">Categoría</h3>
          <div className="space-y-[2px]">
            {OFICIOS.map((label) => {
              const Icon = ICON_MAP[label] || Wrench;
              const active = filtros.oficio === label;
              const count = countByCategory(label);
              return (
                <button
                  key={label}
                  onClick={() => setFiltros({ ...filtros, oficio: active ? '' : label })}
                  className={`w-full flex items-center gap-[10px] px-[10px] py-[9px] rounded-xl text-[13px] font-semibold transition-colors ${
                    active
                      ? 'bg-primary-soft text-primary-deep'
                      : 'text-ink-soft hover:bg-bg-alt hover:text-ink'
                  }`}
                >
                  <Icon size={15} />
                  <span className="flex-1 text-left">{label}</span>
                  <span className={`text-[11px] font-bold ${active ? 'text-violet' : 'text-ink-muted'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comuna */}
        <div className="bg-surface rounded-[18px] border border-border p-[16px]">
          <h3 className="text-[11.5px] font-extrabold uppercase tracking-[0.5px] text-ink-muted mb-3">Comuna</h3>
          <div className="space-y-[2px]">
            {COMUNAS.map((c) => {
              const active = filtros.comuna === c;
              const count = countByComuna(c);
              return (
                <button
                  key={c}
                  onClick={() => setFiltros({ ...filtros, comuna: active ? '' : c })}
                  className={`w-full flex items-center gap-[10px] px-[10px] py-[9px] rounded-xl text-[13px] font-semibold transition-colors ${
                    active
                      ? 'bg-primary-soft text-primary-deep'
                      : 'text-ink-soft hover:bg-bg-alt hover:text-ink'
                  }`}
                >
                  <MapPin size={15} />
                  <span className="flex-1 text-left">{c}</span>
                  <span className={`text-[11px] font-bold ${active ? 'text-violet' : 'text-ink-muted'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-surface rounded-[18px] border border-border p-[16px]">
          <h3 className="text-[11.5px] font-extrabold uppercase tracking-[0.5px] text-ink-muted mb-3">Filtros</h3>
          <div className="space-y-3">
            <button
              onClick={() => setFiltros({ ...filtros, soloDisponibles: !filtros.soloDisponibles })}
              className="w-full flex items-center justify-between"
            >
              <span className="text-[13px] font-semibold text-ink">Solo disponibles</span>
              {filtros.soloDisponibles ? (
                <ToggleRight size={22} className="text-violet" />
              ) : (
                <ToggleLeft size={22} className="text-ink-muted" />
              )}
            </button>
            <button
              onClick={() => setFiltros({ ...filtros, verificados: !filtros.verificados })}
              className="w-full flex items-center justify-between"
            >
              <span className="text-[13px] font-semibold text-ink">Verificados</span>
              {filtros.verificados ? (
                <ToggleRight size={22} className="text-violet" />
              ) : (
                <ToggleLeft size={22} className="text-ink-muted" />
              )}
            </button>
          </div>
        </div>

        {/* Calificación */}
        <div className="bg-surface rounded-[18px] border border-border p-[16px]">
          <h3 className="text-[11.5px] font-extrabold uppercase tracking-[0.5px] text-ink-muted mb-3">Calificación</h3>
          <div className="flex gap-[6px]">
            {RATINGS.map((r) => {
              const active = filtros.rating === r;
              return (
                <button
                  key={r}
                  onClick={() => setFiltros({ ...filtros, rating: active ? null : r })}
                  className={`flex items-center gap-1 px-[10px] py-[6px] rounded-full text-[12px] font-semibold transition-colors ${
                    active
                      ? 'bg-primary-soft text-primary-deep'
                      : 'bg-bg-alt text-ink-soft hover:bg-primary-soft/50'
                  }`}
                >
                  <Star size={11} className={active ? 'fill-amber text-amber' : 'text-ink-muted'} />
                  {r}+
                </button>
              );
            })}
          </div>
        </div>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={() => setFiltros(FILTROS_INICIAL)}
            className="w-full flex items-center justify-center gap-2 py-[10px] rounded-[12px] bg-red-soft text-red text-[13px] font-bold hover:bg-red/10 transition-colors"
          >
            <X size={14} /> Limpiar filtros
          </button>
        )}
      </div>
    </aside>
  );
}

function MaestroFeed() {
  const { data: publicaciones, isLoading } = usePublicaciones();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-[18px] lg:px-6 py-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-[18px] border border-border p-[14px] animate-pulse">
            <div className="flex gap-[10px] items-center mb-3">
              <div className="w-[38px] h-[38px] rounded-full bg-bg-alt" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-bg-alt rounded w-28" />
                <div className="h-2.5 bg-bg-alt rounded w-40" />
              </div>
            </div>
            <div className="h-4 bg-bg-alt rounded w-48 mb-2" />
            <div className="h-3 bg-bg-alt rounded w-64" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="lg:max-w-5xl lg:mx-auto px-[18px] lg:px-6 py-4">
      <div className="sticky top-0 z-10 bg-bg pb-2">
        <h1 className="text-[22px] font-extrabold text-ink tracking-tight">Feed de pegas</h1>
        <p className="text-[12.5px] text-ink-muted mt-1 leading-[1.4]">
          Solicitudes cerca tuyo. Postúlate al tiro.
        </p>
      </div>

      {!publicaciones?.length ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-bg-alt flex items-center justify-center mx-auto mb-4">
            <Send size={24} className="text-ink-muted" />
          </div>
          <p className="font-extrabold text-ink">No hay trabajos disponibles</p>
          <p className="text-[13px] text-ink-muted mt-1">Vuelve pronto, se publican nuevos constantemente</p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col lg:grid lg:grid-cols-2 gap-3">
          {publicaciones.map((p: any) => (
            <Link
              key={p.id}
              href={`/app/publicaciones/${p.id}`}
              className="block bg-surface rounded-[18px] border border-border p-[14px] hover:border-border-strong hover:-translate-y-0.5 transition-all"
            >
              <div className="flex gap-[10px] items-center mb-[10px]">
                <div className="w-[38px] h-[38px] rounded-full bg-bg-alt flex items-center justify-center text-ink-muted text-sm font-bold shrink-0">
                  {p.autor?.nombre?.charAt(0) || <User size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-ink tracking-tight">{p.autor?.nombre || 'Cliente'}</p>
                  <div className="text-[11px] text-ink-muted flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(p.created_at).toLocaleDateString('es-CL')}
                    {p.ubicacion && (
                      <>
                        <span className="opacity-50 mx-0.5">·</span>
                        <MapPin size={10} />
                        {p.ubicacion}
                      </>
                    )}
                  </div>
                </div>
                {p.urgente && (
                  <div className="inline-flex items-center gap-1 bg-red-soft text-red px-2 py-[3px] rounded-full text-[10px] font-extrabold tracking-wide">
                    <Zap size={10} className="fill-red" />
                    URGENTE
                  </div>
                )}
              </div>

              <h4 className="text-[15px] font-extrabold text-ink tracking-tight leading-[1.25]">{p.titulo}</h4>
              <p className="mt-[6px] text-[12.5px] text-ink-soft leading-[1.45] line-clamp-2">{p.descripcion}</p>

              <div className="flex items-center justify-between mt-[10px] pt-[10px] border-t border-border">
                <div className="flex items-center gap-[6px]">
                  <span className="px-[10px] py-[5px] rounded-full text-[11px] font-semibold bg-surface border border-border text-ink-soft">
                    {p.especialidad}
                  </span>
                </div>
                <span className="inline-flex items-center gap-[6px] text-[12px] font-bold text-violet">
                  Ver detalle <Send size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function CatalogPage() {
  const searchParams = useSearchParams();
  const oficioParam = searchParams?.get('oficio') || '';
  const [filtros, setFiltros] = useState<Filtros>({
    ...FILTROS_INICIAL,
    oficio: oficioParam,
  });
  const { data: allMaestros, isLoading } = useMaestros({});

  // Actualiza filtro si cambia el query param
  useEffect(() => {
    if (oficioParam && filtros.oficio !== oficioParam) {
      setFiltros((f) => ({ ...f, oficio: oficioParam }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oficioParam]);

  const maestrosFiltrados = useMemo(() => {
    if (!allMaestros) return [];
    let results = [...allMaestros];

    if (filtros.oficio) {
      results = results.filter((m: any) =>
        m.oficio === filtros.oficio || m.especialidades?.includes(filtros.oficio)
      );
    }

    if (filtros.comuna) {
      results = results.filter((m: any) => {
        let zonas: string[] = [];
        try { zonas = typeof m.zona_cobertura === 'string' ? JSON.parse(m.zona_cobertura) : (m.zona_cobertura || []); } catch { zonas = []; }
        return zonas.includes(filtros.comuna) || m.user?.comuna === filtros.comuna;
      });
    }

    if (filtros.soloDisponibles) {
      results = results.filter((m: any) => m.disponible === true);
    }

    if (filtros.verificados) {
      results = results.filter((m: any) => m.accepted_terms === true);
    }

    if (filtros.rating) {
      results = results.filter((m: any) => (m.rating_promedio || 0) >= filtros.rating!);
    }

    if (filtros.search) {
      const s = filtros.search.toLowerCase();
      results = results.filter((m: any) =>
        m.user?.nombre?.toLowerCase().includes(s) ||
        m.oficio?.toLowerCase().includes(s) ||
        m.especialidades?.some((e: string) => e.toLowerCase().includes(s))
      );
    }

    return results;
  }, [allMaestros, filtros]);

  const hasActiveFilters = filtros.oficio || filtros.comuna || filtros.soloDisponibles || filtros.verificados || filtros.rating || filtros.search;

  const activeFilterLabels: string[] = [];
  if (filtros.oficio) activeFilterLabels.push(filtros.oficio);
  if (filtros.comuna) activeFilterLabels.push(filtros.comuna);
  if (filtros.soloDisponibles) activeFilterLabels.push('Disponibles');
  if (filtros.verificados) activeFilterLabels.push('Verificados');
  if (filtros.rating) activeFilterLabels.push(`${filtros.rating}+ estrellas`);

  return (
    <div className="lg:max-w-6xl lg:mx-auto">
      {/* ===== MOBILE HEADER ===== */}
      <div className="lg:hidden sticky top-0 z-10 bg-bg px-[18px] pt-4 pb-3">
        <div className="mb-[14px]">
          <p className="text-[12px] font-semibold text-ink-muted">Hola 👋</p>
          <h1 className="text-[24px] font-extrabold text-ink tracking-[-0.7px] leading-[1.15]">
            ¿Qué necesitas<br />arreglar hoy?
          </h1>
        </div>

        <div className="flex items-center gap-[10px] px-[14px] py-3 rounded-[14px] bg-surface border border-border">
          <Search size={16} className="text-ink-muted shrink-0" />
          <input
            type="text"
            value={filtros.search}
            onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
            placeholder="Buscar maestro u oficio..."
            className="flex-1 border-none bg-transparent outline-none text-[13.5px] text-ink placeholder:text-ink-soft"
          />
          {filtros.search && (
            <button onClick={() => setFiltros({ ...filtros, search: '' })} className="w-7 h-7 rounded-[10px] bg-bg-alt flex items-center justify-center">
              <X size={14} className="text-ink-muted" />
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-[18px] px-[18px]" style={{ scrollbarWidth: 'none' }}>
          {['Todos', ...OFICIOS].map((esp) => {
            const active = esp === 'Todos' ? !filtros.oficio : filtros.oficio === esp;
            return (
              <button
                key={esp}
                onClick={() => setFiltros({ ...filtros, oficio: esp === 'Todos' ? '' : (filtros.oficio === esp ? '' : esp) })}
                className={`whitespace-nowrap px-[14px] py-[7px] rounded-full text-[12.5px] font-semibold transition-colors shrink-0 ${
                  active
                    ? 'bg-violet text-white'
                    : 'bg-surface border border-border text-ink-soft hover:border-border-strong'
                }`}
              >
                {esp}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== DESKTOP HEADER ===== */}
      <div className="hidden lg:block px-6 pt-6 pb-2">
        <h1 className="text-[24px] font-extrabold text-ink tracking-[-0.5px]">¿Qué necesitas arreglar hoy?</h1>
        <p className="text-[13px] text-ink-muted mt-1">Encuentra maestros confiables cerca de ti</p>

        <div className="flex items-center gap-[10px] mt-4 px-[14px] py-3 rounded-[14px] bg-surface border border-border max-w-xl">
          <Search size={16} className="text-ink-muted shrink-0" />
          <input
            type="text"
            value={filtros.search}
            onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
            placeholder="Buscar maestro u oficio..."
            className="flex-1 border-none bg-transparent outline-none text-[13.5px] text-ink placeholder:text-ink-soft"
          />
          {filtros.search && (
            <button onClick={() => setFiltros({ ...filtros, search: '' })} className="w-7 h-7 rounded-[10px] bg-bg-alt flex items-center justify-center hover:bg-border transition-colors">
              <X size={14} className="text-ink-muted" />
            </button>
          )}
        </div>
      </div>

      {/* ===== MOBILE BANNER ===== */}
      <div className="lg:hidden px-[18px] pt-1">
        <div className="bg-grad-cta rounded-[18px] p-[14px_16px] flex items-center gap-3 text-white overflow-hidden relative">
          <div className="w-11 h-11 rounded-[14px] bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-extrabold leading-tight">Encuentra tu maestro</p>
            <p className="text-[11.5px] opacity-90 mt-0.5">Para cualquier pololito al tiro</p>
          </div>
          <div className="absolute -right-5 -top-5 w-[100px] h-[100px] rounded-full bg-white/10" />
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="lg:flex lg:gap-7 lg:px-6 lg:pt-4">
        <DesktopSidebar filtros={filtros} setFiltros={setFiltros} allMaestros={allMaestros || []} />

        <div className="flex-1 min-w-0">
          {/* Active filters bar */}
          {hasActiveFilters && (
            <div className="hidden lg:flex items-center gap-2 mb-4 flex-wrap">
              {activeFilterLabels.map((label) => (
                <span key={label} className="inline-flex items-center gap-1 px-3 py-[5px] rounded-full bg-primary-soft text-violet text-[12px] font-semibold">
                  {label}
                </span>
              ))}
              <button
                onClick={() => setFiltros(FILTROS_INICIAL)}
                className="inline-flex items-center gap-1 px-3 py-[5px] rounded-full text-[12px] font-semibold text-red hover:bg-red-soft transition-colors"
              >
                <X size={12} /> Limpiar
              </button>
            </div>
          )}

          {/* Desktop toolbar */}
          <div className="hidden lg:flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-extrabold text-ink tracking-[-0.2px]">
              {isLoading ? 'Cargando...' : `${maestrosFiltrados.length} maestros disponibles`}
            </h2>
            <button className="flex items-center gap-1 text-[12.5px] font-semibold text-ink-muted hover:text-ink shrink-0">
              Ordenar <ChevronDown size={14} />
            </button>
          </div>

          {/* Desktop banner */}
          <div className="hidden lg:block mb-5">
            <div className="bg-grad-cta rounded-[18px] p-[16px_20px] flex items-center gap-4 text-white overflow-hidden relative">
              <div className="w-12 h-12 rounded-[14px] bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Sparkles size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-extrabold leading-tight">Encuentra tu maestro ideal</p>
                <p className="text-[12.5px] opacity-90 mt-0.5">Para cualquier pololito al tiro</p>
              </div>
              <div className="absolute -right-6 -top-6 w-[120px] h-[120px] rounded-full bg-white/10" />
            </div>
          </div>

          {/* Mobile section title */}
          <div className="lg:hidden flex items-center justify-between px-[18px] pt-[18px] pb-2">
            <h2 className="text-[16px] font-extrabold text-ink tracking-[-0.3px]">
              {isLoading ? 'Cargando...' : `${maestrosFiltrados.length} maestros disponibles`}
            </h2>
            <button className="text-[12px] font-semibold text-violet">Ordenar</button>
          </div>

          {/* Cards */}
          <div className="px-[18px] lg:px-0 pb-6">
            {isLoading ? (
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface rounded-[18px] border border-border p-[14px] animate-pulse">
                    <div className="flex lg:flex-col gap-[14px]">
                      <div className="w-[68px] h-[68px] lg:w-[72px] lg:h-[72px] rounded-full bg-bg-alt shrink-0 lg:mx-auto" />
                      <div className="flex-1 space-y-2 lg:text-center">
                        <div className="h-3 bg-bg-alt rounded w-20 lg:mx-auto" />
                        <div className="h-4 bg-bg-alt rounded w-36 lg:mx-auto" />
                        <div className="h-3 bg-bg-alt rounded w-48 lg:mx-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !maestrosFiltrados.length ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center mx-auto mb-4">
                  <HardHat size={24} className="text-violet" />
                </div>
                <p className="font-extrabold text-ink text-[16px]">
                  {hasActiveFilters ? 'No encontramos maestros' : 'Aún no hay maestros registrados'}
                </p>
                <p className="text-[13px] text-ink-muted mt-1 max-w-xs mx-auto">
                  {hasActiveFilters
                    ? 'Intenta cambiar los filtros de búsqueda'
                    : 'Pronto se unirán maestros a la plataforma. Vuelve a revisar más adelante.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={() => setFiltros(FILTROS_INICIAL)}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-[10px] rounded-xl bg-primary-soft text-violet text-[13px] font-bold hover:bg-violet/15 transition-colors"
                  >
                    <X size={14} /> Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3">
                {maestrosFiltrados.map((m: any) => (
                  <MaestroCard key={m.user_id} m={m} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppPage() {
  const { viewMode } = useAuthStore();
  return viewMode === 'maestro' ? <MaestroFeed /> : <CatalogPage />;
}
