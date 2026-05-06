# POLOLITOTRABAJOS — Reporte completo del producto

Documento de referencia exhaustivo para compartir con otras IAs. Última actualización: 2026-05-05.

---

## 1. Resumen ejecutivo

**POLOLITOTRABAJOS** es un marketplace web + mobile chileno que conecta clientes con maestros (electricistas, gasfiteros, carpinteros, pintores, jardineros, paneleros solares, etc.) para trabajos puntuales del hogar, ampliaciones, emergencias y servicios especializados.

- **URL producción**: https://pololitotrabajos.vercel.app
- **País**: Chile (cobertura inicial: regiones Antofagasta, Metropolitana, Valparaíso)
- **Estado**: MVP funcional desplegado en producción. Sin usuarios reales aún. Pre-validación de mercado.
- **"Pololito"**: chilenismo para "trabajo pequeño/esporádico". El nombre apunta directamente al nicho.

---

## 2. El problema que resuelve

### Para el cliente (dueño de hogar)
- Buscar gasfiter/electricista/etc. de confianza es difícil. Las opciones actuales son:
  - **Boca a boca**: lento, depende de qué conocidos tengas.
  - **Grupos de Facebook / Marketplace**: caos, sin reseñas, gente que no responde, escasa confianza.
  - **TodoMaestro y similares**: marketplaces existentes pero con UX pobre, formularios largos, requieren registro.
- Cuando hay emergencia (calefón roto en invierno, fuga de agua, luz cortada), nadie contesta o todos están copados.
- Cuando es un trabajo más grande (ampliación, paneles solares, instalación SEC), no se sabe a quién creer entre 3 cotizaciones distintas.

### Para el maestro (trabajador del oficio)
- **Sin canal de adquisición digital**: depende de boca a boca y referidos.
- **Trabajo bueno no se ve**: 15 años de experiencia y portafolio en el celular, pero sin perfil público que lo respalde.
- **Selección adversa en redes sociales**: compite con 30 más por el mismo trabajo en grupos de Facebook.
- **Sin reputación acumulable**: cada cliente nuevo te mira con dudas porque no hay historial verificable.

---

## 3. La solución (modelo)

### Asimetría intencional cliente/maestro
- **Cliente: anónimo total**. Publica en 30 segundos sin crear cuenta. Solo email + teléfono. Recibe link privado por correo para ver respuestas.
- **Maestro: cuenta persistente**. Registro con email + password + verificación. Perfil completo: foto, oficio, especialidades, comunas que cubre, portafolio, calificaciones reales acumulables.

### Dos flujos de descubrimiento
1. **Catálogo (cliente busca activamente)**: cliente entra a `/app`, filtra por oficio + comuna + rating, ve perfiles de maestros, decide a quién contactar.
2. **Publicación (cliente espera ofertas)**: cliente publica trabajo con fotos opcionales. Sistema notifica por email a los maestros que matchean oficio + comuna + disponibilidad. Maestros responden con propuesta (presupuesto + tiempo + mensaje). Cliente compara y elige.

### Contacto: WhatsApp + llamada (NO chat in-app)
Decisión estratégica: no construir chat. Una vez el cliente elige un maestro, se contactan **directo por WhatsApp o llamada** (canal donde los chilenos ya están). Esto:
- Reduce fricción técnica y costos de infraestructura
- Mantiene la conversación donde la gente ya conversa
- Hace al producto más simple

### Cierre del ciclo y reseñas
Cuando el trabajo termina, el cliente vuelve a su link privado, marca "Cerrar publicación", elige al maestro que lo hizo, y lo califica inline (4 dimensiones: calidad, puntualidad, comunicación, precio). El rating del maestro se actualiza automáticamente (trigger SQL). Esto crea el **flywheel de reputación** que es el verdadero moat del producto.

---

## 4. Modelo de negocio

### Estado actual
- **Gratis para ambos lados**. Sin comisiones, sin suscripciones, sin take rate sobre transacciones.
- Justificación: para que el flywheel de reputación arranque hace falta volumen. Cobrar antes mata el cold start.

