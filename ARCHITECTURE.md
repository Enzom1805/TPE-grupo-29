# ARCHITECTURE.md — Kingly Games (TPE)

Plataforma web de minijuegos construida **exclusivamente con tecnologías nativas del
navegador** (HTML5, CSS3, JavaScript vanilla, ES Modules, DOM/Canvas/Fetch/Web Storage).
Sin frameworks, sin librerías externas, sin bundler. Arquitectura MPA (Multi-Page App).

---

## 1. Estructura general del proyecto

```
TPE-refactor/
├── index.html              # Redirige al punto de entrada de la app
├── pages/                  # Entradas de ruta (MPA)
│   ├── *.html              # Vistas: home, game, blocka, login, register
│   ├── *.js                # Entries JS finos: componen el DOM en #app
│   └── styles/             # CSS propio de cada página
├── shared/                 # Verdaderamente compartido entre funcionalidades
│   ├── ui/
│   │   ├── atoms/          # Primitivas: Button, Icon, Link, Input, Label, Textarea, Checkbox
│   │   ├── molecules/      # Combinaciones: FormField, Breadcrumbs, GameCard, UserMenu, …
│   │   └── organisms/      # Secciones: Header, FatFooter, Loader, carruseles, HowToPlay
│   ├── utils/              # dropdown, helpmenu, validators, sound
│   ├── data/               # games (catálogo), breadcrumbData
│   ├── models/             # Game, User, Subscription (dominio)
│   └── styles/             # main.css (reset+global), tokens/, atoms/, molecules/, organisms/, utils/
├── features/               # Funcionalidades de plataforma (autocontenidas)
│   ├── auth/               # components/ (Login/RegisterForm, CaptchaField), data/, styles/, index.js
│   └── community/          # components/ (Community, CommentForm/Card), data/, styles/, index.js
├── games/                  # Ecosistema de minijuegos
│   ├── core/               # Infraestructura: game-registry.js, game-frame.js, styles/
│   ├── peg-solitaire/      # Módulo del juego id=2 (ver §4)
│   ├── blocka/             # Módulo del juego id=3 (ver §4)
│   └── index.js            # Manifest de juegos instalados (único punto de composición)
├── assets/                 # Recursos COMPARTIDOS: fonts/, icons/, sounds/
├── tests/                  # Suite vanilla: assert.js + *.test.js + index.html (runner)
└── AGENTS.md               # Memoria operativa del proyecto
```

## 2. Responsabilidad de cada directorio

| Directorio | Responsabilidad | NO debe contener |
|---|---|---|
| `pages/` | Rutas de la MPA: HTML + entry JS que compone la página | Lógica de negocio ni componentes |
| `shared/` | UI, utilidades, datos, modelos y estilos reutilizados por ≥2 módulos con responsabilidad común | Componentes de un solo consumo o específicos de un juego |
| `features/` | Funcionalidades verticales de plataforma (auth, community) con sus componentes, datos y estilos | Imports hacia `games/*` (internals) |
| `games/core/` | Infraestructura de juegos: registro, viewport, estilos del frame | Lógica o componentes de un juego concreto |
| `games/<juego>/` | Todo lo exclusivo de ese juego (encapsulado) | Referencias a otros juegos |
| `assets/` | Recursos compartidos (fuentes, iconos globales, sonidos globales) | Assets exclusivos de un juego |
| `tests/` | Suite de pruebas automatizadas vanilla | — |

## 3. Arquitectura de funcionalidades

Cada feature agrupa verticalmente sus componentes, datos y estilos, y expone su API
pública mediante `index.js`. Consumidores:

- `pages/login.html` → `pages/login.js` → `features/auth` (LoginForm).
- `pages/register.html` → `pages/register.js` → `features/auth` (RegisterForm + validadores).
- `pages/game.js` → `features/community` (Community) y `shared/ui` (resto de secciones).

Reglas: una feature nunca importa internals de otra feature ni de un juego; solo
`shared/` y su propio contexto.

## 4. Arquitectura de los juegos

Cada juego es un **módulo independiente y autocontenido**:

```
games/blocka/
├── controller/   BlockaController (orquestación)
├── engine/       BlockaEngine, FilterProcessor (lógica pura, testeable)
├── components/   BlockaPlayer, PieceCanvas, TimerBadge, modales de nivel
├── data/         blocka-data (niveles, banco de imágenes)
├── styles/       blocka.css, blocka-board.css, atoms/, molecules/
├── assets/       images/levels/ (imágenes de niveles), videos/
└── index.js      CONTRATO PÚBLICO
```

Atomic Design se aplica dentro del módulo cuando aporta (atoms/ del juego), nunca como
clasificación global. Los componentes que solo usa un juego viven en ese juego
(TimerBadge y PieceCanvas son de Blocka; StatCard es de Peg).

## 5. Organización de componentes (Atomic Design)

- **Ámbito global** (`shared/ui/`): atoms → molecules → organisms, solo con lo
  verdaderamente reutilizado (Button, FormField, Header, Breadcrumbs, GameCard…).
- **Ámbito de juego**: el mismo enfoque, dentro de `games/<juego>/components/`.
- Criterio: un componente es "shared" por responsabilidad común y reutilización real,
  no por similitud visual.

