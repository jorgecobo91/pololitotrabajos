# Screens Spec — POLOLITOTRABAJOS

Cada pantalla tiene: propósito, layout, componentes, estados, copy exacto, edge cases. Implementar en orden de fases (ver `IMPLEMENTATION_PLAN.md`).

Convención: dimensiones referidas a viewport mobile **380×780px** (después del status bar y nav gestural). Padding horizontal estándar **18px**.

---

## 0. Componentes globales

### 0.1 Bottom Tab Bar
- Posición: bottom, sticky, altura 60-68pt, `bg = surface`, top border `1px solid border`.
- 4 tabs: **Maestros** (icon `users`), **Publicar** (`plus`), **Chats** (`chat`, badge si unread), **Perfil** (`user`).
- Active: pill `primarySoft` detrás del icono (40×26 radius 13), icon color `primaryDeep`, label color `primary`, label weight 700.
- Inactive: icon y label color `inkMuted`, weight 500.
- Oculto durante: chat individual abierto, modales fullscreen, onboarding.

### 0.2 Header pattern
- 3 variantes: **plain** (catalog/chats/publish), **gradient hero** (maestro detail, perfiles), **chat header** (con avatar + back).
- Plain: padding `16px 18px 12px`, sticky con `bg` (oculta el contenido scrolleado bajo).
- Gradient hero: usa `theme.grad`, color `#fff`, padding bottom 76-80px para que la card siguiente lo overlap con `marginTop: -56`.

### 0.3 Cards
- `radius-3xl (18)`, `border 1px solid border`, `bg = surface`, padding 14-16px por defecto.
- Tap state: opacity 0.7 + scale 0.98 sobre 100ms.

### 0.4 Toast / notification
- Posición: top 12px, izq/der 12px, zIndex sobre todo.
- Border-left 3px del color del estado.
- Auto-dismiss 3.5s para info/success, persistente para `urgent` y action-required (contact request).

---

## 1. Onboarding (V1, no en prototipo — implementar)

**3 pantallas + login:**

### 1.1 Welcome
- Logo full-bleed centrado, gradient
- Tagline: "Encuentra tu maestro para cualquier trabajo"
- 2 botones: `[Crear cuenta]` (primary), `[Ya tengo cuenta]` (outline)

### 1.2 Elegir rol
- Pregunta: "¿Cómo vas a usar POLOLITOTRABAJOS?"
- 2 cards grandes, tappables:
  - **"Necesito un maestro"** (cliente) — icon `tools`
  - **"Soy maestro y ofrezco servicios"** (maestro) — icon `briefcase`
- Texto pequeño abajo: "Puedes cambiarlo después en tu perfil"

### 1.3 Datos básicos
- Cliente: nombre, teléfono (validación chilena +56 9), email (opcional), comuna (autocomplete), foto (opcional).
- Maestro: lo anterior + oficio principal (chip select), zona de cobertura (mapa con radius slider), bio mínima 50 chars, años de experiencia, foto (obligatoria).
- Validación en tiempo real. Botón `[Continuar]` deshabilitado hasta cumplir mínimos.

### 1.4 Permisos (after onboarding)
- Pedir notificaciones push (con copy: "Te avisamos cuando un maestro responda")
- Pedir ubicación cuando se necesite (lazy permission, no upfront)

---

## 2. Catálogo de Maestros (Tab 1)

**Archivo prototipo:** `screens-1.jsx` → `ScreenCatalog`

### Layout (top → bottom)
1. **Header sticky** (padding `16 18 12`)
   - Top row: `<Logo>` izquierda + `<NotificationBell>` derecha (36×36, badge dot primary si hay no leídas)
   - Greeting eyebrow: "Hola María 👋" (12px, weight 600, color `inkMuted`)
   - H1: "¿Qué necesitas\narreglar hoy?" (cliente) / "Maestros cerca\ntuyo" (maestro) — 24px, 800
   - **Search bar**: input full-width, height 44, radius 14, `bg = surface`, border, prefix icon `search`, suffix icon `filter` en chip 28×28
   - **Filter chips row**: scrollable horizontal, especialidades. `Todos` activo por defecto.
2. **Banner gradient** (padding `4 18 0`)
   - Card 18 radius con `theme.grad`, padding `14 16`, color `#fff`
   - Icon tile 44×44 `rgba(255,255,255,0.22)` blur con `sparkles`
   - Título: "Encuentra tu maestro" + subtítulo: "Para cualquier pololito al tiro"
   - Decorative circle position absolute right -20 top -20
3. **Section title row**: "{count} maestros disponibles" + action "Ordenar" (right, primary color)
4. **Lista de cards** (gap 12, padding `0 18 24`)