### Monetización potencial (no implementada)
1. **Maestro: pago por lead** — cobrar $3.000 CLP por publicación a la que el maestro responde y termina contactando al cliente.
2. **Maestro: suscripción premium** — perfil destacado en catálogo, badge "verificado", primera posición en notificaciones.
3. **Servicios financieros adyacentes** (long-term): el rating + historial de trabajos del maestro se convierte en score crediticio. Adyacencia tipo Konfío.
4. **Datos de demanda agregados** (long-term): mapa de calor de oficios por comuna vendible a Sodimac, Easy, aseguradoras.
5. **Garantía/escrow opcional al cliente** (long-term): 3% sobre el trabajo a cambio de garantía de satisfacción.

---

## 5. Target users

### Cliente
- **Demografía**: chileno adulto 25-65, urbano, con vivienda propia o arriendo, ingreso medio-bajo a medio-alto.
- **Necesidad**: trabajo puntual ($30K-$500K CLP típicamente).
- **Frecuencia**: ocasional (1-3 veces al año por hogar promedio).
- **Comportamiento**: usuario de WhatsApp, busca soluciones rápidas, no quiere apps complicadas, no quiere crear cuentas.

### Maestro
- **Demografía**: chileno adulto 22-60, oficio manual, trabajo independiente, formal o informal.
- **Necesidad**: flujo constante de pega + acumular reputación visible.
- **Comportamiento**: smartphone Android principalmente, usa WhatsApp + Facebook Marketplace + grupos. Busca canal extra de leads sin pagar mensualidad obligatoria.

---

## 6. Stack tecnológico y arquitectura

### Frontend
- **Web**: Next.js 14.2.10 (App Router), TypeScript, Tailwind CSS, Framer Motion (animaciones landing), TanStack React Query, Zustand (auth state), react-hook-form + Zod (validación), lucide-react (iconos).
- **Mobile**: Expo SDK 51, React Native 0.74.x, NativeWind (Tailwind para RN). Compila a iOS, Android y web (RN-Web).

### Backend
- **Supabase**: PostgreSQL + Auth + Storage + RLS.
- **Resend**: emails transaccionales.
- **Vercel**: hosting + serverless functions (las API routes de Next.js).

### Monorepo
- pnpm workspaces + Turborepo
- `apps/web` — frontend web (producción activa)
- `apps/mobile` — Expo (con gaps respecto al web, ver sección 11)
- `packages/shared` — schemas Zod, constantes (oficios, comunas), types compartidos

### Infraestructura
- DB Supabase: project `pololitotrabajos` (id `rlqhailciopjjotmbzkf`, región sa-east-1)
- Vercel: project `pololitotrabajos`, custom domain pendiente (hoy `pololitotrabajos.vercel.app`)
- Storage buckets:
  - `publicacion-fotos` (público, 5MB max, JPG/PNG/WebP/HEIC) — fotos del trabajo subidas por cliente
  - `maestro-fotos` (público, 5MB max) — avatar y portafolio del maestro

---

## 7. Esquema de base de datos

### Tablas principales

**`users`** (perfil público de usuarios autenticados)
- `id` UUID — FK a `auth.users.id`
- `email`, `nombre`, `telefono`, `foto_url`, `comuna`, `region`
- `roles` array de enum `user_role` ('cliente' | 'maestro')
- `created_at`, `updated_at`

**`maestro_profiles`** (perfil profesional extendido)
- `id` UUID PK
- `user_id` FK a `users.id` (1:1)
- `oficio` (uno de 27 oficios canónicos)
- `especialidades` array text (subdivisiones del oficio)
- `bio` text, `experiencia_anios` int
- `zona_cobertura` JSON string (array de comunas)
- `telefono_publico` boolean (toggle cliente puede ver teléfono)
- `disponible` boolean (apagado = no aparece en catálogo)
- `disponible_urgencias` boolean
- `rating_promedio` numeric, `total_ratings` int, `total_trabajos` int (calculados por trigger)
- `accepted_terms` boolean, `accepted_terms_at`, `terms_version`

**`portfolio_items`**
- `id`, `maestro_id` FK a `maestro_profiles.id`, `image_url`, `caption`, `order`, `created_at`

