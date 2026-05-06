# Design Tokens — POLOLITOTRABAJOS

Tokens extraídos del prototipo. Implementar como theme de tu sistema target (e.g., `useTheme()` en RN, `ThemeData` en Flutter, `@Theme` en SwiftUI).

## 1. Paletas de gradiente (3 opciones — el usuario elige en onboarding o desde Tweaks)

### Atardecer (default) — `duo`
- Gradiente: `linear-gradient(135deg, #FF6B35 0%, #C53AC8 60%, #7C3AED 100%)`
- Gradiente fuerte: `linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)`
- Primary: `#9333EA`
- Primary deep: `#7C3AED`
- Primary soft (fondos suaves): `#FCE7F3`
- Primary ink (texto sobre soft): `#2A0E40`
- Accent: `#FF6B35`

### Fuego — `naranja`
- Gradiente: `linear-gradient(135deg, #FF6B35 0%, #FF8E53 50%, #FFB07A 100%)`
- Gradiente fuerte: `linear-gradient(135deg, #E84A1F 0%, #FF6B35 100%)`
- Primary: `#FF6B35`
- Primary deep: `#E84A1F`
- Primary soft: `#FFE6DA`
- Primary ink: `#3D1A0A`
- Accent: `#FFB07A`

### Pololo — `violeta`
- Gradiente: `linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)`
- Gradiente fuerte: `linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)`
- Primary: `#7C3AED`
- Primary deep: `#5B21B6`
- Primary soft: `#EDE4FE`
- Primary ink: `#1E0E40`
- Accent: `#C084FC`

> **Recomendación final:** elegir **Atardecer** como default, mantener las otras dos como theming user-selectable. Si solo se va a soportar una, usar Atardecer.

## 2. Neutros — Modo claro (`light`)

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#FAFAF8` | Fondo principal app |
| `bgAlt` | `#F4F2EE` | Fondos secundarios, chips inactivos |
| `surface` | `#FFFFFF` | Cards, inputs, modales |
| `border` | `#E8E4DC` | Bordes finos por defecto |
| `borderStrong` | `#D4CEC1` | Bordes destacados, dashed |
| `ink` | `#1A1816` | Texto primario |
| `inkSoft` | `#5A554D` | Texto secundario |
| `inkMuted` | `#8B857A` | Labels, placeholders, iconos inactivos |

## 3. Neutros — Modo oscuro (`dark`)

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#0E0D0C` | Fondo principal |
| `bgAlt` | `#161513` | Fondos secundarios |
| `surface` | `#1C1A18` | Cards, inputs |
| `border` | `#2A2724` | Bordes finos |
| `borderStrong` | `#3A3631` | Bordes destacados |
| `ink` | `#F4F2EE` | Texto primario |
| `inkSoft` | `#A8A39A` | Texto secundario |
| `inkMuted` | `#6B665D` | Labels, placeholders |

## 4. Estados (mismos en light/dark con leves shifts)

| Estado | Light hex | Dark hex | Soft (light) | Soft (dark) |
|---|---|---|---|---|
| Verde (disponible / éxito) | `#10B981` | `#34D399` | `#D1FAE5` | `#064E3B` |
| Rojo (urgente / error) | `#EF4444` | `#F87171` | `#FEE2E2` | `#7F1D1D` |
| Amarillo (warning / nuevo) | `#F59E0B` | `#FBBF24` | `#FEF3C7` | `#78350F` |

⭐ Estrellas de rating: siempre `#F59E0B`.

## 5. Tipografía

### Familias
- **Display + Body:** Plus Jakarta Sans (Google Fonts, weights 400, 500, 600, 700, 800)
- **Mono:** JetBrains Mono (Google Fonts, weights 400, 500) — solo para placeholders de imagen y labels técnicos opcionales

### Escala (mobile, 380px ancho referencia)

| Token | Size | Weight | Letter spacing | Line height | Uso |
|---|---|---|---|---|---|
| `display.h1` | 24px | 800 | -0.7 | 1.15 | Títulos de pantalla principal |
| `display.h2` | 22px | 800 | -0.5 | 1.2 | Nombre maestro en detalle |
| `display.h3` | 20px | 800 | -0.4 | 1.2 | Nombre cliente en perfil |
| `display.h4` | 18px | 800 | -0.3 | 1.25 | Headers de chat, screen titles tabs |
| `display.title` | 16px | 800 | -0.3 | 1.3 | Section titles ("Calificaciones") |
| `display.cardTitle` | 15.5px | 700 | -0.2 | 1.25 | Nombre maestro en card |
| `body.lg` | 14px | 600/700 | 0 | 1.4 | Headers chat list, botones lg |
| `body.md` | 13.5px | 400/500/600/700 | 0 | 1.45 | Body principal, inputs, botones md |
| `body.sm` | 12.5px | 400/500/600 | 0 | 1.45 | Bio cards, descripciones, captions |
| `body.xs` | 12px | 600/700 | 0.1 | 1.4 | Botones sm, chips |
| `label.lg` | 11.5px | 700 | 0.4 (uppercase) | 1.3 | Labels de campo, "ESPECIALIDAD" |
| `label.sm` | 11px | 600/700 | 0.4 (uppercase) | 1.3 | Eyebrows ("ELECTRICISTA"), badges |
| `caption` | 10.5px | 600/700 | 0.2 | 1.3 | Status pills, timestamps |
| `tiny` | 10px | 700/800 | 0.4 | 1.3 | URGENTE badge, badges chiquitos |

