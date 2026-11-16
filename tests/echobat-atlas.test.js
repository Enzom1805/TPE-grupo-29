/**
 * Tests del spritesheet procedural (requisito: 2 elementos animados DIFERENTES
 * con spritesheet) y del espaciado horizontal aleatorio entre pilares (6a).
 *
 * Se usa un canvas falso grabador: los tests no dependen del DOM y corren
 * tanto en el runner de navegador como en Node.
 */

import { assert, assertEquals } from "./assert.js";
import {
    createSpriteAtlas,
    createMothAtlas,
    createSpiderAtlas
} from "../games/echobat/engine/spritesheets/atlas.js";
import { MothEntity } from "../games/echobat/engine/entities/MothEntity.js";
import { SpiderEntity } from "../games/echobat/engine/entities/SpiderEntity.js";
import { MathUtils } from "../games/echobat/engine/MathUtils.js";
import { ECHOBAT_CONFIG } from "../games/echobat/data/config.js";

/** Contexto 2D falso que registra las operaciones de dibujo relevantes. */
function createFakeContext() {
    const ops = [];
    return {
        ops,
        fillStyle: null,
        shadowColor: null,
        shadowBlur: null,
        globalAlpha: 1,
        save() { ops.push({ op: 'save' }); },
        restore() { ops.push({ op: 'restore' }); },
        translate(x, y) { ops.push({ op: 'translate', x, y }); },
        fillRect(x, y, w, h) { ops.push({ op: 'fillRect', x, y, w, h }); },
        drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh) {
            ops.push({ op: 'drawImage', sx, sy, sw, sh, dx, dy, dw, dh });
        },
        beginPath() {}, moveTo() {}, lineTo() {}, stroke() {},
        arc() {}, closePath() {}, fill() {},
        createRadialGradient() { return { addColorStop() {} }; }
    };
}

function createFakeCanvasFactory() {
    const canvases = [];
    return {
        canvases,
        create() {
            const ctx = createFakeContext();
            const canvas = {
                width: 0,
                height: 0,
                getContext: () => ctx
            };
            canvases.push(canvas);
            return canvas;
        }
    };
}