**`publicaciones`** (trabajos publicados por clientes)
- `id` UUID PK, `token_acceso` UUID (link privado del cliente)
- `autor_id` UUID nullable (NULL = cliente anónimo)
- `titulo`, `descripcion`, `especialidad` (oficio target), `region`, `comuna`, `ubicacion` (texto libre)
- `nombre_cliente`, `email_cliente`, `telefono_cliente`
- `mostrar_email`, `mostrar_telefono` booleans (toggle privacidad)
- `urgente`, `presupuesto_min`, `presupuesto_max`
- `fotos` array text (URLs)
- `estado` enum `pub_estado` ('abierta' | 'cerrada' | 'vencida')
- `maestro_ganador_id` FK a `users.id` (cuando cliente cierra y elige maestro)
- `cerrada_at`, `created_at`, `updated_at`, `accepted_terms`

**`respuestas_maestro`** (propuesta de maestro a una publicación)
- `id`, `publicacion_id` FK, `maestro_id` FK
- `presupuesto` int nullable (null = "a convenir"), `tiempo_entrega` text, `mensaje` text
- UNIQUE constraint `(publicacion_id, maestro_id)` — un maestro 1 propuesta por publicación

**`ratings`** (reseñas de cliente sobre maestro)
- `id`, `from_id` nullable (cliente anónimo), `to_id` FK a maestro
- `publicacion_id`, `respuesta_id` (contexto)
- `calidad`, `puntualidad`, `comunicacion`, `precio` int 1-5
- `comentario` text nullable
- Trigger `recalc_maestro_rating` actualiza automáticamente `maestro_profiles.rating_promedio` y `total_ratings`

**`rating_tokens`** (tokens efímeros para que cliente anónimo califique)
- `id`, `token` UUID, `respuesta_id`, `maestro_id`, `cliente_email`
- `rating_status` ('pending' | 'completed'), `expires_at` (TTL 14 días)

**`categorias`, `comunas`** — tablas de catálogo (referencia)

### Tablas eliminadas (decisión de producto)
- `chats`, `messages`, `contact_requests`, `push_tokens` — el chat in-app fue removido a propósito. Toda la comunicación cliente↔maestro ocurre fuera de la plataforma (WhatsApp/llamada).

### RLS (Row Level Security) — estado actual
- ✅ `respuestas_maestro`: maestro lee/escribe las suyas, autor lee las de su publicación
- ✅ `rating_tokens`: lectura solo via service role API (cerrado público)
- ✅ `publicaciones`: estado=abierta lectura para maestros autenticados; autor lee suyas
- ✅ `ratings`: lectura pública (es la propuesta de valor del maestro)
- ✅ `portfolio_items`, `maestro_profiles`, `categorias`, `comunas`: lectura pública
- ⚠️ `users.users_select_all` (qual: true) — permite a cualquier autenticado leer email/teléfono. Pendiente de tightening.

### Triggers SQL clave
- `trg_recalc_rating` → al insertar/update/delete en `ratings`, recalcula promedio del maestro
- `trg_incrementar_trabajos` → al cerrar publicación con maestro_ganador, suma a su `total_trabajos`

---

## 8. Mapa completo de rutas y pantallas (web)

### Públicas (sin auth)
| Ruta | Propósito |
|---|---|
| `/` | Landing page con animaciones (Hero, Pain, HowItWorks toggle cliente/maestro, Categorías, AppDownload, Trust, FinalCTA, Footer) |
| `/legal/terminos` | Términos y condiciones |
| `/legal/privacidad` | Política de privacidad |
| `/legal/seguridad` | Política de seguridad |
| `/app` | Catálogo de maestros (cliente sin cuenta puede explorar). Filtros: oficio, comuna, rating, solo disponibles, búsqueda. Acepta `?oficio=X` para preselección. |
| `/app/publicar` | Wizard de 4 pasos para publicar trabajo: Detalles (título + descripción + fotos hasta 5) → Categoría → Ubicación (región + comuna + referencia + presupuesto + urgente) → Contacto (nombre + email + teléfono + toggles "mostrar email/teléfono" + términos) |
| `/app/maestro/[id]` | Perfil público del maestro: foto, oficio, especialidades, bio, años exp, comunas, portafolio (galería), rating breakdown por dimensión, lista de reseñas con comentarios, botones Llamar + WhatsApp si telefono_publico=true |
| `/maestro/login` | Login + registro maestro (email+password+verificación email+recuperación password) |
| `/recuperar-publicacion` | Cliente ingresa su email y recibe links a sus publicaciones activas |
| `/mi-publicacion/[token]` | Página privada del cliente para una publicación. Ve sus respuestas, contacta maestros por WhatsApp/llamada, marca trabajo completado y califica inline |
| `/calificar/[token]` | Página de rating standalone (linkeada desde email). 4 estrellas + comentario. Opción "no se concretó". |

