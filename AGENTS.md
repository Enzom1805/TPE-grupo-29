# AGENTS.md — Memoria permanente del proyecto TPE (Kingly Games)

> Este archivo es memoria operativa persistente. Leelo SIEMPRE al iniciar una sesión
> y actualizalo cuando avance el trabajo. Si el contexto se está llenando, releyendo
> este archivo (especialmente §7 y §8) debe alcanzar para continuar.

---

## 1. ROL Y OBJETIVO PERMANENTE

Actúo como **Software Architect Senior** (arquitectura frontend, JS, CSS, diseño modular,
escalabilidad, SOLID). Misión: auditar y reorganizar TODO el proyecto TPE hacia una
arquitectura híbrida **Feature-Based + Domain-Based + Atomic Design**, con separación de
responsabilidades, alta cohesión, bajo acoplamiento y encapsulamiento.

**Regla de comunicación permanente:** mostrar siempre el razonamiento y las decisiones
a medida que se toman, no solo el resultado final.

**Regla de trabajo permanente:** todo el trabajo de refactorización se hace sobre una
COPIA del proyecto (ej.: `TPE-refactor/`), nunca directamente sobre el original.

## 2. RESTRICCIÓN TECNOLÓGICA (INEGOCIABLE)

Proyecto académico. **Prohibido** cualquier framework, librería o dependencia externa
(React/Vue, Bootstrap/Tailwind, motores de juego, routers, npm packages funcionales).
Solo: HTML5, CSS3, JavaScript Vanilla, ES Modules, APIs nativas del navegador
(DOM, Canvas 2D, Fetch, Web Storage, History). Tests con `node --test` (runner nativo,
no es dependencia). Sin bundler. Respetar el mecanismo de ejecución original (MPA).

## 3. MODELO MENTAL DEL PROYECTO (verificado en auditoría)

- **MPA vanilla sin bundler**: páginas HTML en `pages/` que cargan módulos ES de
  `js/pages/` que componen DOM dentro de `#app` en `DOMContentLoaded`.
- **`game.html` es el VIEWPORT ÚNICO de juegos** (decisión de diseño del autor, NO eliminar):
  se inyecta dinámicamente el contenido del juego según `?id=N`, que referencia un
  diccionario de juegos. Hoy eso vive como `if/else` en `GameFrame.js`
  (`id===2` → PegPlayer, `id===3` → BlockaController). El objetivo es formalizarlo en un
  **GameRegistry** con contrato `{ id, mount(container), destroy() }` por juego.
- Futuro: juegos propios Y juegos traídos de afuera, todos inyectados en ese viewport.
- Juegos implementados: **Batman Peg Solitaire (id 2)** y **Blocka (id 3)**.
  El resto del catálogo (`data/games.js`, ~30 juegos) son placeholders con imagen.
- Ya existe capacidad de limpieza: `PegBoardCanvas.destroy()` y `BlockaPlayer.destroy()`
  liberan listeners/timers/rAF. El ciclo de vida del registry debe apoyarse en eso.
- Blocka tiene HOY doble integración (blocka.html directo + game.html vía GameFrame):
  debe unificarse por el registry.
- Sin dependencias circulares. `main.js`, `services/auth.js`, `services/subscription.js`,
  `services/games.js` están vacíos. `models/User.js`, `models/Subscription.js` y
  `atoms/PegChip.js` nunca se importan (conservar User/Subscription: dominio futuro;
  verificar PegChip antes de eliminar).
- Assets en JS se referencian relativos al DOCUMENTO (`../assets/...`): mover los `.js`
  no los rompe, pero verificar uno por uno.

## 4. ARQUITECTURA OBJETIVO (aprobada en líneas generales)

```
app/        → bootstrap y composición común
layouts/    → Header+Breadcrumbs+contenido+Footer
pages/      → entradas de ruta (HTML + entry JS fino)
shared/     → ui/ (atoms|molecules|organisms SOLO lo verdaderamente compartido),
              utils/, data/, models/, styles/ (tokens + reset)
features/   → auth/, community/ (cada una: components/, index.js)
games/
  core/     → game-registry.js + game-frame.js (loader genérico por id)
  peg-solitaire/ → engine/ components/ data/ styles/ assets/ index.js
  blocka/        → controller/ engine/ components/ data/ styles/ assets/ index.js
  catalog/  → datos e imágenes de juegos placeholder (si aplica)
assets/     → solo compartidos (fonts/, icons/, sonidos globales)
```

Reglas de dependencia: shared no conoce features/juegos; juegos no dependen de juegos;
features no importan internals de juegos; la plataforma solo conoce el contrato público
(`index.js`) de cada juego. Encapsular con `index.js` por módulo.

CSS: `main.css` NO debe importar CSS de juegos (hoy filtra `peg-solitaire.css` a todo el
sitio). Cada página carga tokens + global + CSS de lo que usa. Cero cambios de selectores.

## 5. REGLAS DE SEGURIDAD DE LA REFACTORIZACIÓN (SIEMPRE)

