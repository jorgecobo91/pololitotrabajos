# Architecture — POLOLITOTRABAJOS

## Stack recomendado

**Frontend:** Expo SDK 51+ · React Native · TypeScript · React Native Web (para PC/Web).
**Backend:** Node 20 + Fastify (o NestJS) · PostgreSQL · Prisma ORM · Redis (sessions, rate limits, queue).
**Realtime:** Socket.io (chat, notificaciones in-app).
**Storage:** Cloudflare R2 o AWS S3 (imágenes).
**Auth:** Clerk o Supabase Auth (más rápido) · alternativa custom con JWT + refresh.
**Push:** Expo Notifications (proxy a APNS + FCM).
**Maps:** MapLibre + tiles MapTiler/OSM (gratis) o Google Maps SDK.
**Geocoding:** Nominatim (gratis) o Google Places.

## Estructura de carpetas (monorepo recomendado)

```
pololitotrabajos/
├── apps/
│   ├── mobile/              # Expo app (iOS + Android + Web)
│   │   ├── app/             # Expo Router file-based routing
│   │   │   ├── (auth)/
│   │   │   │   ├── welcome.tsx
│   │   │   │   ├── role.tsx
│   │   │   │   ├── signup-cliente.tsx
│   │   │   │   └── signup-maestro.tsx
│   │   │   ├── (tabs)/
│   │   │   │   ├── _layout.tsx          # bottom tab nav
│   │   │   │   ├── index.tsx            # Catálogo
│   │   │   │   ├── publish.tsx          # Form / Feed
│   │   │   │   ├── chats.tsx            # Lista
│   │   │   │   └── profile.tsx          # Perfil (router por rol)
│   │   │   ├── maestro/[id].tsx         # Detalle maestro
│   │   │   ├── chat/[id].tsx            # Chat individual
│   │   │   ├── publication/[id].tsx
│   │   │   ├── rate/[chatId].tsx        # Modal calificación
│   │   │   └── _layout.tsx              # Root: theme + auth provider
│   │   ├── components/                  # ÁTOMOS y MOLÉCULAS
│   │   │   ├── primitives/              # Button, Card, Chip, Avatar, Icon, Input, Toggle
│   │   │   ├── MaestroCard.tsx
│   │   │   ├── PublicationCard.tsx
│   │   │   ├── ChatBubble.tsx
│   │   │   └── ...
│   │   ├── theme/
│   │   │   ├── tokens.ts                # ← copiar de DESIGN_TOKENS.md
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── useTheme.ts
│   │   ├── lib/
│   │   │   ├── api.ts                   # cliente HTTP (tRPC o fetch)
│   │   │   ├── socket.ts                # cliente realtime
│   │   │   ├── auth.ts
│   │   │   ├── push.ts
│   │   │   └── i18n.ts                  # strings es-CL
│   │   ├── store/                       # zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── chatStore.ts
│   │   │   └── notifStore.ts
│   │   ├── hooks/
│   │   ├── assets/
│   │   └── app.config.ts                # Expo config
│   └── web/ (opcional, si NO usas RN Web)
│       └── ... (Next.js mirror)
├── apps/api/                            # Backend
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── db/                          # Prisma schema + migrations
│   │   ├── ws/                          # Socket.io handlers
│   │   ├── jobs/                        # bull/bee queue (push, emails)
│   │   └── index.ts
├── packages/
│   ├── shared/                          # Tipos + zod schemas compartidos
│   │   ├── types.ts
│   │   └── schemas.ts
│   └── ui-tokens/                       # tokens.ts compartido (opcional)
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Modelo de datos (Prisma schema simplificado)

```prisma
model User {
  id            String   @id @default(cuid())
  phone         String   @unique
  email         String?  @unique
  nombre        String
  fotoUrl       String?
  roles         Role[]               // ['cliente'] | ['maestro'] | ['cliente','maestro']
  comuna        String?
  region        String?
  createdAt     DateTime @default(now())
  // Relations
  maestroProfile MaestroProfile?
  publicaciones Publicacion[]
  chatsAsClient Chat[] @relation("ClientChats")
  chatsAsMaestro Chat[] @relation("MaestroChats")
  ratingsGiven  Rating[] @relation("RatingsGiven")
  ratingsRecv   Rating[] @relation("RatingsReceived")
  pushTokens    PushToken[]
  direcciones   Direccion[]
}

enum Role { cliente maestro }

model MaestroProfile {
  id              String  @id @default(cuid())
  userId          String  @unique
  user            User    @relation(fields: [userId], references: [id])
  oficio          String          // primaria
  especialidades  String[]
  bio             String
  experienciaAnios Int
  zonaCobertura   String          // free text "Calama, Antofagasta"
  zonaCentroLat   Float?
  zonaCentroLng   Float?
  zonaRadioKm     Int     @default(30)
  telefonoPublico Boolean @default(false)
  disponible      Boolean @default(true)
  desde           DateTime @default(now())
  portfolio       PortfolioItem[]
  // computed avg ratings via service
}

model PortfolioItem {
  id        String   @id @default(cuid())
  maestroId String
  maestro   MaestroProfile @relation(fields: [maestroId], references: [id])
  imageUrl  String
  caption   String?
  order     Int
}

model Publicacion {
  id            String   @id @default(cuid())
  autorId       String
  autor         User     @relation(fields: [autorId], references: [id])
  titulo        String
  descripcion   String
  especialidad  String
  ubicacion     String
  lat           Float?
  lng           Float?
  urgente       Boolean  @default(false)
  fotos         String[]
  estado        PubEstado @default(abierta)
  contactos     Int      @default(0)
  createdAt     DateTime @default(now())
}