### Privadas (requieren maestro autenticado)
| Ruta | Propósito |
|---|---|
| `/app/perfil` | Dashboard maestro: foto + stats (postulaciones, rating, años exp), tabs Solicitudes (sus propuestas enviadas) y Reseñas (las que recibió), toggles disponible + telefono_publico, link a editar perfil |
| `/app/perfil/completar` | Form completo del perfil profesional: foto avatar uploader, portafolio uploader (hasta 8 fotos), oficio, especialidades, bio, años exp, comunas que cubre, teléfono, toggles disponible + disponible_urgencias + telefono_publico, aceptar términos |
| `/app/publicaciones/[id]` | Vista del feed de publicación para maestro. Si no respondió: modal "Me interesa este trabajo" (presupuesto opcional + tiempo + mensaje). Si respondió: muestra su propuesta. Si pub.estado=cerrada y él fue el ganador: indica que ganó. |

### API routes (`/api/*`)
| Endpoint | Método | Función |
|---|---|---|
| `/api/publicar` | POST | Cliente anónimo crea publicación. Valida con Zod, genera token_acceso, dispara emails (confirmación + notificación a maestros que matchean) |
| `/api/upload-foto` | POST | Cliente anónimo sube foto del trabajo a bucket `publicacion-fotos` |
| `/api/upload-maestro-foto` | POST/DELETE | Maestro autenticado sube avatar o portafolio. DELETE para quitar items |
| `/api/email` | POST | Dispatcher de emails. Tipos: `publicacion_confirmacion`, `maestro_respuesta`, `recuperar_publicacion`, `invitacion_calificar`, `notificar_maestros_zona` |
| `/api/cerrar-publicacion` | POST | Cliente cierra publicación. Acepta token + maestro_ganador_id opcional. Crea rating_token y manda email backup |
| `/api/publicacion-token/[token]` | GET | Retorna publicación + respuestas + datos públicos del maestro (service role, bypass RLS) |
| `/api/rating-token/[token]` | GET/POST | GET: info del token + maestro para mostrar en /calificar. POST: guarda rating + marca token completed |

### Pantallas mobile (Expo)
| Pantalla | Estado |
|---|---|
| WelcomeScreen | ✅ |
| ClienteEntryScreen | ✅ |
| ClienteRecoverScreen (recuperar publicación) | ✅ |
| MaestroLoginScreen | ✅ |
| RecoverPasswordScreen | ✅ |
| CatalogScreen + MaestroDetailScreen | ✅ |
| FeedScreen (maestro ve publicaciones) | ✅ |
| PublishFormScreen | ✅ |
| ProfileMaestroScreen | ✅ (sin uploaders avatar/portafolio aún) |
| Cerrar+calificar (cliente) | ❌ no implementado en mobile |
| Modal "Me interesa" (maestro responder) | ❌ no implementado en mobile |
| /calificar/[token] | ❌ no implementado en mobile |

---

## 9. Customer journey: cliente

### Camino A — Catálogo (cliente busca activamente)
1. Entra a landing → click "Buscar un maestro" o categoría → llega a `/app?oficio=Gasfitería`
2. Filtra por comuna, rating mínimo, solo disponibles
3. Click en card de maestro → ve perfil completo (foto, portafolio, reseñas)
4. Si maestro tiene `telefono_publico=true`: 2 botones — Llamar (`tel:`) o WhatsApp (`wa.me/...`)
5. Click → se va a su app de teléfono → conversa offline
6. Si maestro NO tiene contacto público: mensaje "Publica tu trabajo y él podrá responderte"

