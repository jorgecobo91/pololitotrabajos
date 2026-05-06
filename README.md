# Handoff: POLOLITOTRABAJOS — Marketplace de oficios chileno

## Overview

**POLOLITOTRABAJOS** es una app móvil multiplataforma (iOS + Android + Web) que conecta clientes que necesitan trabajos puntuales de construcción/electricidad/gasfitería/etc. ("pololitos") con maestros independientes que ofrecen esos servicios.

**Mercado objetivo:** Chile (lenguaje coloquial chileno). Expansible a Latam.

**Modelo de negocio:** Marketplace gratuito en V1. Posibles monetizaciones futuras: comisión por trabajo cerrado, posts destacados para maestros, suscripción premium maestros.

## ⚠️ About the Design Files

Los archivos HTML/JSX en `prototype/` son **referencias de diseño** — prototipos creados con HTML+React inline en el navegador para mostrar look & feel + comportamiento esperado. **NO son código de producción listo para copiar.**

Tu tarea es **recrear estos diseños en un stack apropiado para producción**:
- **Recomendado: React Native + Expo** (un solo codebase para iOS, Android y Web vía `react-native-web`).
- Alternativas válidas: Flutter, native iOS (SwiftUI) + native Android (Jetpack Compose) + Next.js web (3 codebases). Solo recomendado si hay razones fuertes de performance/integración.

Si ya hay un codebase, sigue sus patrones. Si es greenfield, **usa Expo + React Native + TypeScript** (ver `IMPLEMENTATION_PLAN.md`).

## Fidelity

**High-fidelity** (hifi). Los mocks definen colores exactos, tipografía, spacing, radii, sombras, copy completo en español chileno, e interacciones detalladas. Recrear pixel-perfect en el stack elegido, adaptando primitivos al sistema target (e.g., `View` en lugar de `div`, `Pressable` en lugar de `button`).

## Documentos en este handoff

| Archivo | Contenido |
|---|---|
| `README.md` | Este archivo — overview |
| `DESIGN_TOKENS.md` | Paletas de color, tipografía, spacing, radii, sombras, animaciones |
| `SCREENS.md` | Spec detallado de cada pantalla con layouts, componentes, copy |
| `ARCHITECTURE.md` | State management, navegación, modelos de datos, estructura de carpetas |
| `API_SPEC.md` | Endpoints REST/GraphQL, shapes de payload, autenticación |
| `IMPLEMENTATION_PLAN.md` | Roadmap por fases (MVP → V1 → V2) con prioridades |
| `PLATFORMS.md` | Adaptaciones específicas iOS / Android / Web |
| `LANDING.md` | Spec de la landing pública (versión definitiva: **08 · Equilibrio Atardecer**) |
| `prototype/` | HTML+JSX prototipos referenciados (incluye `LANDINGS.html` con las 8 variaciones) |

## Quick start (orden sugerido de lectura)

1. Lee este README
2. Abre `prototype/POLOLITOTRABAJOS.html` (app) y `prototype/LANDINGS.html` (landing) en un navegador para ver los diseños en vivo
3. Lee `IMPLEMENTATION_PLAN.md` — define fases y stack
4. Lee `DESIGN_TOKENS.md` — extrae los tokens al sistema de diseño del proyecto
5. Lee `ARCHITECTURE.md` — modela el state, la navegación y los datos
6. Lee `SCREENS.md` — implementa pantalla por pantalla
7. Consulta `API_SPEC.md` cuando integres backend
8. Consulta `PLATFORMS.md` para adaptaciones nativas

## Concepto del producto (resumen)

Dos flujos paralelos en una sola app:

- **Flujo Catálogo:** cliente busca maestros directamente por categoría/zona, ve perfiles, calificaciones, portafolio, contacta vía botón llamar (si público) o chat in-app.
- **Flujo Publicaciones:** cliente publica una solicitud (foto+descripción+ubicación+especialidad+urgencia). Maestros cercanos la ven en su feed y se postulan.

**Roles:** un mismo usuario puede ser cliente y maestro (toggle en perfil). Para MVP, se sugiere onboarding que pida elegir rol primario.

**Geografía:** filtros por zona/comuna chilena. Necesario integrar geocoding y permisos de ubicación.

## Pestañas principales (Bottom Tab Navigation)

1. **Maestros** — Catálogo
2. **Publicar** — Form (cliente) o Feed de pegas (maestro)
3. **Chats** — Lista + chat individual
4. **Perfil** — Editable, distinto para cliente vs maestro

## Tono de copy

Español chileno coloquial pero accesible. Modismos usados a propósito: *al tiro, cachái, pololito, bacán, gásfiter*. Mantenerlo en strings externalizados (`i18n`) para futura expansión a otros países hispanohablantes con neutro.

## Branding

- **Nombre:** POLOLITOTRABAJOS (wordmark, sin símbolo)
- **Tagline:** "Encuentra tu maestro para cualquier trabajo"
- **Logo:** Wordmark con gradiente (3 paletas disponibles, ver `DESIGN_TOKENS.md`)
- **Tipografía:** Plus Jakarta Sans (display + body), JetBrains Mono (placeholders/labels técnicos)

## Criterios de éxito visuales

- Aire limpio, minimalista (referencia: Airbnb mobile)
- Cards con sombras suaves, radii 14-18px
- Foto de maestro siempre visible y de buen tamaño (44-84px)
- Estados claros (disponible verde / urgente rojo / completado neutro)
- Bottom nav siempre visible salvo en chat individual

## Accesibilidad y UX

- Hit targets mínimos **44pt** (iOS) / **48dp** (Android)
- Texto mínimo 11px (labels), 13.5px (body)
- Contraste AA mínimo (revisar paleta oscura especialmente)
- Diseñado pensando en maestros mayores con poca experiencia digital → iconografía clara, copy simple, validación en tiempo real
- Soporte modo oscuro **obligatorio**

## Permisos a solicitar

- **Cámara** (subir fotos de pololitos)
- **Galería** (subir fotos)
- **Ubicación** (filtro de zona, GPS al publicar)
- **Notificaciones push** (contacto, mensaje, calificación pendiente)
- **Contactos** (opcional, V2 — invitar amigos)
