# ANÁLISIS EXHAUSTIVO DEL PROYECTO — POLOLITOTRABAJOS

---

## A) NOMBRE DEL PROYECTO

**POLOLITOTRABAJOS**

---

## B) ¿QUÉ ES?

POLOLITOTRABAJOS es un **marketplace móvil multiplataforma** (iOS + Android + Web) que conecta clientes que necesitan trabajos puntuales de construcción, electricidad, gasfitería, carpintería, etc. ("pololitos") con maestros independientes que ofrecen esos servicios.

El mercado objetivo es **Chile**, usando lenguaje coloquial chileno. Es expansible a Latinoamérica.

El modelo de negocio actual es **gratuito (V1)**. Monetizaciones futuras planificadas: comisión por trabajo cerrado, posts destacados para maestros, suscripción premium.

---

## C) STACK TECNOLÓGICO

### Frontend — App Móvil
| Tecnología | Versión | Propósito |
|---|---|---|
| Expo | SDK 51 | Framework React Native |
| React Native | 0.74.5 | Core mobile |
| React | 18.2.0 | UI library |
| TypeScript | ^5.3.3 | Tipado estático |
| NativeWind | ^4.0.0 | Tailwind CSS para React Native |
| React Navigation (native-stack + bottom-tabs) | ^6.x | Navegación |
| TanStack React Query | ^5.51.0 | Data fetching/caching |
| Zustand | ^4.5.4 | State management |
| React Hook Form + Zod | ^7.52 / ^3.23 | Formularios + validación |
| Expo Linear Gradient | ~13.0.0 | Gradientes |
| Expo Image | ~1.13.0 | Imágenes optimizadas |
| Expo Location | ~17.0.0 | GPS |
| Expo Notifications | ~0.28.0 | Push notifications |
| Expo Secure Store | ~13.0.0 | Almacenamiento seguro tokens |
| React Native Reanimated | ~3.10.0 | Animaciones |
| React Native Web | ~0.19.10 | Soporte web desde RN |

### Frontend — Landing Web
| Tecnología | Versión | Propósito |
|---|---|---|
| Next.js | 14.2.10 | Framework web (App Router) |
| React | 18.2.0 | UI |
| Framer Motion | ^12.38.0 | Animaciones |
| Tailwind CSS | ^3.4.4 | Estilos |
| TypeScript | ^5.5.0 | Tipado |

### Backend / Base de Datos
| Tecnología | Detalle |
|---|---|
| **Supabase** | Auth + PostgreSQL + Realtime |
| PostgreSQL (via Supabase) | BD relacional con RLS |
| Supabase Auth | Autenticación OTP email |
| Supabase JS Client | ^2.45.0 |

### Deploy / Hosting
| Servicio | Uso |
|---|---|
| **Vercel** | Landing web (`pololitotrabajos`) + App web (`pololitotrabajos-app`) |
| **Supabase Cloud** | Backend, DB, Auth |
| **Expo EAS** | Build y deploy mobile (configurado) |

### Herramientas de desarrollo
| Herramienta | Propósito |
|---|---|
| pnpm | Package manager |
| Turborepo (turbo ^2.1.0) | Monorepo build system |
| Git | Control de versiones |
| Metro | Bundler mobile |

---

## D) ESTRUCTURA DE CARPETAS