### Camino B — Publicar trabajo
1. Entra a landing → click "Publica tu pololito" o `/app/publicar`
2. Wizard 4 pasos:
   - **Detalles**: título (mín 8) + descripción (mín 20, máx 300) + opcionalmente hasta 5 fotos
   - **Categoría**: chips con los 27 oficios
   - **Ubicación**: dropdown región → dropdown comuna → referencia text + presupuesto rangos + toggle urgente
   - **Contacto**: nombre + email + teléfono +56 + 2 toggles "mostrar email/teléfono al maestro" + checkbox términos
3. Click "Publicar solicitud" → POST a `/api/publicar`
4. Backend:
   - Inserta en DB con token_acceso UUID generado
   - Manda email de confirmación al cliente con link `/mi-publicacion/[token]`
   - Manda email de notificación a hasta 50 maestros que matchean (oficio o especialidad + comuna + accepted_terms + disponible)
5. Cliente ve "Publicación creada" + link directo a `/mi-publicacion/[token]`
6. Va al correo, encuentra el email de confirmación, guarda el link
7. Cuando llega un email "Andrés Cobo quiere hacer tu pololito": click → revisa la propuesta en `/mi-publicacion/[token]`
8. Compara propuestas, click WhatsApp del que más le convence → conversación offline
9. Trabajo se realiza
10. Vuelve a `/mi-publicacion/[token]` → click "Cerrar"
11. Modal: "¿Quién hizo el trabajo?" → selecciona maestro o "Ninguno"
12. Si seleccionó maestro: el modal transiciona inline a rating (4 estrellas + comentario) → submit → rating guardado, promedio del maestro recalculado
13. Si NO calificó inline: queda con email backup que tiene link `/calificar/[token]` válido 14 días

### Recuperar publicación
- Si el cliente perdió el email: va a `/recuperar-publicacion` → ingresa email → recibe lista de sus publicaciones activas con links

---

## 10. Customer journey: maestro

### Onboarding
1. Landing → "Soy maestro, busco pololitos" → `/maestro/login`
2. Tab "Crear cuenta" → email + password + confirma + acepta términos → submit
3. Email de verificación (Supabase Auth) → click → verifica
4. Login → primer acceso muestra `/app/perfil` con perfil incompleto
5. Click "Editar perfil" → `/app/perfil/completar` → wizard largo:
   - Sube foto avatar
   - Sube hasta 8 fotos de portafolio
   - Selecciona oficio principal (1 de 27)
   - Marca especialidades (subdivisiones del oficio)
   - Bio (mín 10, máx 300)
   - Años de experiencia
   - Comunas que cubre (multi-select con buscador)
   - Teléfono +56
   - Toggle "Mostrar teléfono públicamente"
   - Toggle "Disponible para tomar trabajos" (default ON)
   - Toggle "Disponible para urgencias"
   - Acepta términos
6. Guarda → vuelve al dashboard

### Día a día
1. Llega email "🚨 Pololito urgente en Calama: Necesito gasfiter al tiro" o "Nuevo pololito en Antofagasta: Reparar techumbre"
2. Click → llega a `/app/publicaciones/[id]` → ve detalle del trabajo
3. Si le interesa: click "Me interesa este trabajo" → modal:
   - Presupuesto en CLP (opcional, vacío = "A convenir")
   - Tiempo estimado: chips (Hoy mismo / 1-2 días / 3-5 días / 1 semana / 2+ semanas)
   - Mensaje al cliente (opcional, máx 300)
4. Submit → propuesta queda en DB → si telefono_publico=true en su perfil + cliente puso `mostrar_telefono=true`: el cliente puede contactarlo directo por WhatsApp
5. Espera: cliente le escribe por WhatsApp → conversación offline
6. Hace el trabajo
7. Cliente lo califica → su `rating_promedio` y `total_ratings` se actualizan automáticamente vía trigger SQL
8. En `/app/perfil` ve sus reseñas con comentarios

### Navegación maestro
- Header (desktop): Logo → Publicaciones (feed) | Mi perfil
- Bottom nav (mobile): Feed | Perfil
- Drawer: Mi perfil | Mis reseñas | Cerrar sesión