### Maestro Card
```
┌─────────────────────────────────────────┐
│ [foto·68] [oficio eyebrow]      [⭐4.9] │
│           Juan Carrasco                 │
│           📍 Calama · 142 trabajos      │
│           Bio corta 2 líneas...         │
├─────────────────────────────────────────┤
│ [📞 Llamar]      [💬 Contactar]         │
└─────────────────────────────────────────┘
```
- Foto 68×68 + green dot 14×14 con border 2.5 surface si `disponible: true`
- Oficio eyebrow: 11px, weight 700, color `primary`, uppercase, letter-spacing 0.4
- Nombre: 15.5px, weight 700, display font, ellipsis si overflow
- Rating chip: bg `bgAlt`, padding `4 8`, radius 8, star icon 11 + valor 12px weight 700
- Zona row: 11.5px, color `inkMuted`, icons 11px
- Bio: 12.5px, color `inkSoft`, line-clamp 2, `text-wrap: pretty`
- Botones: solo aparece "Llamar" si `telefonoPublico === true`. Llamar = `outline`. Contactar = `primary` (gradient).

### Estados
- Loading: skeleton de 3 cards (rect placeholders animados)
- Empty (no resultados con filtro): ilustración placeholder + "No encontramos maestros con esos filtros. Cambia o agranda tu zona."
- Error: card con retry

### Interacciones
- Tap card → push a Maestro Detail (sección 3)
- Tap "Llamar" → abrir dialer del OS con tel: scheme
- Tap "Contactar" → trigger contact request flow (ver sección 7)
- Filter chip tap → cambia filter state
- Search input → filtra debounced 250ms
- Pull-to-refresh

---

## 3. Detalle de Maestro

**Archivo prototipo:** `screens-1.jsx` → `ScreenMaestroDetail`

### Layout
1. **Hero gradient** (background `theme.grad`, padding `14 18 80`, color `#fff`)
   - Top row: back button izq (38×38 rounded-12 `rgba(255,255,255,0.2)`), shield button der (verificación)
2. **Card overlap** (`marginTop: -56`)
   - Avatar 84×84 con ring (3px primarySoft + 4px primary), saliente -42 desde card top
   - Status pill: "Disponible al tiro" (greenSoft) o "No disponible" (bgAlt)
   - Eyebrow oficio + H2 nombre + rating (estrellas + valor + reseñas)
   - **Stats row** (grid 3 col): Años exp · Trabajos · En PT desde
3. **"Sobre mí"**: párrafo bio extendido (auto-generado del `bio` + experiencia + zona)
4. **"Especialidades"**: chips horizontales
5. **"Calificaciones"**: card con desglose (Calidad, Puntualidad, Comunicación, Precio justo). Cada uno: label + barra progress (height 5, gradient fill) + valor 4.x
6. **"Trabajos realizados"** (portafolio): grid 3 columnas, gap 6, items 88×88, radius 10. Tap → lightbox fullscreen.
7. **CTAs sticky-feeling al fondo** (padding `24 18 28`, gap 10):
   - "Llamar" outline lg (si telefonoPublico) flex 1
   - "Contactar" primary lg flex 2 (con icon `send`)

### Interacciones
- Back: pop navigation
- Shield: open "Verificación" modal (V2) — explica cómo PT verifica identidad y oficio
- Tap portfolio image → lightbox swipeable
- "Contactar" → contact request flow

---

## 4. Publicar / Feed (Tab 2)

**Archivo prototipo:** `screens-2.jsx` → `ScreenPublish`

### 4.A Vista Cliente — Form

#### Layout
1. Header plain: H1 "Publica tu pololito" + subtitle "Cuéntanos qué necesitas..."
2. Form fields (gap 14, padding `8 18 24`):
   - **Título** (input, label uppercase, hint en derecha)
   - **Descripción** (textarea 3 rows, max 300 chars con counter `{n}/300`)
   - **Especialidad** (chip group, single-select, scrollable wrap). Lista: Electricidad, Construcción, Gasfitería, Carpintería, Plomería, Pintura, Vidriería, Otros.
   - **Ubicación** (input + GPS button verde violeta a la derecha → trigger geolocation)
   - **¿Es urgente?** (card destacada con icon zap, toggle 44×26, bg cambia a redSoft cuando ON)
   - **Fotos** (grid de placeholders 72×72 + botón "+" dashed). Max 5. Cada foto tiene X delete top-right.
3. **Submit**: botón `[Publicar solicitud]` primary lg full-width + microcopy "Los maestros de tu zona verán tu publicación. Es gratis, sin compromiso."

#### Validación
- Título: mínimo 8 chars
- Descripción: mínimo 20 chars, máximo 300
- Especialidad: requerida
- Ubicación: requerida (autodetect o manual con autocomplete de comunas)
- Fotos: opcional, max 5, max 5MB c/u, tipos jpg/png/webp/heic
- Botón submit deshabilitado hasta validación OK; errores inline.

