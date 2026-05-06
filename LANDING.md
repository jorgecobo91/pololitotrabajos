# LANDING PÚBLICA — POLOLITOTRABAJOS

Landing mobile-first para captar tráfico y registrar usuarios (clientes y maestros).

---

## Versión definitiva: **08 · Equilibrio Atardecer**

Es la landing **aprobada para producción**. Combina:
- **Copy emocional + jerarquía editorial** (de la variación 03 Atardecer)
- **Sistema cromático disciplinado 70 / 20 / 10** (de la variación 07 Equilibrio)

Todas las demás variaciones (01–07) son **exploraciones de proceso** y NO deben implementarse — están en el archivo `LANDINGS.html` solo como referencia visual.

---

## Sistema cromático — regla 70 / 20 / 10

| Proporción | Uso | Color |
|---|---|---|
| **70 %** Neutros | Fondos, texto cuerpo, bordes, superficies | Blanco `#FFFFFF`, gris `#F7F7F9`, borde `#E8E6EF`, tinta `#0F0B1A` |
| **20 %** Violeta (estructura) | Wordmark, eyebrows, iconos de categoría, secondary CTA, links, bloque de confianza | `#7C3AED` / `#5B21B6` / `#EDE4FE` / `#1E0E40` |
| **10 %** Gradiente naranja → violeta (impacto) | **Solo** en CTAs primarios, hero impact, palabra "pololito" del titular, palabra "al tiro" del CTA final, números de stats, tab activo | `linear-gradient(135deg, #FF6B35 0%, #7C3AED 100%)` |

### Estados con color propio (no entran en el 10 %)
- **URGENTE** → rojo sólido `#EF4444` + fondo `#FEE2E2`
- **Rating / estrellas** → amarillo `#F59E0B`
- **Disponible / online** → verde `#10B981`
- **Error** → rojo `#EF4444`

### NO hacer
- ❌ Gradiente como fondo de página completa
- ❌ Gradiente en cada tarjeta o cada icono
- ❌ Gradiente en cuerpo de texto
- ❌ Sombras de color exageradas (`box-shadow: 0 14px 32px rgba(255,107,53,0.5)`)

### SÍ hacer
- ✅ Gradiente reservado para 1–2 elementos por sección como máximo
- ✅ Iconos de categoría en violeta soft (`#EDE4FE` fondo + `#5B21B6` icono)
- ✅ Bloque de confianza en violeta profundo `#1E0E40`, no en negro

---

## Tipografía

Definida en `tokens.js` como `window.PT_FONT`:
- **Display** — para titulares, CTAs, números grandes (font-weight 800–900, letter-spacing negativo)
- **Body** — para párrafos, labels, descripciones (400–600)
- **Mono** — para eyebrows, badges, valores numéricos pequeños, tags (700, uppercase, letter-spacing 0.5–0.7)

Tamaños del hero: `48px / line-height 0.92 / letter-spacing -2.2`. La palabra "pololito" va en *itálica + gradient text*.

---

## Estructura de la landing (orden vertical)

1. **Nav** — wordmark + Entrar / Registrar (Registrar en gradient)
2. **Hero** — eyebrow con avatares apilados ("+1.240 maestros activos") + titular *"Tu próximo pololito empieza acá."*
3. **Hero image** — foto real de maestro trabajando + 2 badges flotantes ("4.9 · Don Luis" arriba izq, "Respondió en 12 minutos" abajo der)
4. **CTAs duales** — Buscar maestro (gradient) / Publicar trabajo (outline violeta)
5. **Trust indicators** — 4.8★ · <2h · +50 comunas (números en gradient text)
6. **Antes y después** — sección 02 con tarjeta dividida (problema en rojo / solución en violeta soft)
7. **Categorías** — 6 cards: Electricista, Gasfitería, Construcción, Carpintería, Techumbre, Pintura
8. **Confianza** — bloque oscuro violeta `#1E0E40` con 3 ítems (calificaciones, historial, contacto)
9. **CTA final** — *"Empieza al tiro."*
10. **Footer legal** — disclaimer de intermediario, términos, privacidad, soporte

---

## Copy clave (no inventar variaciones)

| Sección | Copy exacto |
|---|---|
| Hero | "Tu próximo *pololito* empieza acá." |
| Subtítulo hero | "Conectamos clientes con maestros confiables de todo Chile. Rápido, simple y al tiro." |
| Eyebrow social proof | "+1.240 maestros activos" |
| CTA primario | "Buscar un maestro" |
| CTA secundario | "Publicar trabajo" |
| Sección 02 | "De caos a calma." |
| Sección 03 | "Cualquier pega. Ahora." |
| Sección 04 | "Más confianza, menos riesgo." |
| CTA final | "Empieza *al tiro.*" |
| Subtítulo CTA final | "Es gratis. Toma 2 minutos. Sin compromiso." |

---

## Disclaimer legal (obligatorio en footer)

> POLOLITOTRABAJOS es **solo intermediaria**. No garantizamos calidad ni respondemos por incumplimientos, problemas de pago o resultados. Cada usuario es responsable de sus acuerdos. Revisa calificaciones antes de contratar.

Este texto debe aparecer en footer de landing **y** en footer de la app + Términos y Condiciones.

---

## Implementación recomendada

- **Framework**: Next.js 14 (App Router) — ver `ARCHITECTURE.md`
- **Ruta**: `/` (raíz pública del dominio)
- **SEO**: Open Graph con foto del hero, título "POLOLITOTRABAJOS — Maestros confiables al tiro", descripción del subtítulo hero
- **Performance**: imágenes optimizadas con `next/image`, fuentes con `next/font`
- **Analítica**: trackear clicks en ambos CTAs (primario y secundario) por separado para medir balance cliente/maestro
- **A/B test sugerido (post-launch)**: probar el orden de los CTAs (cliente primero vs maestro primero)

---

## Archivos de referencia

- `prototype/LANDINGS.html` — abre en navegador para ver las 8 variaciones lado a lado
- `prototype/landings-v3b.jsx` — código de la versión 08 definitiva
- `prototype/landings-v3.jsx` — versión 07 (paleta base)
- `prototype/landings.jsx` — versiones 01-03 (referencias)
- `prototype/landings-v2.jsx` — versiones 04-06 (referencias)

Para ver solo la 08 ganadora: abre `LANDINGS.html` y haz click en el botón ⛶ del artboard "08 · Equilibrio Atardecer".