```
pololitotrabajos/
├── apps/
│   ├── mobile/                          # App Expo (iOS + Android + Web)
│   │   ├── src/
│   │   │   ├── App.tsx                  # Entry point
│   │   │   ├── components/
│   │   │   │   ├── DesktopAuthShell.tsx
│   │   │   │   └── DesktopShell.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useMaestros.ts       # React Query hooks para Supabase
│   │   │   ├── lib/
│   │   │   │   └── supabase.ts          # Cliente Supabase configurado
│   │   │   ├── navigation/
│   │   │   │   ├── AuthStack.tsx
│   │   │   │   ├── MainTabs.tsx         # Tab navigation + responsive desktop/mobile
│   │   │   │   └── RootNavigator.tsx
│   │   │   ├── screens/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── WelcomeScreen.tsx
│   │   │   │   │   ├── SignupScreen.tsx
│   │   │   │   │   └── OtpVerifyScreen.tsx
│   │   │   │   ├── catalog/
│   │   │   │   │   ├── CatalogScreen.tsx        # Listado maestros (378 líneas)
│   │   │   │   │   └── MaestroDetailScreen.tsx  # Perfil maestro (285 líneas)
│   │   │   │   ├── chats/
│   │   │   │   │   ├── ChatListScreen.tsx
│   │   │   │   │   └── ChatDetailScreen.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   ├── ProfileClienteScreen.tsx
│   │   │   │   │   └── ProfileMaestroScreen.tsx
│   │   │   │   └── publish/
│   │   │   │       ├── FeedScreen.tsx
│   │   │   │       └── PublishFormScreen.tsx
│   │   │   └── store/
│   │   │       └── authStore.ts          # Zustand auth state
│   │   ├── assets/                       # Iconos, splash, favicon
│   │   ├── dist/                         # Build web desplegado en Vercel
│   │   ├── app.config.ts                 # Configuración Expo
│   │   ├── package.json
│   │   └── tailwind.config.ts
│   │
│   └── web/                              # Landing page (Next.js)
│       ├── app/
│       │   ├── page.tsx                  # Landing principal
│       │   ├── layout.tsx                # Root layout con fonts
│       │   ├── globals.css
│       │   └── legal/
│       │       ├── privacidad/page.tsx
│       │       └── terminos/page.tsx
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── Hero.tsx
│       │   ├── Stats.tsx
│       │   ├── HowItWorks.tsx
│       │   ├── Categories.tsx
│       │   ├── AppDownload.tsx
│       │   ├── PhoneMockup.tsx
│       │   ├── Testimonials.tsx
│       │   ├── Trust.tsx
│       │   ├── FinalCTA.tsx
│       │   └── Footer.tsx
│       └── package.json
│
├── packages/
│   └── shared/                           # Código compartido entre apps
│       └── src/
│           ├── constants/
│           │   ├── categories.ts         # 8 categorías de oficios
│           │   ├── comunas.ts            # ~45 comunas de Chile
│           │   └── copy.ts              # Strings UI en español chileno
│           ├── schemas/
│           │   ├── auth.schema.ts
│           │   ├── contact.schema.ts
│           │   ├── maestro.schema.ts     # Validación Zod perfil maestro
│           │   ├── publicacion.schema.ts # Validación Zod publicaciones
│           │   └── rating.schema.ts
│           ├── tokens/
│           │   ├── colors.ts
│           │   ├── spacing.ts
│           │   └── typography.ts
│           └── types/
│               ├── user.ts
│               ├── maestro.ts
│               ├── publicacion.ts
│               ├── rating.ts
│               └── chat.ts
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Schema completo de BD
│
├── prototype/                            # Prototipos de referencia visual (NO producción)
│   ├── POLOLITOTRABAJOS.html
│   ├── LANDINGS.html
│   ├── app.jsx
│   ├── landings-v2.jsx / v3.jsx / v3b.jsx
│   ├── screens-1.jsx / screens-2.jsx
│   ├── tokens.js
│   ├── primitives.jsx
│   └── design-canvas.jsx
│
├── ARCHITECTURE.md                       # Documentación de arquitectura
├── DESIGN_TOKENS.md                      # Tokens de diseño (colores, tipografía, spacing)
├── IMPLEMENTATION_PLAN.md                # Roadmap por fases
├── SCREENS.md                            # Spec de cada pantalla
├── API_SPEC.md                           # Especificación de API
├── PLATFORMS.md                          # Adaptaciones por plataforma
├── LANDING.md                            # Spec de landing
├── README.md                             # Overview general
├── package.json                          # Root monorepo
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
└── .env.local / .env.example
```

---

## E) FUNCIONALIDADES PRINCIPALES