> **Nota:** los pesos 800 (Extra Bold) son críticos en display. Verificar que la fuente del sistema target los soporte; si no, usar 700.

## 6. Spacing scale

Sistema 4-base. Tokens recomendados:

| Token | px |
|---|---|
| `space-0` | 0 |
| `space-1` | 4 |
| `space-2` | 6 |
| `space-3` | 8 |
| `space-4` | 10 |
| `space-5` | 12 |
| `space-6` | 14 |
| `space-7` | 16 |
| `space-8` | 18 |
| `space-9` | 20 |
| `space-10` | 24 |
| `space-12` | 32 |

Padding horizontal estándar de pantalla: **18px**. Gap entre cards: **12px**. Gap interno de card: **8-14px**.

## 7. Border radii

| Token | px | Uso |
|---|---|---|
| `radius-sm` | 8 | Inputs pequeños, badges, tags grandes |
| `radius-md` | 10 | Inputs sm, badges, image thumbs |
| `radius-lg` | 12 | Inputs estándar, botones md, icon buttons |
| `radius-xl` | 14 | Botones lg, cards en grid |
| `radius-2xl` | 16 | Cards de toast, mensajes chat |
| `radius-3xl` | 18 | Cards principales, banner gradient |
| `radius-pill` | 999 | Chips, status pills, FAB |
| `radius-phone` | 36 | Bezel teléfono (solo mockups) |

## 8. Shadows / elevation

| Token | Valor | Uso |
|---|---|---|
| `shadow-none` | none | Default |
| `shadow-card` | `0 1px 2px rgba(0,0,0,0.04)` | Cards en listas (opcional, también funciona solo borde) |
| `shadow-button-primary` | `0 6px 18px -6px rgba(0,0,0,0.28)` | Botón primary lg |
| `shadow-toast` | `0 12px 30px -12px rgba(0,0,0,0.25)` | Toasts |
| `shadow-modal` | `0 16px 40px -12px rgba(0,0,0,0.3)` | Bottom sheet, modal |
| `shadow-phone` | `0 30px 80px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.08)` | Solo mockups |

> En modo oscuro las sombras tienen menos efecto; preferir borde de 1px sobre sombra.

## 9. Animaciones / transiciones

| Token | Duración | Easing | Uso |
|---|---|---|---|
| `motion-fast` | 100ms | `ease-out` | Botón press, toggle |
| `motion-base` | 150ms | `ease-out` | Hover, color/bg transitions |
| `motion-slide` | 250ms | `cubic-bezier(.2,.7,.3,1)` | Toast slide-in, modal |
| `motion-page` | 300ms | `ease-in-out` | Cambio de tab, push de pantalla |

Toast slide-down keyframe (referencia):
```css
from { opacity: 0; transform: translateY(-6px); }
to   { opacity: 1; transform: translateY(0); }
```

## 10. Hit targets / a11y

- **Mínimo absoluto:** 44×44pt (iOS) / 48×48dp (Android). Los chips usan padding interno suficiente para llegar a 36+ con padding extendido por la mano del usuario.
- **Tab bar:** ítems 60-68pt de alto.
- **Botones primary lg:** altura 48-52px.
- Bordes y outlines en focus: **2px solid** del color primary.

## 11. Iconografía

Sistema **lucide / feather** (stroked, 1.8 stroke width, redondeado). Tamaños usados:
- 10-12px (badges, inline)
- 14-16px (UI controls)
- 18-22px (header actions, FABs)

Lista de iconos referenciados en el prototipo (ver `prototype/primitives.jsx` función `PTIcon` para paths exactos):
`users, plus, chat, user, search, filter, star, pin, phone, send, arrow-left, arrow-right, check, x, camera, image, bell, zap, tools, check-circle, edit, chevron-down, chevron-right, briefcase, settings, shield, sparkles, map, clock, mic, paperclip, thumbs-up`

> **En el codebase target:** usar la librería de iconos del ecosistema (`lucide-react-native`, `@expo/vector-icons`, SF Symbols en iOS nativo, Material Symbols en Android nativo).

## 12. Imagery / placeholders

En el prototipo todas las imágenes son placeholders striped monoespaciados (`<PTAvatar>`, `<PTImagePlaceholder>`). En producción:

- **Fotos de maestros:** subidas por el usuario, almacenadas en S3/Cloudflare R2/Firebase Storage. Sirvientes: 64×64 (cards), 84×84 (detalle), 168×168 (perfil).
- **Portafolio:** múltiples imágenes por maestro, max 12. Crop 4:3 a 88×88 thumbs, fullscreen lightbox al tap.
- **Fotos de publicación:** max 5 por solicitud, mismo tratamiento.
- **Fallback:** iniciales en círculo con color de paleta primary cuando no hay foto.