---

## 11. Catálogo de emails transaccionales

| Tipo | Trigger | Destinatario | Asunto |
|---|---|---|---|
| `publicacion_confirmacion` | Cliente publica trabajo | Cliente | Tu publicación "{titulo}" está activa |
| `notificar_maestros_zona` | Cliente publica trabajo | Hasta 50 maestros que matchean oficio + comuna + disponibles | "Nuevo pololito en {comuna}: {titulo}" o "🚨 Pololito urgente..." |
| `maestro_respuesta` | Maestro responde a publicación | Cliente (autor) | "{Maestro} quiere hacer tu pololito - $X" |
| `invitacion_calificar` | Cliente cierra con maestro ganador (backup, por si no califica inline) | Cliente | "Califica tu experiencia con {Maestro}" |
| `recuperar_publicacion` | Cliente solicita recuperación | Cliente | "Tus publicaciones en pololitotrabajos" |

Sender actual: `onboarding@resend.dev` (mientras se verifica el dominio `pololitotrabajos.cl` en Resend).

---

## 12. Constantes del dominio

### Oficios (27)
Electricista, Gasfitería, Construcción, Carpintería, Pintura, Techumbre, Cerrajería, Jardinería, Mueblería, Plomería, Albañilería, Herrería, Soldadura, Instalación de equipos, Reparación de electrodomésticos, Vidriería, Ventilación y aire acondicionado, Calefacción, Insulación térmica, Tapicería, Limpieza especializada, Desinfección, Mantenimiento de piscinas, Riego y sistemas de riego, Arboricultura, Diseño de interiores, Arquitectura.

### Especialidades (subdivisiones por oficio)
Cada oficio tiene 6-10 especialidades. Ejemplo Electricista: Instalación SEC, Tableros eléctricos, Domótica, Paneles solares, Iluminación LED, Emergencias 24/7, Cableado estructurado, Mantención preventiva.

### Regiones cubiertas (3 de 16 totales en Chile)
- **Antofagasta**: Calama, Antofagasta, Tocopilla, Mejillones, Sierra Gorda, María Elena, San Pedro de Atacama, Ollagüe, Taltal
- **Metropolitana de Santiago**: 32 comunas (Santiago, Providencia, Las Condes, Ñuñoa, etc.)
- **Valparaíso**: 38 comunas (Viña del Mar, Valparaíso, Quilpué, etc.)

---

## 13. Diseño visual y branding

- **Logo**: "**pololito**trabajos" — primera mitad gradient naranja→violeta, segunda mitad gris oscuro opacity 65%
- **Paleta principal**: gradient `#FF6B35` (naranja) → `#7C3AED` (violeta) en CTAs principales
- **Tipografía**: Plus Jakarta Sans (Google Fonts), pesos 400-800
- **Tono de voz**: chileno coloquial moderado ("al tiro", "pega", "pololito") sin caer en exceso
- **Componentes clave**:
  - Cards rounded-3xl con shadow sutil
  - Hover lift -translate-y-1
  - Animaciones Framer Motion en landing (parallax blobs, fade-up scroll, layout transitions)
  - Sticky bottom nav en mobile

---

## 14. Estado actual: qué funciona y qué no

### ✅ Completamente funcional en producción
- Landing animada (Hero, Pain section, HowItWorks toggle, Categorías 18+, AppDownload, Trust, Footer)
- Catálogo de maestros con filtros + query params + filtro pre-aplicado por categoría
- Publicar trabajo (wizard 4 pasos, fotos, validación Zod)
- Login/registro maestro con verificación email Supabase
- Recuperación de password
- Editor de perfil maestro con avatar + portafolio (web)
- Detalle de maestro con galería + reseñas + botones de contacto
- Maestro responde a publicación (modal con presupuesto opcional)
- Cliente cierra publicación + califica inline
- Trigger SQL recalcula rating automáticamente
- Email transaccionales (5 tipos)
- Notificación email a maestros que matchean (oficio + comuna + disponible)
- SEO básico: metadata, robots.txt, sitemap.xml
- RLS tightening en rating_tokens y publicaciones