### Implementadas (con código funcional):

1. **Autenticación completa** — Welcome → Signup → OTP Email → Session persistence (Supabase Auth)
2. **Modo demo** — Login sin backend para testing/desarrollo
3. **Catálogo de maestros** — Lista con búsqueda, filtros por especialidad, pull-to-refresh
4. **Detalle de maestro** — Perfil con bio, portafolio, ratings desglosados, zona de cobertura
5. **Publicar solicitud** — Formulario con título, descripción, especialidad, ubicación, fotos, urgencia
6. **Feed de publicaciones** — Vista maestro con publicaciones abiertas
7. **Chat** — Lista de conversaciones + detalle de chat individual
8. **Perfil cliente** — Vista y edición de datos personales
9. **Perfil maestro** — Gestión de especialidades, portafolio, disponibilidad
10. **Landing web pública** — Next.js con Hero, Stats, HowItWorks, Categories, Testimonials, Trust, Footer
11. **Páginas legales** — Privacidad y Términos de servicio
12. **Responsive design** — Layout desktop (sidebar nav) vs mobile (bottom tabs + drawer en web)
13. **Design system** — Tokens de color (3 paletas), tipografía, dark mode ready

### Planificadas pero no implementadas aún:

- Realtime chat (Socket.io — solo UI existe, no WebSocket)
- Push notifications (configurado pero sin backend)
- Sistema de ratings/calificaciones (modal UI pero sin flujo completo)
- Contact request flow (botones existen pero sin lógica backend)
- Verificación de maestros (V2)
- Pagos in-app (V2)
- Mapa con geolocalización de maestros
- Sistema de cotizaciones

---

## F) MÓDULOS / COMPONENTES CLAVE

### Navigation
- `RootNavigator` — Switch entre Auth y Main según sesión
- `AuthStack` — Welcome → Signup → OTP (con DesktopAuthShell para web)
- `MainTabs` — 4 tabs con layout responsive (desktop sidebar vs mobile bottom tabs)

### State
- `authStore` (Zustand) — Sesión, usuario, rol, demo mode, sign in/out

### Data Layer
- `supabase.ts` — Cliente configurado con SecureStore (mobile) / localStorage (web)
- `useMaestros` hook — Queries a Supabase con filtros de búsqueda y especialidad
- `useMaestroDetail` hook — Detalle + portafolio + ratings agregados

### Shared Package
- Tipos TypeScript (User, MaestroProfile, Publicacion, Rating, Chat)
- Schemas Zod (validación compartida frontend/backend)
- Constantes (8 categorías de oficios, ~45 comunas chilenas, copy UI)
- Design tokens (colores, spacing, typography)

### Screens (Total ~2,551 líneas de código en pantallas mobile)
- CatalogScreen (378 líneas) — La más completa, con gradient banner, search, chips
- ProfileMaestroScreen (347 líneas)
- PublishFormScreen (321 líneas)
- MaestroDetailScreen (285 líneas)

---

## G) TABLAS DE BASE DE DATOS (PostgreSQL/Supabase)

| Tabla | Descripción | Campos clave |
|---|---|---|
| `users` | Usuarios (clientes y maestros) | id, nombre, email, telefono, roles[], comuna, region |
| `categorias` | Categorías de oficios | nombre, icon, order |
| `comunas` | Comunas de Chile | nombre, region, lat, lng |
| `maestro_profiles` | Perfiles de maestros | oficio, especialidades[], bio, experiencia, zona, disponible |
| `portfolio_items` | Fotos de trabajos del maestro | image_url, caption, order |
| `publicaciones` | Solicitudes de trabajo | titulo, descripcion, especialidad, ubicacion, urgente, fotos[], estado |
| `contact_requests` | Solicitudes de contacto | from_id, to_id, context_type, status |
| `chats` | Conversaciones | client_id, maestro_id, estado, trabajo_titulo |
| `messages` | Mensajes individuales | chat_id, from_id, text, image_url, read_at |
| `ratings` | Calificaciones (4 dimensiones) | calidad, puntualidad, comunicacion, precio (1-5) |
| `direcciones` | Direcciones guardadas del usuario | label, detalle, lat, lng |
| `push_tokens` | Tokens para push notifications | token, platform (ios/android/web) |