## 6. Sistema de dependencias

Dirección única y sin ciclos:

```
pages/  →  app composition
        →  features/*  →  shared/*
        →  games/core  →  games/index.js (manifest) → games/<juego>/index.js (contrato)
games/<juego>/*  →  shared/*  (solo UI/utils compartidos)
shared/*         →  no conoce features ni games
```

- Encapsulamiento: cada módulo expone `index.js`; está prohibido importar internals
  profundos de otro módulo.
- Los juegos no se conocen entre sí.
- Assets: los `.js` referencian assets relativos al **documento** (`pages/*.html`);
  los `.css` relativos al **propio archivo CSS**. Convención documentada y verificada
  (ver tests de integridad).

## 7. Sistema de registro y carga de juegos

- **Contrato de integración** (por juego): `{ id, mount(container), destroy?() }`.
- **`games/core/game-registry.js`**: registro puro (Map id→entrada, validación,
  anti-duplicados, `getGameById`).
- **`games/index.js`**: manifest de juegos instalados — único lugar que lista juegos.
- **`games/core/game-frame.js`**: viewport único. `pages/game.html?id=N` resuelve el
  juego por id desde el registry e **inyecta dinámicamente** su contenido; si no hay
  entrada registrada, muestra el placeholder "Juego no disponible en esta demo".
- **Ciclo de vida**: mount (monta en el contenedor), ejecución, y destroy opcional que
  limpia listeners/timers/rAF (PegPlayer expone `container.destroy()` que detiene el
  timer y destruye el canvas; BlockaController limpia el player previo al recargar).

**Cómo agregar un juego nuevo (propietario):**
1. Crear `games/<mi-juego>/` con su lógica, componentes, datos, estilos y assets.
2. Crear `games/<mi-juego>/index.js` exportando `{ id, mount, destroy? }`
   (el `id` debe existir en `shared/data/games.js`).
3. Importarlo y registrarlo en `games/index.js` (1 línea).
4. Agregar sus hojas de estilo al `<head>` de `pages/game.html` (o cargarlas desde
   `mount()`). No tocar nada más de la plataforma.

Para juegos **externos** (embebidos), el contrato admite entradas cuyo `mount()` inyecte
un `<iframe>`; el viewport no cambia.

## 8. Convenciones de nomenclatura

- Componentes UI: `PascalCase.js` (Button, GameCard) — export default function.
- Infraestructura/módulos no-visuales: `kebab-case.js` (game-registry, game-frame).
- Modelos: clases `PascalCase` con export default (Game, User, Subscription).
- CSS: BEM (`bloque__elemento--modificador`), un archivo por componente en
  `styles/` del módulo.
- Datos: `camelCase.js` (blocka-data, pegGrid — se conservan los nombres históricos).
- Entradas de página: minúsculas (`home.js`, `blocka-page.js`).

## 9. Criterios para decidir dónde ubicar archivos nuevos

1. ¿Lo usan ≥2 módulos con responsabilidad común real? → `shared/`.
2. ¿Es exclusivo de una funcionalidad vertical? → `features/<feature>/`.
3. ¿Es exclusivo de un juego? → `games/<juego>/`.
4. ¿Es infraestructura del ecosistema de juegos (independiente del juego)? → `games/core/`.
5. ¿Es CSS de una ruta? → `pages/styles/`.
6. ¿Es un asset compartido? → `assets/`; si es exclusivo de un juego → sus `assets/`.
7. Ante la duda: el módulo más específico posible; promocionar a `shared/` solo cuando
   exista un segundo consumo real.

## 10. Tests y verificación

- Suite: `tests/index.html` (runner vanilla con mini-framework `assert.js`).
- Ejecución automatizada: `python3 -m http.server 8123` + `firefox --headless
  --screenshot` contra `http://localhost:8123/tests/index.html` (23/23 OK).
- Verificador de integridad de referencias (imports JS, refs HTML, `url()` CSS):
  0 referencias rotas.
- Cobertura: lógica de PegEngine (tablero, movimientos, ejecución, reset),
  FilterProcessor, validadores de registro, modelos de dominio y contrato del registry.
- Limitación: no hay runtime Node en el entorno; por eso el corredor es el navegador.

## Problemas preexistentes documentados (NO introducidos por la migración)

- `shared/data/games.js` pasa `"Premium"/"Free"` en mayúscula, pero `Game.isPremium()`/
  `isFree()` comparan en minúscula: ningún juego del catálogo se detecta como premium.
- `index.html` tiene un meta-refresh a `home.html` que un script inline sobrescribe a
  `game.html?id=2`.
- CSS muertos conservados (sin referencias, duplicados o sobrantes):
  `games/peg-solitaire/styles/peg-workspace.css`, `peg-board.css` (duplican reglas de
  `peg-solitaire.css`), `shared/styles/organisms/hamburguer-menu.css`,
  `profile-menu.css`, `shared/styles/atoms/a.css`, `badge.css`,
  `games/blocka/styles/molecules/game-hud.css`, `helper-panel.css`.
- Componentes de solo comentario sin referencias, conservados en sus módulos:
  `games/blocka/components/BlockaInstructions.js`, `ImageSelectorCard.js`,
  `games/peg-solitaire/components/PegChip.js`.
