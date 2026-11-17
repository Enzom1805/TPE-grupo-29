/**
 * Tests de la habilidad DASH (→ / D):
 *  - física de la ráfaga (empuje, gravedad reducida, clamping, regreso a base),
 *  - pose dedicada del atlas y tintes cian,
 *  - estelas fantasma (cache de siluetas + desvanecimiento),
 *  - input (KeyD / ArrowRight) y configuración.
 */

import { assert, assertEquals } from "./assert.js";
import { ECHOBAT_CONFIG } from "../games/echobat/data/config.js";
import { BAT_SHEET_SPEC } from "../games/echobat/data/bat-sheet.js";
import { BatPlayer } from "../games/echobat/engine/BatPlayer.js";
import { InputHandler } from "../games/echobat/controller/InputHandler.js";

function fakeLoadedImage() {
    return { complete: true, naturalWidth: BAT_SHEET_SPEC.cellWidth * BAT_SHEET_SPEC.frameCount, naturalHeight: BAT_SHEET_SPEC.cellHeight };
}

function createFakeContext() {
    const ops = [];
    return {
        ops,
        fillStyle: null,
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        save() { ops.push({ op: 'save' }); },
        restore() { ops.push({ op: 'restore' }); },
        translate() {}, rotate() {},
        drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh) {
            ops.push({ op: 'drawImage', source: img, sx, sy, sw, sh, dx, dy, dw, dh });
        },
        fillRect(x, y, w, h) { ops.push({ op: 'fillRect', x, y, w, h }); },
        clearRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, closePath() {},
        fill() {}, arc() {}, stroke() {},
        createRadialGradient() { return { addColorStop() {} }; }
    };
}

function createCanvasFactory() {
    const canvases = [];
    return {
        canvases,
        create() {
            // Contexto único por canvas: permite inspeccionar las ops internas
            // (ej: qué celda del atlas se copió al canvas de tinte)
            const ctx = createFakeContext();
            const canvas = { width: 0, height: 0, getContext: () => ctx };
            canvases.push(canvas);
            return canvas;
        }
    };
}

function fakeKey(code, { repeat = false } = {}) {
    return { code, repeat, preventDefault() { this.prevented = true; } };
}

function createPlayer() {
    const factory = createCanvasFactory();
    const player = new BatPlayer(ECHOBAT_CONFIG.player.x, 200, {
        sheetImage: fakeLoadedImage(),
        createCanvas: factory.create
    });
    return { player, factory };
}