### Enums:
- `user_role`: cliente, maestro
- `pub_estado`: abierta, cerrada, vencida
- `contact_ctx`: catalogo, publicacion
- `req_status`: pending, accepted, rejected, expired
- `chat_status`: nuevo, en_negociacion, aceptado, completado, rechazado

### Índices creados:
- maestro_profiles(user_id), publicaciones(autor_id), publicaciones(estado)
- messages(chat_id, created_at DESC), chats(client_id), chats(maestro_id)
- ratings(to_id), contact_requests(to_id, status)

---

## H) FLUJOS PRINCIPALES

### 1. Flujo del Cliente
```
Welcome → Signup (email) → OTP Verify → Catálogo de Maestros
                                            ↓
                                    Buscar/Filtrar por oficio
                                            ↓
                                    Ver detalle maestro → Contactar (chat) o Llamar
                                            ↓
                              Publicar solicitud de trabajo (fotos, ubicación, urgencia)
                                            ↓
                                    Recibir postulaciones de maestros
                                            ↓
                                    Chat → Negociar → Aceptar trabajo
                                            ↓
                                    Calificar maestro (4 dimensiones)
```

### 2. Flujo del Maestro
```
Welcome → Signup → Crear perfil maestro (oficio, bio, zona, portafolio)
                        ↓
              Feed de publicaciones cercanas → Postular
                        ↓
              Recibir solicitudes de contacto → Aceptar/Rechazar
                        ↓
              Chat con cliente → Negociar → Completar trabajo
                        ↓
              Recibir calificación
```

### 3. Flujo Web (Landing)
```
Landing pública → Hero con CTAs → Ver categorías/stats → Descargar app o Ir a web app
```

---

## I) ESTADO ACTUAL DEL PROYECTO

### ✅ COMPLETADO:
- Estructura monorepo (pnpm + turbo)
- Package shared con tipos, schemas, constantes
- App mobile con todas las pantallas UI implementadas
- Navegación completa (auth + main tabs + stacks anidados)
- Integración Supabase Auth (signup + OTP + session)
- Queries a Supabase para catálogo de maestros
- Layout responsive (desktop sidebar / mobile tabs / web drawer)
- Landing web en Next.js (completa, desplegada en Vercel)
- Migración SQL de base de datos aplicada en Supabase
- Design tokens documentados (3 paletas, dark mode)
- Documentación extensiva (README, Architecture, Implementation Plan, Screens, API Spec, etc.)
- Deploy configurado en Vercel (landing + app web)
- Configuración EAS para builds nativos

### 🟡 EN PROGRESO / PARCIAL:
- Chat (UI existe, pero realtime/WebSocket NO implementado — solo frontend)
- Ratings (UI parcial, falta flujo completo de calificar post-trabajo)
- Contact requests (botones existen pero sin lógica backend completa)
- Publicaciones (form completo, falta upload de fotos real a storage)
- Perfil maestro editable (UI existe, falta save completo)

### ❌ NO IMPLEMENTADO:
- Backend propio (Fastify/NestJS) — actualmente todo es client→Supabase directo
- Realtime/WebSocket (Socket.io)
- Push notifications (backend sender)
- Upload de imágenes a storage (R2/S3)
- Verificación de maestros
- Pagos
- Mapa con geolocalización
- Tests (E2E, unit)
- CI/CD pipeline
- Moderación de contenido
- Sistema de cotizaciones

### Estado general: **~40-50% del MVP completado** (UI bien avanzada, backend/integrations pendientes)

---

## J) PUNTOS IMPORTANTES A TENER EN CUENTA

1. **Arquitectura sin backend propio**: Todo el data access es directo de la app a Supabase (client-side queries). Para producción se necesita un backend (Fastify/NestJS) para lógica de negocio, validación server-side, y rate limiting.