#### Submit → success
- Loading state en botón
- Toast success top: "¡Publicado al tiro!" body "Los maestros ya pueden ver tu solicitud"
- Reset form, navegar a tab donde se ve su publicación en el feed (V2: "Mis publicaciones" sub-tab)

### 4.B Vista Maestro — Feed

#### Layout
- Header plain: "Feed de pegas" + "Solicitudes cerca tuyo. Postúlate al tiro."
- Filtros: especialidad, zona, urgentes-primero (V2)
- Lista de Publication Cards

#### Publication Card
```
┌─────────────────────────────────────────┐
│ [foto·38] María González    [⚡URGENTE]  │
│           ⏰ hace 35min · 📍 Antofagasta │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Necesito gásfiter urgente al tiro 🚨    │
│ Mi califont está perdiendo agua...      │
│ [foto1·100x100] [foto2·100x100]         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ [Gasfitería]  4 contactos  [📨 Postular]│
└─────────────────────────────────────────┘
```
- Avatar cliente 38×38
- URGENTE badge: bg redSoft, color red, icon zap filled, weight 800, letter-spacing 0.4
- Photos: grid 2-col si hay 2+, full-width si 1
- Footer: chip especialidad + "{n} contactos" + botón "Postular" (primary sm)

#### Interacciones
- Tap card → detalle de publicación + perfil cliente + chat init
- Tap "Postular" → envía solicitud de contacto al cliente, toast "Postulación enviada"

---

## 5. Chats (Tab 3)

**Archivo prototipo:** `app.jsx` → `ScreenChats`, `ChatDetail`

### 5.A Lista de chats

#### Layout
- Header plain: H1 "Chats" + "{n} sin leer"
- Lista (no padding horizontal, items con `12 18`)

#### Chat row
- Avatar 52×52 + badge unread count top-right (-2, -2), bg primary, border 2 bg
- Right side: nombre (14, 700, display) + timestamp (10.5, inkMuted)
- Last message: 12.5px, weight 600 si unread else 400, color ink/inkSoft, ellipsis
- Status pill: micro pill 10px con dot, color por estado:
  - **Nuevo** — yellow
  - **En negociación** — primary
  - **Aceptado** — green
  - **Completado** — inkMuted
  - **Rechazado** — red

### 5.B Chat individual

#### Layout (3 zonas)
1. **Header** (sticky, bg surface, border-bottom)
   - Back + Avatar 36 + Nombre + "En línea · green dot" + Phone icon
2. **Status banner** (bg bgAlt, 8 14 padding)
   - "Trabajo: **{título}** · Estado **{status}**"
3. **Messages list** (flex 1, scroll, padding `14 14 8`, gap 8)
   - Mensaje propio: alignSelf flex-end, bg primary, color #fff, radius 16 con bottom-right 4
   - Mensaje otro: alignSelf flex-start, bg surface, color ink, border, radius 16 con bottom-left 4
   - Max width 76%
   - Timestamp pequeño bajo el último mensaje del grupo (V2)
4. **Input** (sticky bottom)
   - Botón paperclip 36×36 bgAlt
   - Input textarea autoresize, bg bgAlt, radius 19, padding 0 14
   - Botón send 38×38 gradient
   - Botón mic (V2)

### Estados especiales
- Cuando `status === 'Completado'`: mostrar botón centrado "Calificar a {nombre}" primary md con icon star
- Tap → modal de calificación (sección 8)

### Funcionalidad backend
- WebSocket o long-polling para realtime
- Read receipts (V2)
- Typing indicator (V2)
- Adjuntos: foto (cámara o galería), ubicación (V2: comparir punto en mapa)

---

## 6. Perfil (Tab 4) — distinto por rol

**Archivo prototipo:** `screens-2.jsx` → `ScreenProfileMaestro`, `ScreenProfileCliente`

### 6.A Perfil Maestro

1. Header gradient: H1 "Mi perfil" + settings button derecha
2. Card overlap (-56) con:
   - Avatar 84 ring + botón "Editar" (chip bgAlt) a la derecha
   - Eyebrow oficio + H2 nombre + rating
   - Toggles separados por border:
     - **Estoy disponible** (icon bell, accent green)
     - **Mostrar teléfono público** (icon phone, accent primary). Sub muestra el teléfono si ON, "Solo por chat" si OFF.
3. **Especialidades**: chips activas con `+ agregar` dashed al final
4. **Zona de cobertura**: card con icon map en tile, texto principal + "Hasta 30 km a la redonda" + chevron right
5. **Mis calificaciones**: card con tile gradient grande izq (rating de 5.0) + barras desglose
6. **Mi portafolio**: section title con action "Editar" + grid 3-col de imágenes