### ⚠️ Parcial / requiere acción del usuario
- **Resend domain verification**: hoy emails salen desde `onboarding@resend.dev` (limita a tu propio correo). Pendiente: verificar `pololitotrabajos.cl` + setear `EMAIL_FROM` env var en Vercel.
- **Test E2E manual real**: aún no se hizo flujo completo con dos navegadores/dispositivos.
- **Mobile parity**: mobile carece de UI para cerrar+calificar, modal de respuesta del maestro, uploader avatar/portafolio.

### ❌ No implementado (post-MVP)
- Notificaciones push (solo email)
- Chat in-app (decisión de producto: NO se va a hacer)
- Verificación de identidad / RUT del maestro
- Garantía/escrow opcional
- Métodos de pago integrados
- Mapa visual de maestros cercanos por geolocalización
- 13 regiones restantes de Chile (hoy solo 3)
- Analytics (Plausible / Vercel Analytics)
- Centro de notificaciones in-app

### 🔧 Conocidos pendientes técnicos
- RLS `users.users_select_all` (qual: true) — expone email/teléfono de cualquier usuario autenticado a cualquier autenticado. Necesita refactor a vista pública con solo columnas seguras.
- `database.types.ts` desactualizado (tiene refs a `chats`/`messages` dropeados) — solo afecta type safety, no runtime.
- Sin tests automatizados (E2E ni unitarios).

---

## 15. Decisiones de producto importantes (y por qué)

| Decisión | Razón |
|---|---|
| Cliente sin cuenta | Reduce fricción de adopción de 50% (industry data). Apunta al uso ocasional típico (1-3 veces/año por hogar). |
| Maestro con cuenta robusta | El maestro es el lado del marketplace que más necesita reputación acumulable. Cuenta + perfil = activo de carrera. |
| Sin chat in-app | WhatsApp ya tiene 95%+ penetración en Chile. Construir chat es caro y la gente prefiere su canal de siempre. |
| Sin comisiones | Pre-validación. Cobrar mata el cold start del marketplace. |
| Toggle "mostrar teléfono" | Cliente y maestro deciden cuánto exponen. Privacy-first. |
| 27 oficios canónicos | Más cobertura que TodoMaestro. Especialmente fuerte en nichos (paneles solares, calefón, vidriería) donde Marketplace fracasa. |
| Notificación email a maestros que matchean | Time-to-response < 1 hora. Sin esto, marketplaces dependen de que el maestro abra la app constantemente. |
| Trigger SQL para rating | Confiable, atómico, no se puede manipular desde el frontend. |

---

## 16. Métricas que importan para validación

### Norte estrella
**Trabajos completados con rating en la app** (no publicaciones, no clicks).

### Métricas funnel
1. Landing visits → publicar trabajo
2. Publicaciones creadas → maestros que responden
3. Publicaciones con 2+ propuestas en 48h
4. Cierre de publicación (cliente vuelve y marca completado)
5. Rating dejado tras cierre

### Métricas oferta (las más críticas según el council)
- Maestros registrados / week
- Maestros con perfil completo (accepted_terms=true) / week
- Maestros activos (que respondieron al menos 1 publicación en 30 días)
- Tiempo promedio entre publicación y primera respuesta

### Métricas demanda
- Publicaciones / week / comuna
- Tasa de match (publicación recibe respuesta)
- Tasa de conversión (publicación → trabajo cerrado con maestro)

---

## 17. Posicionamiento y diferenciación

### vs TodoMaestro (competidor directo Chile)
- ✅ UX: cliente publica en 30s sin cuenta. TodoMaestro requiere registro completo.
- ✅ 27 oficios incluyendo nichos (paneles solares, calefón leña/pellet, vidriería a medida). TodoMaestro 12-15.
- ✅ Diseño: producto se ve y siente moderno. TodoMaestro es 2018.
- ❌ Volumen: TodoMaestro tiene años de tracción y SEO acumulado.

### vs Workana (LATAM)
- Workana es freelance digital (programación, diseño). Pololitotrabajos es oficios manuales offline. Mercados distintos.