- Antes de mover/editar/borrar: analizar quién lo importa, qué importa, rutas de assets,
  selectores CSS y referencias en HTML.
- Preservar contratos, firmas, comportamiento y UX. Refactorización estructural únicamente.
- Migración por bloques con validación después de cada uno; no acumular cambios con errores.
- No eliminar archivos sin verificar obsolescencia. Documentar problemas preexistentes
  separándolos de errores introducidos.
- No afirmar que algo funciona si no se probó.

## 6. ESTADO DEL TRABAJO

- [x] Etapa 1: Auditoría completa (inventario + dependencias + código muerto).
- [x] Etapa 2: Diagnóstico (Atomic global mezcla dominios, GameFrame acoplado, CSS con
      filtración cruzada, doble integración de Blocka).
- [x] Etapa 3: Propuesta presentada. Usuario la enriqueció: el viewport único de
      `game.html` con inyección por id es una decisión de diseño a CONSERVAR y formalizar.
- [x] Etapa 4: Migración COMPLETA (Bloques 0–5) sobre `/home/ccindor/Escritorio/TPE-refactor`.
      Estructura final: pages/ (entries+styles), shared/ (ui/utils/data/models/styles),
      features/ (auth, community), games/ (core + peg-solitaire + blocka + index.js manifest),
      assets/ (compartidos), tests/. NO se crearon app/ ni layouts/ (decisión documentada
      en ARCHITECTURE.md: abstracción innecesaria para 5 entries con diferencias reales).
- [x] Etapa 5: Validación: tests 23/23 OK, integridad de referencias 0 rotas (script
      /tmp/opencode/verify_integrity.py), screenshots de las 6 páginas + placeholder OK.
      ARCHITECTURE.md creado. Commits por bloque en el repo de la copia.
- [ ] Entrega final al usuario (resumen de migración en chat).

## 7. GRAFO DE CONTEXTO (releer para reconstruir el estado)

```
PROYECTO: TPE (Kingly Games, minijuegos, académico, vanilla-only)
│
├── EJECUCIÓN: MPA. pages/*.html → js/pages/*.js (ES modules) → componen #app
│   └── game.html?id=N = VIEWPORT ÚNICO ← REQUISITO DEL USUARIO: mantener inyección dinámica
│
├── JUEGOS (auto-contenidos, sin tocarse entre sí)
│   ├── id=2 Peg Solitaire: PegEngine/PegPiece + PegPlayer/PegBoardCanvas + pegThemes/pegGrid
│   ├── id=3 Blocka: BlockaController + BlockaEngine/FilterProcessor + BlockaPlayer + modales
│   └── resto: placeholders en data/games.js (catálogo con imágenes)
│
├── PROBLEMA CENTRAL: GameFrame.js hace if/else por id con imports estáticos
│   └── SOLUCIÓN: games/core/game-registry.js — cada juego expone index.js
│       con { id, mount(container), destroy() } y se auto-registra.
│       El loader resuelve por id. Mismo comportamiento, contrato explícito,
│       extensible a juegos externos a futuro.
│
├── DECISIONES TOMADAS
│   ├── Atomic Design solo en shared/ui y dentro de cada juego (TimerBadge/PieceCanvas/
│   │   StatCard van a sus juegos, no a shared)
│   ├── CSS de juegos sale de main.css; cada página carga lo suyo
│   ├── Blocka se unifica por registry (una sola vía de integración)
│   ├── models/User + Subscription se conservan (feature futura suscripciones)
│   ├── Trabajar sobre COPIA (TPE-refactor/); tests nuevos con node --test
│   └── Migración en bloques: shared → peg → blocka → core/registry → features → docs
│
└── PRÓXIMO PASO: aprobación del usuario → cambiar a agente build → Bloque 0 (copia+tests)
```

## 8. ÚLTIMA ACTUALIZACIÓN (mantener al avanzar)

- **2026-11-16 (MIGRACIÓN COMPLETA ✅)**: Bloques 0–5 ejecutados y committeados en
  TPE-refactor. Registry formal con contrato {id,mount,destroy}, manifest games/index.js,
  viewport dinámico conservado. Tests 23/23 (runner: tests/index.html; ejecutar con
  `python3 -m http.server 8123` + firefox headless screenshot). Integridad 0 refs rotas.
  ARCHITECTURE.md escrito (incluye problemas preexistentes y CSS muertos conservados).
  Lección registrada: tooling SIEMPRE con rutas absolutas ancladas a la copia (un fixer
  modificó por error archivos del ORIGINAL; fue restaurado con `git restore js/`).
  Original TPE intacto (solo .idea/workspace.xml modificado de antes).
- **2026-11-16 (Bloque 0 ✅)**: copia + harness de tests vanilla (19/19 baseline).
- **2026-11-16 (Auditoría + propuesta ✅)**: ver §6/§7. Viewport único game.html?id=N es
  requisito permanente del usuario.