### 6.B Perfil Cliente

1. Mismo header gradient
2. Card con avatar + nombre + email + 2 botones inline ("Editar perfil" + "{teléfono}")
3. **Stats grid 2-col**:
   - "{n} pololitos contratados" (icon briefcase)
   - "{rating} tu calificación · {n}" (icon thumbs-up)
4. **Mis direcciones** + action "+ agregar": cards con icon pin tile, label + detalle, chevron
5. **Configuración**: card lista con items (sin padding interno, separadores 1px):
   - Historial de pololitos
   - Notificaciones
   - Privacidad y seguridad
   - Invitar amigos (V2)
   - Cerrar sesión (al fondo, color red — agregar si no está)

---

## 7. Flujo de Contacto (transversal)

### Paso 1 — Cliente presiona [Contactar]
- Toast info top: "Solicitud enviada a {nombre} ✅" / "Te avisaremos cuando responda"
- Backend: crear `ContactRequest { from, to, status: 'pending' }`
- Push notification al maestro

### Paso 2 — Maestro recibe notificación
- App abierta → `ContactRequestToast` persistente top con avatar + nombre + razón + botones `[Rechazar]` `[Atender]`
- App cerrada → push notification del SO con misma acción (`acceptAction`, `rejectAction`)

### Paso 3 — Maestro presiona Atender
- Backend: status → `accepted`, crear `Chat` entre los dos
- Navegar al chat (push). Primer mensaje del sistema: "{maestro} aceptó tu contacto"
- Toast en cliente cuando se conecte: "Don Luis aceptó tu contacto"

### Paso 4 — Conversación
- Status del trabajo cambia: pending → en negociación → aceptado → completado / rechazado
- Cliente puede marcar "Trabajo completado" desde el chat (header overflow menu)

### Paso 5 — Calificación
- Trabajo completado → ambos reciben prompt de calificación (cliente al maestro, maestro al cliente)
- Modal con 4 sliders/stars: Calidad, Puntualidad, Comunicación, Precio
- Comentario opcional 200 chars
- Submit → ratings se promedian al perfil

---

## 8. Calificación post-trabajo (modal)

- Bottom sheet o full screen modal
- Foto + nombre del calificado
- 4 grupos de 5 estrellas, label arriba c/u
- Textarea opcional "Cuéntale al resto cómo fue tu pololito"
- 2 botones: "Saltar" (ghost) + "Enviar calificación" (primary)
- Confirmación: "¡Gracias! Tu opinión ayuda a otros."

---

## 9. Notificaciones (sistema)

Ver `NotifStack` en prototipo. Tipos:

**Cliente recibe:**
- `contact_accepted` — "{maestro} aceptó tu contacto" (success, icon check-circle)
- `new_message` — "{maestro} te envió un mensaje" (info, icon chat)
- `rate_prompt` — "¿Listo para calificar tu trabajo?" (info, icon star)
- `request_response` — Maestro postuló a tu publicación

**Maestro recibe:**
- `contact_request` — "{cliente} quiere contactarte" (primary, icon bell, persistente con acciones)
- `new_message` — Mensaje (info, icon chat)
- `nearby_request` — "Nueva solicitud URGENTE en tu zona" (urgent o info según urgencia)
- `rate_prompt` — Calificar al cliente

Todas se guardan en un `NotificationCenter` (V2: pestaña/screen para ver historial).

---

## 10. Estados vacíos / loading / error (todas las pantallas)

| Estado | Tratamiento |
|---|---|
| Loading inicial | Skeleton placeholders (rectángulos con shimmer) |
| Empty (no data) | Ilustración placeholder + título amigable + CTA si aplica |
| Error de red | Card center con icon + "No pudimos conectar. Revisa tu internet." + botón "Reintentar" |
| Sin permisos | Card explicativo con CTA para abrir Settings del SO |

---

## 11. Tips de implementación

- **List performance:** usar `FlatList` (RN) o virtualización equivalente para catálogo y feed (>20 items).
- **Image caching:** `expo-image` con disk cache.
- **Forms:** `react-hook-form` + `zod` para validación.
- **Navigation:** stacks anidados:
  - Tab Navigator (Maestros, Publicar, Chats, Perfil)
  - Cada tab con su Stack (e.g., Catalog → MaestroDetail; Chats list → ChatDetail)
- **Modal stack** separado para calificación, contact-request, lightbox.
- **Theme:** context + hook `useTheme()` que retorna theme actual (palette + dark) + helper `useStyles(makeStyles)` para estilos themed.
- **Rebuilds:** memoizar tarjetas (`React.memo` en RN) — son la mayor fuente de jank en scroll.
