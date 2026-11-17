/**
 * Tests del spritesheet real del murciélago (atlas desde el GIF de referencia):
 * ciclo ping-pong puro, spec del atlas, render por celda con tintes de
 * golpe/sonar y fallback al pixel-art.
 *
 * Se usan imagen y canvas falsos: los tests no dependen de la red ni del DOM.
 */

import { assert, assertEquals } from "./assert.js";
import { BAT_SHEET_SPEC, pingPongFrame } from "../games/echobat/data/bat-sheet.js";
import { BatPlayer } from "../games/echobat/engine/BatPlayer.js";
import { ECHOBAT_CONFIG } from "../games/echobat/data/config.js";

/** Imagen falsa "cargada" (el engine solo consulta complete/naturalWidth). */
function fakeLoadedImage() {
    return { complete: true, naturalWidth: BAT_SHEET_SPEC.cellWidth * BAT_SHEET_SPEC.frameCount, naturalHeight: BAT_SHEET_SPEC.cellHeight };
}

/** Contexto 2D falso grabador. */
function createFakeContext() {
    const ops = [];
    return {
        ops,
        fillStyle: null,
        globalCompositeOperation: 'source-over',
        save() { ops.push({ op: 'save' }); },
        restore() { ops.push({ op: 'restore' }); },
        translate() {}, rotate() {},
        drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh) {
            ops.push({ op: 'drawImage', source: img, sx, sy, sw, sh, dx, dy, dw, dh });
        },
        fillRect(x, y, w, h) { ops.push({ op: 'fillRect', x, y, w, h, style: this.fillStyle }); },
        clearRect(x, y, w, h) { ops.push({ op: 'clearRect', x, y, w, h }); },
        beginPath() {}, moveTo() {}, lineTo() {}, closePath() {}, fill() {},
        arc() {}, stroke() {},
        createRadialGradient() { return { addColorStop() {} }; }
    };
}

/** Factory de canvas falso con contexto grabador independiente. */
function createCanvasFactory() {
    const canvases = [];
    return {
        canvases,
        create() {
            const canvas = {
                width: 0,
                height: 0,
                getContext: () => createFakeContext()
            };
            canvases.push(canvas);
            return canvas;
        }
    };
}