export default [
    {
        name: "spritesheet/createSpriteAtlas: dimensiones del atlas = celdas × frames",
        fn: () => {
            const factory = createFakeCanvasFactory();
            const atlas = createSpriteAtlas({
                cellWidth: 26, cellHeight: 22,
                frames: [() => {}, () => {}, () => {}, () => {}]
            }, factory.create);
            assertEquals(atlas.canvas.width, 104);
            assertEquals(atlas.canvas.height, 22);
            assertEquals(atlas.frameCount, 4);
        }
    },
    {
        name: "spritesheet/createSpriteAtlas: rechaza specs sin frames",
        fn: () => {
            let threw = false;
            try {
                createSpriteAtlas({ cellWidth: 10, cellHeight: 10, frames: [] }, createFakeCanvasFactory().create);
            } catch (err) {
                threw = true;
            }
            assert(threw === true);
        }
    },
    {
        name: "spritesheet/moth: 4 frames de aleteo con alas simétricas en fase 0",
        fn: () => {
            const factory = createFakeCanvasFactory();
            const atlas = createMothAtlas(factory.create);
            assertEquals(atlas.frameCount, 4);
            assertEquals(atlas.cellWidth, 26);
            assertEquals(atlas.cellHeight, 22);
            // Frame 0 (wingOffset 0): cuerpo en (10,6) y alas en (4,4) y (16,4)
            const ctx = factory.canvases[0].getContext();
            const rects = ctx.ops.filter(op => op.op === 'fillRect');
            assert(rects.some(r => r.x === 10 && r.y === 6 && r.w === 6 && r.h === 10), "cuerpo");
            assert(rects.some(r => r.x === 4 && r.y === 4), "ala izquierda");
            assert(rects.some(r => r.x === 16 && r.y === 4), "ala derecha");
        }
    },
    {
        name: "spritesheet/spider: 4 frames con squash & stretch del cuerpo",
        fn: () => {
            const factory = createFakeCanvasFactory();
            const atlas = createSpiderAtlas(factory.create);
            assertEquals(atlas.frameCount, 4);
            assertEquals(atlas.canvas.width, 28 * 4);
            // Frame 0: cuerpo 12×12 en (8,8); frame 1: aplastado 11px en (8,9)
            const ctx = factory.canvases[0].getContext();
            const rects = ctx.ops.filter(op => op.op === 'fillRect');
            assert(rects.some(r => r.x === 8 && r.y === 8 && r.h === 12), "frame neutro");
            assert(rects.some(r => r.x === 8 && r.y === 9 && r.h === 11), "frame aplastado");
        }
    },
    {
        name: "spritesheet/drawFrame: recorta la celda correcta según el frame",
        fn: () => {
            const factory = createFakeCanvasFactory();
            const atlas = createMothAtlas(factory.create);
            const target = createFakeContext();

            atlas.drawFrame(target, 0, 100, 50);
            const draw0 = target.ops.find(op => op.op === 'drawImage');
            assertEquals(draw0.sx, 0);
            assertEquals(draw0.dx, 100);
            assertEquals(draw0.dy, 50);

            atlas.drawFrame(target, 2, 0, 0);
            const draw2 = target.ops.filter(op => op.op === 'drawImage')[1];
            assertEquals(draw2.sx, 2 * 26, "frame 2 → sx = 2×cellWidth");
        }
    },
    {
        name: "spritesheet/drawFrame: normaliza índices negativos y fuera de rango",
        fn: () => {
            const factory = createFakeCanvasFactory();
            const atlas = createMothAtlas(factory.create);
            const target = createFakeContext();

            atlas.drawFrame(target, -1, 0, 0);   // -1 → último frame (3)
            atlas.drawFrame(target, 4, 0, 0);    // 4 → primer frame (0)
            atlas.drawFrame(target, 9, 0, 0);    // 9 % 4 → frame 1

            const draws = target.ops.filter(op => op.op === 'drawImage');
            assertEquals(draws[0].sx, 3 * 26);
            assertEquals(draws[1].sx, 0);
            assertEquals(draws[2].sx, 26);
        }
    },
    {
        name: "spritesheet/MothEntity: dibuja vía atlas inyectado (DIP)",
        fn: () => {
            const calls = [];
            const fakeAtlas = {
                frameCount: 4,
                drawFrame(ctx, frameIndex, x, y) { calls.push({ frameIndex, x, y }); }
            };
            const moth = new MothEntity(100, 200, fakeAtlas);
            moth.revealedTimer = 180; // revelada → visible
            moth.draw(createFakeContext());
            assert(calls.length === 1);
            assert(calls[0].x === 100 - 2, "destino con padding del atlas");
            assert(calls[0].y === 200);
        }
    },
    {
        name: "spritesheet/SpiderEntity: dibuja cuerpo vía atlas + hilo dinámico",
        fn: () => {
            const calls = [];
            const fakeAtlas = {
                frameCount: 4,
                drawFrame(ctx, frameIndex, x, y) { calls.push({ frameIndex, x, y }); }
            };
            const spider = new SpiderEntity(100, 200, fakeAtlas);
            spider.draw(createFakeContext());
            assert(calls.length === 1);
            assert(calls[0].x === 100 - 2 && calls[0].y === 200 - 2);
        }
    },
    {
        name: "spritesheet/frames: el frame actual queda acotado al ciclo (0..3)",
        fn: () => {
            const moth = new MothEntity(0, 0);
            moth.hoverOffset = Math.PI / 2; // fase 3 del ciclo de alas
            assertEquals(moth.currentFrame() % 4, 3);
            const spider = new SpiderEntity(0, 0);
            spider.swingOffset = Math.PI; // fase 2
            assertEquals(spider.currentFrame() % 4, 2);
        }
    },

    // ---------------- Espaciado aleatorio entre pilares (requisito 6a) ----------------
    {
        name: "spawn/espaciado: configuración válida (min < max, ambos positivos)",
        fn: () => {
            const { spacingMin, spacingMax } = ECHOBAT_CONFIG.spawn;
            assert(spacingMin > 0);
            assert(spacingMax > spacingMin);
        }
    },
    {
        name: "spawn/espaciado: los valores generados caen dentro del rango",
        fn: () => {
            const { spacingMin, spacingMax } = ECHOBAT_CONFIG.spawn;
            for (let i = 0; i < 1000; i++) {
                const s = MathUtils.randomRange(spacingMin, spacingMax);
                assert(s >= spacingMin && s <= spacingMax, `espaciado fuera de rango: ${s}`);
            }
        }
    },
    {
        name: "spawn/espaciado: la distancia NO es constante (varía entre spawns)",
        fn: () => {
            const { spacingMin, spacingMax } = ECHOBAT_CONFIG.spawn;
            const samples = new Set();
            for (let i = 0; i < 200; i++) {
                // Cuantizado como px de pilar (frames de 3.2px)
                samples.add(Math.round(MathUtils.randomRange(spacingMin, spacingMax) / 4));
            }
            assert(samples.size > 5, "debe haber variabilidad real, no un valor fijo");
        }
    }
];