2. **La migración SQL ya fue aplicada** en Supabase (fecha: 2026-05-03). La BD está creada y lista para usar.

3. **El pnpm-store está dentro del repo** (.pnpm-store/) — ocupa mucho espacio. Normalmente va en ~/.pnpm-store.

4. **Modo demo implementado**: El authStore tiene un `enterDemoMode()` que permite usar la app sin backend real, útil para desarrollo.

5. **Responsive avanzado**: El MainTabs detecta ancho >= 1024px para renderizar un DesktopShell con sidebar, y en mobile usa bottom tabs nativos o un drawer flotante en web.

6. **Strings en español chileno** con modismos (cachái, al tiro, pololito). Externalizados en `packages/shared/src/constants/copy.ts` para futura i18n.

7. **3 paletas de gradiente** disponibles: Atardecer (default, naranja→violeta), Fuego (naranja), Pololo (violeta). Solo Atardecer está implementada actualmente.

8. **No hay .gitignore para node_modules en root** — Verificar que el .gitignore está correctamente configurado.

9. **Plus Jakarta Sans** es la fuente principal — requiere expo-font para mobile y next/font para web (ambos configurados).

10. **Bundle identifier configurado**: `cl.pololitotrabajos.app` (iOS y Android).

---

## K) URLs, PROYECTOS Y CREDENCIALES PÚBLICAS

### URLs de Deploy
| Servicio | URL / ID |
|---|---|
| Landing Web (Vercel) | Proyecto: `pololitotrabajos` |
| App Web (Vercel) | Proyecto: `pololitotrabajos-app` / URL: `https://pololitotrabajos-app.vercel.app` |
| Vercel Org ID | `team_IgurUO7fDvKbiBsEK50WToAa` |
| Supabase Project | `rlqhailciopjjotmbzkf.supabase.co` |

### Credenciales Públicas (anon key — safe to expose)
| Variable | Valor |
|---|---|
| EXPO_PUBLIC_SUPABASE_URL | `https://rlqhailciopjjotmbzkf.supabase.co` |
| EXPO_PUBLIC_SUPABASE_ANON_KEY | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscWhhaWxjaW9wampvdG1iemtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3OTU0MTEsImV4cCI6MjA5MzM3MTQxMX0.eMTDuzj1162nS1AK1JM81EHV9hVnaZHPIq9DtrbCEW8` |

### Identificadores de App
| Plataforma | Bundle/Package |
|---|---|
| iOS | `cl.pololitotrabajos.app` |
| Android | `cl.pololitotrabajos.app` |
| Expo slug | `pololitotrabajos` |
| Deep link scheme | `pololitotrabajos://` |

### Variables necesarias (no configuradas aún)
- `SUPABASE_SERVICE_ROLE_KEY` — Para backend server-side
- `EXPO_PUBLIC_GOOGLE_MAPS_KEY` — Para mapas (opcional MVP)
- `SENTRY_DSN` — Para crash reporting
- `VERCEL_TOKEN` — Para deploy automático

---

## RESUMEN EJECUTIVO

POLOLITOTRABAJOS es un marketplace chileno de servicios de oficios (electricistas, gasfiteros, carpinteros, etc.) en etapa de desarrollo activo. La UI mobile está bien avanzada con ~3,300 líneas de código en pantallas funcionales, conectadas a Supabase para auth y data. La landing web está completa y desplegada. La base de datos está creada con un schema robusto de 12 tablas.

**Para continuar el desarrollo, las prioridades son:**
1. Implementar upload de imágenes (Supabase Storage o R2)
2. Completar el flujo de contact requests (backend logic)
3. Implementar realtime chat (Supabase Realtime o Socket.io)
4. Agregar push notifications
5. Backend server para lógica de negocio crítica
6. Testing y hardening pre-launch

**Estimación restante:** ~4-6 semanas con 1 dev fullstack para llegar a MVP deployable.