export default [
    // ---------------- Ciclo ping-pong (función pura) ----------------
    {
        name: "batsheet/pingPongFrame: recorre 0→1→2→1 y reinicia en 0",
        fn: () => {
            const cycle = BAT_SHEET_SPEC.cycle;
            assertEquals(pingPongFrame(0, cycle), 0);
            assertEquals(pingPongFrame(1, cycle), 1);
            assertEquals(pingPongFrame(2, cycle), 2);
            assertEquals(pingPongFrame(3, cycle), 1, "vuelta: pose 1, no salta a 0");
            assertEquals(pingPongFrame(4, cycle), 0, "el ciclo reinicia en la pose extendida");
        }
    },
    {
        name: "batsheet/pingPongFrame: acepta negativos, decimales y basura",
        fn: () => {
            const cycle = BAT_SHEET_SPEC.cycle;
            assertEquals(pingPongFrame(-1, cycle), 1, "-1 → último paso del ciclo");
            assertEquals(pingPongFrame(-4, cycle), 0);
            assertEquals(pingPongFrame(1.9, cycle), 1, "decimales → piso");
            assertEquals(pingPongFrame(NaN, cycle), 0, "NaN → pose 0");
            assertEquals(pingPongFrame(Infinity, cycle), 0, "Infinity → pose 0");
        }
    },
    {
        name: "batsheet/pingPongFrame: el resultado siempre es un índice válido del atlas",
        fn: () => {
            for (let i = -40; i < 40; i++) {
                const f = pingPongFrame(i);
                assert(f >= 0 && f < BAT_SHEET_SPEC.frameCount, `índice inválido ${f} para pos ${i}`);
            }
        }
    },

    // ---------------- Spec del atlas ----------------
    {
        name: "batsheet/spec: 4 frames (3 del GIF + pose dash), ciclo ping-pong de 4 pasos y escala 0.5",
        fn: () => {
            assertEquals(BAT_SHEET_SPEC.frameCount, 4);
            assertEquals(BAT_SHEET_SPEC.dashFrame, 3);
            assertEquals(BAT_SHEET_SPEC.cycle.length, 4);
            assertEquals(BAT_SHEET_SPEC.cellWidth, 112);
            assertEquals(BAT_SHEET_SPEC.cellHeight, 84);
            assertEquals(BAT_SHEET_SPEC.drawScale, 0.5);
            assert(BAT_SHEET_SPEC.url.endsWith('echobat-bat-sheet.png'));
        }
    },
    {
        name: "batsheet/spec: tamaño de dibujo ≈ área del jugador configurada",
        fn: () => {
            const drawW = BAT_SHEET_SPEC.cellWidth * BAT_SHEET_SPEC.drawScale;
            const drawH = BAT_SHEET_SPEC.cellHeight * BAT_SHEET_SPEC.drawScale;
            // El sprite puede desbordar un poco la caja lógica (48×28): las
            // alas exceden la hitbox a propósito, como en el original.
            assert(drawW <= ECHOBAT_CONFIG.player.width + 12, "ancho de dibujo razonable");
            assert(drawH <= ECHOBAT_CONFIG.player.height + 16, "alto de dibujo razonable");
        }
    },

    // ---------------- Render BatPlayer ----------------
    {
        name: "batsheet/BatPlayer: dibuja la celda del frame actual a drawScale",
        fn: () => {
            const factory = createCanvasFactory();
            const player = new BatPlayer(100, 100, { sheetImage: fakeLoadedImage(), createCanvas: factory.create });

            const ctx = createFakeContext();
            player.animFrame = 0;
            player.draw(ctx);
            const draw = ctx.ops.find(op => op.op === 'drawImage');
            assert(draw, "debe haber un drawImage");
            assertEquals(draw.sx, 0, "frame 0 → sx = 0");
            assertEquals(draw.sw, BAT_SHEET_SPEC.cellWidth);
            assertEquals(draw.dw, BAT_SHEET_SPEC.cellWidth * BAT_SHEET_SPEC.drawScale);
            assertEquals(draw.dh, BAT_SHEET_SPEC.cellHeight * BAT_SHEET_SPEC.drawScale);
        }
    },
    {
        name: "batsheet/BatPlayer: el avance de animación recorre el ping-pong",
        fn: () => {
            const factory = createCanvasFactory();
            const player = new BatPlayer(100, 100, { sheetImage: fakeLoadedImage(), createCanvas: factory.create });

            const sxs = [];
            for (let step = 0; step < 4; step++) {
                player.animFrame = step;
                const ctx = createFakeContext();
                player.draw(ctx);
                sxs.push(ctx.ops.find(op => op.op === 'drawImage').sx);
            }
            assertEquals(sxs[0], 0 * 112);
            assertEquals(sxs[1], 1 * 112);
            assertEquals(sxs[2], 2 * 112);
            assertEquals(sxs[3], 1 * 112, "paso 3 vuelve a la pose 1 (ping-pong)");
        }
    },
    {
        name: "batsheet/BatPlayer: golpe → tinte rojo vía source-atop",
        fn: () => {
            const factory = createCanvasFactory();
            const player = new BatPlayer(100, 100, { sheetImage: fakeLoadedImage(), createCanvas: factory.create });
            player.isHit = true;
            player.hitTimer = 10;

            const ctx = createFakeContext();
            player.draw(ctx);

            // El tinte ocurre en el canvas auxiliar; el resultado final es un drawImage
            const draw = ctx.ops.find(op => op.op === 'drawImage');
            assert(draw, "el frame tintado se dibuja sobre el destino");

            const tintCanvas = factory.canvases[0];
            assert(tintCanvas, "se creó un canvas auxiliar para el tinte");
            assertEquals(tintCanvas.width, BAT_SHEET_SPEC.cellWidth);
            assertEquals(tintCanvas.height, BAT_SHEET_SPEC.cellHeight);
        }
    },
    {
        name: "batsheet/BatPlayer: sonar activo → tinte violeta (sin silueta roja)",
        fn: () => {
            const factory = createCanvasFactory();
            const player = new BatPlayer(100, 100, { sheetImage: fakeLoadedImage(), createCanvas: factory.create });
            player.sonarConeTimer = 10;
            player.isHit = false;

            const ctx = createFakeContext();
            player.draw(ctx);

            const draw = ctx.ops.find(op => op.op === 'drawImage');
            assert(draw, "el frame tintado se dibuja sobre el destino");
            assert(factory.canvases.length === 1, "un solo canvas auxiliar de tinte");
        }
    },
    {
        name: "batsheet/BatPlayer: sin atlas cargado → fallback al pixel-art (fillRect)",
        fn: () => {
            const factory = createCanvasFactory();
            // sheetImage presente pero NO cargado → fallback
            const player = new BatPlayer(100, 100, { sheetImage: { complete: false, naturalWidth: 0 }, createCanvas: factory.create });
            const ctx = createFakeContext();
            player.draw(ctx);

            const draws = ctx.ops.filter(op => op.op === 'drawImage');
            assert(draws.length === 0, "no debe haber drawImage del atlas");
            assert(ctx.ops.some(op => op.op === 'fillRect'), "el pixel-art dibuja con fillRect");
            assert(factory.canvases.length === 0, "el fallback no crea canvas auxiliares");
        }
    },
    {
        name: "batsheet/BatPlayer: invulnerabilidad parpadea (frames pares ocultan)",
        fn: () => {
            const factory = createCanvasFactory();
            const player = new BatPlayer(100, 100, { sheetImage: fakeLoadedImage(), createCanvas: factory.create });
            player.invincibilityTimer = 8; // floor(8/4)%2 === 0 → oculto

            const ctx = createFakeContext();
            player.draw(ctx);
            assert(ctx.ops.length === 0, "sin invulnerabilidad visible no dibuja nada");
        }
    }
];
