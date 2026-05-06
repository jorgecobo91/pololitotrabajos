# Implementation Plan — POLOLITOTRABAJOS

Roadmap por fases. Cada fase es desplegable.

## Fase 0 — Setup (1-2 días)

- [ ] Crear monorepo (pnpm + turbo). Carpetas según `ARCHITECTURE.md`.
- [ ] `apps/mobile`: `npx create-expo-app -t with-typescript`. Configurar Expo Router, NativeWind o styled-components.
- [ ] `apps/api`: Fastify + Prisma + zod. Postgres local con docker-compose.
- [ ] `packages/shared`: tipos + schemas zod.
- [ ] CI: GitHub Actions con lint+typecheck+test.
- [ ] Configurar Sentry, PostHog (DSNs en env).

## Fase 1 — Design system (2-3 días)

- [ ] Implementar `theme/tokens.ts` desde `DESIGN_TOKENS.md`.
- [ ] `ThemeProvider` + `useTheme()` hook + dark mode toggle persistente.
- [ ] Primitivos: `Button`, `Card`, `Chip`, `Avatar`, `Input`, `Toggle`, `Toast`, `Icon` (lucide-react-native).
- [ ] `StoryStub` (storybook-light) o pantalla `/dev/components` para QA visual.
- [ ] Cargar fuentes (`expo-font`, Plus Jakarta Sans + JetBrains Mono).

## Fase 2 — Auth + onboarding (3-4 días)

- [ ] `(auth)` stack: welcome, role pick, signup form, OTP verify.
- [ ] Backend `/auth/*` endpoints + Twilio (o equivalente) para SMS.
- [ ] Persistir token en SecureStore.
- [ ] `authStore` con bootstrap on app start.
- [ ] Permisos lazy: notificaciones tras primer signup.

## Fase 3 — Catálogo + Detalle Maestro (3-4 días)

- [ ] Pantalla `(tabs)/index` (catálogo) — fetch con React Query.
- [ ] `MaestroCard` componente.
- [ ] Search + filtros (especialidad, comuna).
- [ ] Pantalla `maestro/[id]` con hero gradient, ratings desglose, portfolio.
- [ ] Backend `/maestros*` endpoints + agregación de ratings.
- [ ] Seed de maestros demo (10-20).

## Fase 4 — Publicar / Feed (3-4 días)

- [ ] `(tabs)/publish` con form completo + validación zod.
- [ ] Upload de fotos (presigned URLs a R2).
- [ ] GPS + autocomplete de comunas.
- [ ] Vista maestro: feed de publicaciones con filtros.
- [ ] `PublicationCard` componente.
- [ ] Botón Postular → ContactRequest.

## Fase 5 — Chats + Realtime (5-7 días)

- [ ] Socket.io server + auth middleware.
- [ ] `chatStore` Zustand con normalización.
- [ ] Pantalla lista de chats `(tabs)/chats`.
- [ ] Pantalla `chat/[id]` con burbujas, status banner, input.
- [ ] Send mensajes con optimistic update + reconcile via WS.
- [ ] Push notifications (Expo Push) para mensajes cuando app cerrada.
- [ ] Queue offline (mensajes pendientes en MMKV).

## Fase 6 — Contact request flow (2-3 días)

- [ ] `POST /contact` desde card maestro o publicación.
- [ ] Push notification al receptor con acciones nativas (Atender/Rechazar).
- [ ] In-app `ContactRequestToast` cuando app abierta.
- [ ] Accept → crea Chat + navega a chat/[id].
- [ ] Reject → toast confirmación.

## Fase 7 — Perfiles editables (3 días)

- [ ] `(tabs)/profile` cliente: stats, direcciones, configuración.
- [ ] `(tabs)/profile` maestro: especialidades, zona, portafolio, calificaciones.
- [ ] Edit screens con form + upload foto.
- [ ] Toggle disponible / teléfono público.
- [ ] Migración perfiles maestro: GPS de zona con mapa interactivo.

## Fase 8 — Calificaciones (2 días)

- [ ] Modal `rate/[chatId]` con 4 sliders + comentario.
- [ ] Submit → recompute averages.
- [ ] Push prompt cuando chat → completado.
- [ ] Reviews list en perfil maestro (V1.1).

## Fase 9 — Web build (1-2 días)

- [ ] `npx expo export --platform web` configurar.
- [ ] Verificar layout responsive (mobile-first → desktop con max-width 480 + side panel en V2).
- [ ] Deploy a Vercel/Cloudflare Pages.
- [ ] Auth en web vía cookies (mismo backend).

## Fase 10 — Hardening / pre-launch (1 semana)

- [ ] Tests E2E con Maestro (Playwright para web, Detox para mobile) — flujos críticos: signup, contact request, chat, rate.
- [ ] Tests unitarios: schemas zod, services backend, hooks.
- [ ] Accessibility audit (TalkBack/VoiceOver).
- [ ] Crash-free targets: 99.5% en Sentry primera semana.
- [ ] Privacy policy + términos (legal Chile).
- [ ] App Store + Play Store assets (screenshots, descripción, ratings).
- [ ] Submit a review.

## Post-MVP / V2 ideas

- Verificación maestro (selfie + carnet)
- Mapa con maestros cerca (geosearch)
- Pagos in-app (transferencia confirmada o Webpay/Mercado Pago)
- Sistema de cotizaciones
- Plantillas de servicio + precios sugeridos
- Programa de referidos
- Maestros destacados (paid tier)
- Calendario / agenda

## Estimación total MVP

≈ 6-8 semanas con 1 dev fullstack, 4-5 semanas con 2 devs (1 mobile, 1 backend).
