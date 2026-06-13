# Dokimatik — CLAUDE.md

> "Know if it's real." — Evaluador de calidad para proyectos vibe-coded.
> Producto de Monexus.

---

## Estado actual del proyecto

- **Ruta local:** `/Users/azahed/Documents/Dokimatik` (case-insensitive en macOS → también accesible como `DOKIMATIK`)
- **GitHub:** https://github.com/Mundinero/dokimatik
- **Vercel (producción):** https://dokimatik.vercel.app
- **Fase completada:** Phase 1 (UI) + Phase 2 (pipeline de evaluación)
- **Pendiente:** Agregar `ANTHROPIC_API_KEY` en Vercel → Settings → Environment Variables

---

## Stack & Arquitectura

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite 5 |
| Estilos | Tailwind CSS v4 (CSS-first config, `@theme` block en `index.css`) |
| Fonts | Satoshi 400/500/700 (Fontshare) · Geist Mono 400/500 (Google Fonts) |
| Parsing ZIP | JSZip (browser-side, sin backend) |
| IA | Claude API (`claude-sonnet-4-6`) — vía Vercel Function `api/evaluate.ts` |
| Deploy | Vercel → https://dokimatik.vercel.app |
| Package manager | npm |

### Estructura de directorios

```
api/
  evaluate.ts               — Vercel Function: proxy seguro a Claude API (usa ANTHROPIC_API_KEY server-side)

src/
  App.tsx                   — Raíz: estados isLoading/result, scroll-snap a scorecard al subir ZIP
  main.tsx                  — Entry point, envuelve <App> con <LanguageProvider>
  index.css                 — Tailwind v4 + tokens + keyframes + clases responsive
  constants/
    design.ts               — Tokens de color, tipografía, radios, sombras, scoreColor(), scoreLabel()
    rubric.ts               — 9 dimensiones, pesos, EvaluationResult, computeWeightedScore()
    i18n.ts                 — Traducciones EN/ES completas; type T = union de ambas
  context/
    LanguageContext.tsx      — Provider + hook useLanguage(); detecta idioma del browser
  components/
    Navbar.tsx              — Floating glass pill (Raycast-style), max 860px, LangToggle EN/ES
    HeroDropzone.tsx        — Drag & drop ZIP, gradiente rojo multi-stop + blur, binary grid
    DotGrid.tsx             — Canvas interactivo: malla de 0/1, flip rápido cerca del cursor
    ScorecardShell.tsx      — Scorecard vacío/skeleton (estado antes de evaluar)
    Scorecard.tsx           — Scorecard con datos reales: score, radar, dimensiones, recomendaciones
  lib/
    parseZip.ts             — JSZip: extrae file tree + key files + code snippets (máx 200 líneas)
    buildPrompt.ts          — Construye el prompt estructurado para Claude con rúbrica + schema JSON
    callClaude.ts           — Dev: llama API directo (VITE_ANTHROPIC_API_KEY) · Prod: /api/evaluate
```

---

## Design System — Raycast-inspired

### Colores (canónico, ver también `src/constants/design.ts`)

| Token | Hex | Uso |
|-------|-----|-----|
| canvas | `#040506` | Fondo raíz del body |
| surface-1 | `#07080a` | Cards principales |
| surface-2 | `#111214` | Badges, inputs, backgrounds secundarios |
| surface-3 | `#1b1c1e` | Elementos terciarios, hover states |
| border | `#363739` | Todos los bordes |
| text-primary | `#ffffff` | Texto principal |
| text-secondary | `#9c9c9d` | Texto de soporte |
| text-tertiary | `#6a6b6c` | Labels, metadata |
| accent | `#ff6363` | **Solo status y logo** — nunca como fill de botón |
| cta-bg | `#e6e6e6` | Fondo de botones CTA |
| cta-text | `#2f3031` | Texto de botones CTA |
| mint | `#59d499` | Pass states / PRODUCTION READY |
| sky | `#56c2ff` | Info states / NEEDS WORK |

### Tipografía

- **Sans:** Satoshi (Fontshare) — pesos 400, 500, 700
- **Mono:** Geist Mono — scores, versiones, file paths, badges de código
- **Letter-spacing headlines:**
  - 24px → `-0.05px`
  - 32px → `-0.06px`
  - 64px → `-0.13px`
- **Badge tracking:** `+0.04em`

### Border radius

| Elemento | Radio |
|----------|-------|
| Cards | `11px` |
| Badges | `6px` |
| Inputs | `8px` |
| Modals | `16px` |
| Buttons | `8px` |

### Sombras

Exclusivamente monocromáticas: `rgba(0,0,0,x)` y `rgba(255,255,255,x)`.

```ts
card:      '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)'
cardHover: '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)'
modal:     '0 24px 64px rgba(0,0,0,0.7)'
```

### Gradiente de sección

```css
radial-gradient(84.6% 73.49% at 50% 26.51%, rgba(4,63,150,0.7), rgba(6,18,37,0.25))
```

---

## Rúbrica — 9 Dimensiones (fuente canónica)

Ver `src/constants/rubric.ts`. No modificar aquí sin sincronizar allí.