### vs Facebook Marketplace + Grupos
- ✅ Reseñas verificadas (un cliente que efectivamente cerró el trabajo). En Marketplace no hay nada.
- ✅ Perfil con portafolio. En Marketplace solo posts.
- ✅ Sin scrolling sin fin de ofertas falsas.
- ❌ Volumen: Facebook tiene a TODOS.

### vs WhatsApp (boca a boca)
- ✅ Para emergencias o trabajos especializados donde no tienes "el tipo de siempre".
- ❌ Para trabajos recurrentes donde ya tienes a alguien de confianza, NO compite.

### Posicionamiento short
> "Acá los maestros tienen cara, reseñas y teléfono. Sin comisiones, sin intermediarios."

---

## 18. Riesgos identificados

### Producto
- **Cold start del marketplace**: necesita masa crítica de oferta y demanda en una geografía pequeña antes de funcionar.
- **Selección adversa del maestro**: el "buen maestro" ya está saturado por boca a boca. Los que se inscriben primero pueden ser los que nadie recomienda.
- **WhatsApp canibaliza la plataforma**: una vez conectados cliente y maestro por WhatsApp, ya no vuelven a la app. Sin take rate, no monetiza.

### Legal
- **Ley 19.496 + 21.398 (Pro-Consumidor)**: SERNAC ya estableció que plataformas que intermedian responden por incumplimientos del prestador. Disclaimer "solo intermediario" no es defensa suficiente.
- **Ley 21.719 (datos personales, vigor dic 2026)**: multas hasta 2% facturación. RLS overly permissive es un riesgo.
- **Responsabilidad civil**: si un maestro daña/roba en casa del cliente, posible exposición.

### Técnico
- Sin tests automatizados.
- Mobile no está al día con web.
- Resend domain no verificado.
- Single-region DB (sa-east-1) — si Supabase falla, app cae.

### Negocio
- Sin plan de monetización validado.
- Sin runway documentado del founder.
- Sin equipo legal ni asesoría jurídica formalizada.

---

## 19. Roadmap sugerido (no comprometido)

### Pre-launch (1-2 semanas)
1. Verificar dominio Resend
2. Test E2E manual completo
3. Tightening RLS de `users`
4. Asesoría legal básica para TyC y política privacidad
5. Configurar analytics (Plausible o Vercel Analytics)

### Launch validation (semanas 3-6)
1. Concentrar en UNA comuna (Antofagasta o Providencia)
2. Reclutar 20 maestros manualmente vía Facebook DM
3. Wizard of Oz: registrar maestros a mano, traer 10 publicaciones reales
4. Validar pricing: ¿maestros pagan $3K por lead efectivo?

### Post-validation (semanas 7-12)
1. Mobile parity (cerrar+calificar, modal respuesta, uploaders)
2. Notificaciones push reales
3. Verificación RUT/SEC para maestros (badge "verificado")
4. Expandir a las 16 regiones
5. SEO content marketing (blog: "cómo elegir gasfiter", etc.)

### Growth (mes 4+)
1. Programa de referidos (maestro invita maestro)
2. Garantía/escrow opcional al 3%
3. Adyacencias financieras (préstamos a maestros con buen rating)
4. Data products (reportes a Sodimac/Easy/aseguradoras)

---

## 20. Checklist para entregar a otra IA

Si vas a darle este documento a una IA para:

### Auditoría técnica
Pregúntale: "¿qué bugs, edge cases o vulnerabilidades ves en el flujo actual? ¿Qué tests críticos faltan?"

### Marketing
Pregúntale: "¿cómo recomendarías el go-to-market para una sola comuna? ¿Qué copy usar en Facebook ads para reclutar maestros vs clientes?"

### Estrategia / viabilidad
Pregúntale: "¿qué pivotes ves posibles si el cold start no funciona en 60 días? ¿Qué métrica miraría yo para matar o seguir?"

### Legal
Pregúntale: "¿qué cláusulas específicas necesito en TyC para minimizar exposición SERNAC? ¿Qué pasos para Ley 21.719 son no-negociables?"

### UX
Pregúntale: "¿qué fricciones específicas ves en el wizard de publicar o en el flow de cerrar+calificar? ¿Qué A/B tests priorizarías?"

---

**Fin del reporte.**

Documento autocontenido. Compárte como contexto a cualquier IA que lo necesite.