export default [
    // ---------------- Configuración ----------------
    {
        name: "dash/config: 1 carga cada 5 pilares, tope 2, ráfaga positiva",
        fn: () => {
            const d = ECHOBAT_CONFIG.dash;
            assertEquals(d.pillarsPerCharge, 5);
            assertEquals(d.maxCharges, 2);
            assert(d.dashFrames > 0);
            assert(d.playerPush > 0);
            assert(d.worldSpeedMult > 1, "el mundo acelera durante el dash");
            assert(d.gravityFactor > 0 && d.gravityFactor < 1, "gravedad reducida, no anulada");
            assert(d.maxX > ECHOBAT_CONFIG.player.x, "el dash empuja hacia adelante");
        }
    },
    {
        name: "dash/spec: el atlas expone la pose dedicada (índice 3)",
        fn: () => {
            assertEquals(BAT_SHEET_SPEC.frameCount, 4);
            assertEquals(BAT_SHEET_SPEC.dashFrame, 3);
            // La pose de dash NO forma parte del ciclo de aleteo normal
            assert(!BAT_SHEET_SPEC.cycle.includes(BAT_SHEET_SPEC.dashFrame),
                "el ciclo ping-pong no debe usar la pose de dash");
        }
    },

    // ---------------- Física de la ráfaga ----------------
    {
        name: "dash/BatPlayer: triggerDash activa la ráfaga por dashFrames",
        fn: () => {
            const { player } = createPlayer();
            player.triggerDash();
            assert(player.isDashing === true);
            assertEquals(player.dashTimer, ECHOBAT_CONFIG.dash.dashFrames);
        }
    },
    {
        name: "dash/BatPlayer: durante el dash avanza hacia adelante",
        fn: () => {
            const { player } = createPlayer();
            const startX = player.pos.x;
            player.triggerDash();
            player.update(450, 1);
            assert(player.pos.x > startX, "el murciélago se desplaza a la derecha");
        }
    },
    {
        name: "dash/BatPlayer: la gravedad reducida hace caer MÁS LENTO que el vuelo normal",
        fn: () => {
            const normal = createPlayer().player;
            const dashing = createPlayer().player;
            normal.velocity = 0; dashing.velocity = 0;
            for (let i = 0; i < 10; i++) {
                normal.update(450, 1);
                dashing.triggerDash(); // mantiene el estado de dash en cada frame
                dashing.update(450, 1);
            }
            assert(dashing.pos.y < normal.pos.y,
                "con gravedad reducida cae menos: " + dashing.pos.y + " vs " + normal.pos.y);
        }
    },
    {
        name: "dash/BatPlayer: el avance se clampa en maxX (no invade el spawn)",
        fn: () => {
            const { player } = createPlayer();
            player.pos.x = ECHOBAT_CONFIG.dash.maxX - 2;
            player.triggerDash();
            for (let i = 0; i < 10; i++) {
                player.update(450, 1);
            }
            assert(player.pos.x <= ECHOBAT_CONFIG.dash.maxX,
                "x no supera maxX: " + player.pos.x);
        }
    },
    {
        name: "dash/BatPlayer: al terminar vuelve suavemente a la posición base",
        fn: () => {
            const { player } = createPlayer();
            player.triggerDash();
            for (let i = 0; i < ECHOBAT_CONFIG.dash.dashFrames + 10; i++) {
                player.update(450, 1);
            }
            assert(player.isDashing === false, "la ráfaga termina");
            assert(player.pos.x > ECHOBAT_CONFIG.player.x, "aún regresando (suave, no teleport)");
            // ...y si seguimos simulando, termina exactamente en la base
            for (let i = 0; i < 200; i++) player.update(450, 1);
            assertEquals(player.pos.x, ECHOBAT_CONFIG.player.x);
        }
    },
    {
        name: "dash/BatPlayer: la rotación se endereza durante el dash",
        fn: () => {
            const { player } = createPlayer();
            player.rotation = 0.5; // cayendo en picado
            player.triggerDash();
            for (let i = 0; i < 10; i++) {
                player.triggerDash();
                player.update(450, 1);
            }
            assert(player.rotation < 0.5, "la inclinación tiende a enderezarse");
        }
    },

    // ---------------- Render: pose + estelas ----------------
    {
        name: "dash/BatPlayer: durante el dash usa la pose dedicada del atlas",
        fn: () => {
            const { player, factory } = createPlayer();
            player.triggerDash();
            const ctx = createFakeContext();
            player.draw(ctx);

            // Con tinte activo, el frame se compone vía canvas auxiliar:
            // el canvas de tinte debe haber copiado la celda de la pose de dash.
            const tintCanvas = factory.canvases[0];
            assert(tintCanvas, "se creó el canvas de tinte");
            assertEquals(tintCanvas.width, BAT_SHEET_SPEC.cellWidth);
            const innerDraw = tintCanvas.getContext().ops.find(op => op.op === 'drawImage');
            assert(innerDraw, "el tinte copia el frame del atlas");
            assertEquals(innerDraw.sx, BAT_SHEET_SPEC.dashFrame * BAT_SHEET_SPEC.cellWidth,
                "sx apunta a la celda de la pose de dash");

            // Y el destino recibe el canvas tintado (no la imagen directa)
            const finalDraw = ctx.ops.find(op => op.op === 'drawImage');
            assert(finalDraw && finalDraw.source !== player.sheetImage,
                "el frame tintado se blitea desde el canvas auxiliar");
        }
    },
    {
        name: "dash/BatPlayer: sin dash usa el ciclo ping-pong (no la pose 3)",
        fn: () => {
            const { player } = createPlayer();
            player.animFrame = 0;
            const ctx = createFakeContext();
            player.draw(ctx);
            const draw = ctx.ops.find(op => op.op === 'drawImage');
            assertEquals(draw.sx, 0);
        }
    },
    {
        name: "dash/estelas: las siluetas se cachean (una por pose, creadas una vez)",
        fn: () => {
            const { player, factory } = createPlayer();
            const ghosts1 = player._getGhostCanvases();
            const ghosts2 = player._getGhostCanvases();
            assertEquals(ghosts1.length, BAT_SHEET_SPEC.frameCount);
            assertEquals(ghosts1, ghosts2, "misma instancia (cacheada)");
            assertEquals(factory.canvases.length, BAT_SHEET_SPEC.frameCount);
        }
    },
    {
        name: "dash/estelas: drawGhost pinta la silueta con alpha acotada",
        fn: () => {
            const { player } = createPlayer();
            const ghost = { frameIdx: 3, x: 100, y: 100, rotation: 0.1, life: 3, maxLife: 6 };
            const ctx = createFakeContext();
            player.drawGhost(ctx, ghost);
            const draw = ctx.ops.find(op => op.op === 'drawImage');
            assert(draw, "la estela se dibuja");
            assert(ctx.ops.some(op => op.op === 'save'), "usa save/restore (alpha aislada)");
        }
    },
    {
        name: "dash/estelas: sin atlas cargado drawGhost es inofensivo",
        fn: () => {
            const factory = createCanvasFactory();
            const player = new BatPlayer(100, 100, {
                sheetImage: { complete: false, naturalWidth: 0 },
                createCanvas: factory.create
            });
            const ctx = createFakeContext();
            player.drawGhost(ctx, { frameIdx: 0, x: 0, y: 0, rotation: 0, life: 3, maxLife: 6 });
            assertEquals(ctx.ops.filter(op => op.op === 'drawImage').length, 0);
            assertEquals(factory.canvases.length, 0, "no crea canvas sin imagen");
        }
    },

    // ---------------- Input ----------------
    {
        name: "dash/input: KeyD y ArrowRight activan el flag de dash",
        fn: () => {
            const input = new InputHandler();
            input._handleKeyDown(fakeKey('KeyD'));
            assertEquals(input.keys.dash, true);
            input.keys.dash = false;
            input._handleKeyDown(fakeKey('ArrowRight'));
            assertEquals(input.keys.dash, true);
        }
    },
    {
        name: "dash/input: la flecha derecha hace preventDefault (no scrollea la página)",
        fn: () => {
            const input = new InputHandler();
            const ev = fakeKey('ArrowRight');
            input._handleKeyDown(ev);
            assert(ev.prevented === true);
        }
    },
    {
        name: "dash/input: key repeat no re-activa el dash",
        fn: () => {
            const input = new InputHandler();
            input._handleKeyDown(fakeKey('KeyD', { repeat: true }));
            assertEquals(input.keys.dash, false);
        }
    }
];