| id | Label | Peso | Nullable |
|----|-------|------|----------|
| structure | Estructura del proyecto | 0.15 | No |
| dependencies | Gestión de dependencias | 0.12 | Sí |
| env_vars | Variables de entorno | 0.12 | Sí |
| database | BD & Persistencia | 0.10 | Sí |
| versioning | Control de versiones | 0.10 | No |
| hosting | Hosting / Deployment | 0.10 | No |
| security | Seguridad básica | 0.13 | No |
| agent_memory | Persistencia del agente | 0.10 | Sí |
| error_handling | Manejo de errores | 0.08 | No |

- **Umbral producción:** 7.0 / 10
- Las dimensiones nullable marcadas N/A redistribuyen su peso proporcionalmente.
- Si `CLAUDE.md` o `AGENTS.md` está presente → dimensión `agent_memory` se destaca con ✓.

### Colores de score

| Rango | Color | Label |
|-------|-------|-------|
| ≥ 7.0 | `#59d499` (mint) | PRODUCTION READY |
| 5.0–6.9 | `#56c2ff` (sky) | NEEDS WORK |
| < 5.0 | `#ff6363` (accent) | NOT READY |

---

## Detección de tipo de proyecto

Clasificar automáticamente antes de puntuar:

| Tipo | Criterios |
|------|-----------|
| Static HTML | Solo `.html`/`.css`/`.js`, sin `package.json` o con `package.json` simple sin framework |
| App | Tiene framework (React, Vue, etc.) pero sin backend explícito |
| Fullstack | Backend presente: API routes, servidor Express/FastAPI/Django, Dockerfile con server |

Mostrar como badge antes del scorecard.

---

## Input — Parsing ZIP

Archivos que extraer y enviar a Claude:
- Árbol de archivos completo
- `package.json` (o `requirements.txt`, `pyproject.toml`)
- `README.md`
- `.env.example`
- `CLAUDE.md` / `AGENTS.md`
- `Dockerfile` / `vercel.json` / `railway.toml` / `netlify.toml`
- Cualquier `.js` / `.ts` / `.py` — primeras 200 líneas por archivo

El parsing ocurre 100% en el browser con JSZip. Nunca se sube ningún archivo.

---

## Naming Conventions

- Componentes: PascalCase (`ScorecardShell.tsx`)
- Hooks: `useX` (`useFileParser`, `useScorecardState`)
- Constants: UPPER_SNAKE para valores únicos, camelCase para objetos (`RUBRIC`, `colors`)
- Archivos de lógica pura: camelCase (`buildPrompt.ts`, `parseZip.ts`)
- CSS classes: solo Tailwind v4 utilities + las clases globales definidas en `index.css`
- Variables de entorno: prefijo `VITE_` para el cliente

---

## Lo que Claude NUNCA debe hacer

### Diseño
- ❌ Usar fondos de color en secciones (solo gradiente radial o surface colors)
- ❌ Botones con fill blanco puro (`#ffffff`) — usar siempre `#e6e6e6` (cta-bg)
- ❌ `border-radius` mayor a 16px en cards o contenedores
- ❌ Usar `accent` (`#ff6363`) como fill de botones — solo para logos y estados
- ❌ Sombras de colores — solo monocromáticas
- ❌ Múltiples colores de acento compitiendo en la misma vista
- ❌ Tipografía system-ui sin haber cargado Satoshi primero

### Código
- ❌ Crear archivos `.md` de documentación sin que el usuario lo pida
- ❌ Añadir manejo de errores para casos imposibles dentro del sistema
- ❌ Comentarios que explican QUÉ hace el código (los nombres ya lo dicen)
- ❌ Abstracciones prematuras — 3 líneas similares no justifican un helper
- ❌ `any` en TypeScript sin un comentario de por qué es necesario
- ❌ Importar desde rutas absolutas cuando existe un alias configurado

### API Claude
- ❌ Enviar el ZIP completo como binario — siempre construir un summary estructurado
- ❌ Hardcodear API keys — siempre desde `import.meta.env.VITE_ANTHROPIC_API_KEY`
- ❌ Llamar a la Claude API desde el browser directamente en producción — usar Vercel Functions

---

## Variables de entorno requeridas

```env
VITE_ANTHROPIC_API_KEY=   # solo para desarrollo local — llama a Claude API directo desde browser
```

En producción: la key vive en el servidor como `ANTHROPIC_API_KEY` (sin prefijo VITE_).
Agregarla en: Vercel Dashboard → dokimatik → Settings → Environment Variables.

---

## Decisiones de diseño implementadas

- **Layout:** scroll-snap vertical (`y mandatory`), dos secciones de 100vh exactas
- **Hero gradient:** `radial-gradient` rojo multi-stop + `filter: blur(36px)` + `inset: -60px` para evitar color banding
- **Headline:** `display: flex; flex-wrap: wrap` con dos spans `white-space: nowrap` — rompe sólo en el punto intermedio de la oración al estrechar la ventana
- **Navbar:** `position: fixed`, floating glass pill centrada `max-width: 860px`, `pointerEvents: none` en el wrapper / `all` en el `<nav>`
- **Scorecard vacío → real:** `ScorecardShell` se reemplaza por `Scorecard` cuando `result !== null` en App.tsx
- **i18n:** `type T = (typeof translations)[keyof typeof translations]` — union de EN y ES para que ambas sean asignables al contexto
- **Slogan:** EN "Real code. No coating." / ES "Código real. Nada superficial." — "Real"/"real" en `#ff6363`
- **Eyebrow:** EN "The Touchstone for Vibe Code" / ES "La Piedra de Toque para Vibe Code" — texto rojo con `text-shadow` glow, sin recuadro