enum PubEstado { abierta cerrada vencida }

model ContactRequest {
  id         String   @id @default(cuid())
  fromId     String
  toId       String
  contextType ContactCtx
  contextId  String?              // publicacionId o null si fue desde catálogo
  status     ReqStatus @default(pending)
  chatId     String?
  createdAt  DateTime @default(now())
  respondedAt DateTime?
}

enum ContactCtx { catalogo publicacion }
enum ReqStatus  { pending accepted rejected expired }

model Chat {
  id         String   @id @default(cuid())
  clientId   String
  maestroId  String
  client     User     @relation("ClientChats", fields: [clientId], references: [id])
  maestro    User     @relation("MaestroChats", fields: [maestroId], references: [id])
  estado     ChatStatus @default(nuevo)
  trabajoTitulo String?
  publicacionId String?
  createdAt  DateTime @default(now())
  messages   Message[]
  rating     Rating[]
}

enum ChatStatus { nuevo en_negociacion aceptado completado rechazado }

model Message {
  id        String   @id @default(cuid())
  chatId    String
  chat      Chat     @relation(fields: [chatId], references: [id])
  fromId    String
  text      String?
  imageUrl  String?
  lat       Float?
  lng       Float?
  readAt    DateTime?
  createdAt DateTime @default(now())
}

model Rating {
  id            String   @id @default(cuid())
  chatId        String
  chat          Chat     @relation(fields: [chatId], references: [id])
  fromId        String
  toId          String
  from          User     @relation("RatingsGiven",    fields: [fromId], references: [id])
  to            User     @relation("RatingsReceived", fields: [toId],   references: [id])
  calidad       Int      // 1..5
  puntualidad   Int
  comunicacion  Int
  precio        Int
  comentario    String?
  createdAt     DateTime @default(now())
}

model Direccion {
  id        String @id @default(cuid())
  userId    String
  user      User   @relation(fields: [userId], references: [id])
  label     String  // "Casa"
  detalle   String
  lat       Float?
  lng       Float?
}

model PushToken {
  id        String @id @default(cuid())
  userId    String
  user      User   @relation(fields: [userId], references: [id])
  token     String @unique
  platform  String // 'ios' | 'android' | 'web'
  createdAt DateTime @default(now())
}
```

## State management

- **Auth:** Zustand store `authStore` (user, token, role activo, login/logout actions). Persistir en SecureStore (iOS) / EncryptedSharedPreferences (Android).
- **Chats:** Zustand `chatStore` con normalización por id. WebSocket hidrata. Optimistic updates en send.
- **Notifications:** Zustand `notifStore` con queue + dismiss.
- **Theme:** Context `ThemeProvider` con palette + dark. Persistir preferencia en AsyncStorage.
- **Server data:** TanStack Query (React Query) para todo lo demás (catálogo, feed, perfil, ratings). Configurar `staleTime: 60s` por defecto, infinite queries para listas.
- **Forms:** React Hook Form + zod para validación tanto frontend como backend (mismo schema desde `packages/shared`).

## Navegación

Expo Router (file-based). Estructura:

```
Root Stack
├── (auth) — sin tab bar
│   └── welcome → role → signup → permissions
└── (tabs) — bottom tab bar
    ├── index (Catálogo)
    │   └── maestro/[id]
    ├── publish
    │   └── publication/[id]
    ├── chats
    │   └── chat/[id]
    └── profile
        └── edit
```

Modales (presentation: 'modal'): `rate/[chatId]`, lightbox de imágenes, contact-request prompt.

## Realtime (Socket.io)

Eventos cliente → servidor:
- `chat:join` { chatId }
- `chat:message` { chatId, text, imageUrl? }
- `chat:typing` { chatId }
- `chat:read` { chatId }

Eventos servidor → cliente:
- `chat:message` { ...message }
- `chat:status` { chatId, estado }
- `notification` { type, ...payload }
- `contact:request` { from, ctx }

Reconnect con exponential backoff. En offline queue local de mensajes pendientes.

## Push notifications

- iOS: APNS via Expo Push (no se requiere certificado custom en dev).
- Android: FCM via Expo Push.
- Web: Web Push API (V2).

Categorías:
- `CONTACT_REQUEST` (con acciones Atender/Rechazar)
- `NEW_MESSAGE`
- `NEW_NEARBY_REQUEST`
- `RATE_PROMPT`

Deep links: `pololitotrabajos://chat/{id}`, `pololitotrabajos://maestro/{id}`.

## Internacionalización

- `i18n-js` o `expo-localization`
- Default `es-CL` (con modismos)
- Strings en `lib/i18n.ts` clavadas. Documentar tono en CONTRIBUTING.

## Seguridad

- HTTPS only.
- JWT corto (15 min) + refresh token (30 días) en SecureStore.
- Rate limit en endpoints sensibles (Redis): contact request 10/h por usuario, signup 5/día por IP, etc.
- Validación zod en server (no confiar en cliente).
- Moderación: flags en publicaciones y chats, reportar usuario.
- Verificación maestro (V2): foto carnet + selfie comparación; documento oficio si aplica.

## Performance

- Image lazy + thumbnails servidos en WebP/AVIF (transformer en backend o R2 Image Transforms).
- Listas virtualizadas (FlatList con `removeClippedSubviews`).
- Bundle splitting: lazy load de pantallas no críticas (`React.lazy`).
- Cache HTTP via React Query + persisted query.

## Telemetría

- Sentry (errores crash) en mobile + backend.
- PostHog o Mixpanel (eventos producto).
- Eventos clave: `signup_complete`, `publication_created`, `contact_request_sent`, `contact_request_accepted`, `chat_completed`, `rating_submitted`.
