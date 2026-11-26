/**
 * Tests del engine de EchoBat: física del murciélago, pilares con colliders
 * de trapecio, parallax, entidades dinámicas y curva de dificultad.
 */

import { assert, assertEquals } from "./assert.js";
import { BatPlayer } from "../games/echobat/engine/BatPlayer.js";
import { CavePillar } from "../games/echobat/engine/CavePillar.js";
import { ParallaxBackground } from "../games/echobat/engine/ParallaxBackground.js";
import { PARALLAX_LAYER_URLS } from "../games/echobat/data/parallax-layers.js";
import { MothEntity } from "../games/echobat/engine/entities/MothEntity.js";
import { SpiderEntity } from "../games/echobat/engine/entities/SpiderEntity.js";
import { ColliderSystem } from "../games/echobat/engine/collider/ColliderSystem.js";
import { createCircle } from "../games/echobat/engine/collider/shapes.js";
import { ECHOBAT_CONFIG, gapHeightForScore } from "../games/echobat/data/config.js";

const CANVAS_H = ECHOBAT_CONFIG.height;

export default [
    // ---------------- BatPlayer: física ----------------
    {
        name: "engine/BatPlayer: flap imparte impulso negativo (hacia arriba)",
        fn: () => {
            const bat = new BatPlayer(120, 200);
            bat.flap();
            assert(bat.velocity === ECHOBAT_CONFIG.player.jumpStrength, "velocidad = jumpStrength");
            assert(bat.velocity < 0);
        }
    },
    {
        name: "engine/BatPlayer: la gravedad acelera la caída",
        fn: () => {
            const bat = new BatPlayer(120, 100);
            bat.update(CANVAS_H, 1);
            const v1 = bat.velocity;
            bat.update(CANVAS_H, 1);
            assert(bat.velocity > v1, "la velocidad aumenta cada frame");
        }
    },
    {
        name: "engine/BatPlayer: velocidad de caída limitada por maxFallSpeed",
        fn: () => {
            const bat = new BatPlayer(120, 0);
            for (let i = 0; i < 1000; i++) bat.update(CANVAS_H, 1);
            assert(bat.velocity <= ECHOBAT_CONFIG.player.maxFallSpeed + 1e-9);
        }
    },
    {
        name: "engine/BatPlayer: clamp contra el suelo del canvas",
        fn: () => {
            const bat = new BatPlayer(120, CANVAS_H - 10);
            for (let i = 0; i < 200; i++) bat.update(CANVAS_H, 1);
            assert(bat.pos.y + bat.height <= CANVAS_H, "no atraviesa el suelo");
        }
    },
    {
        name: "engine/BatPlayer: clamp contra el techo del canvas",
        fn: () => {
            const bat = new BatPlayer(120, 5);
            bat.flap();
            for (let i = 0; i < 100; i++) bat.update(CANVAS_H, 1);
            assert(bat.pos.y >= 0, "no atraviesa el techo");
        }
    },
    {
        name: "engine/BatPlayer: timer de golpe se agota y desactiva isHit",
        fn: () => {
            const bat = new BatPlayer(120, 200);
            bat.triggerHitAnimation();
            assert(bat.isHit === true);
            for (let i = 0; i < 50; i++) bat.update(CANVAS_H, 1);
            assert(bat.isHit === false);
        }
    },
    {
        name: "engine/BatPlayer: la invulnerabilidad decae hasta cero y no es negativa",
        fn: () => {
            const bat = new BatPlayer(120, 200);
            bat.invincibilityTimer = ECHOBAT_CONFIG.player.invincibilityFrames;
            for (let i = 0; i < 200; i++) bat.update(CANVAS_H, 1);
            assert(bat.invincibilityTimer === 0);
        }
    },
    {
        name: "engine/BatPlayer: hitbox circular dentro de los bounds de la entidad",
        fn: () => {
            const bat = new BatPlayer(120, 200);
            const collider = bat.getCollider();
            assert(collider.type === 'circle');
            const bounds = bat.getBounds();
            assert(collider.x >= bounds.x && collider.x <= bounds.x + bounds.width);
            assert(collider.y >= bounds.y && collider.y <= bounds.y + bounds.height);
            // Debe ser más perdonadora que el AABB completo (diagonal)
            assert(collider.radius * 2 < Math.min(bounds.width, bounds.height) + 2);
        }
    },

    // ---------------- CavePillar ----------------
    {
        name: "engine/CavePillar: el hueco mide exactamente currentGapHeight",
        fn: () => {
            const pillar = new CavePillar(800, CANVAS_H, 140);
            assertEquals(pillar.bottomY - pillar.topHeight, 140);
        }
    },
    {
        name: "engine/CavePillar: expone 2 colliders poligonales (trapecios de 4 vértices)",
        fn: () => {
            const pillar = new CavePillar(800, CANVAS_H, 140);
            const colliders = pillar.getColliders();
            assert(colliders.length === 2);
            colliders.forEach(shape => {
                assert(shape.type === 'polygon');
                assertEquals(shape.vertices.length, 4);
            });
        }
    },
    {
        name: "engine/CavePillar: círculo en el CENTRO del hueco NO colisiona",
        fn: () => {
            const pillar = new CavePillar(400, CANVAS_H, 140);
            const gapCenterY = pillar.topHeight + 70;
            const safeCircle = createCircle(pillar.x + 33, gapCenterY, ECHOBAT_CONFIG.player.colliderRadius);
            const colliders = pillar.getColliders();
            assert(ColliderSystem.collides(safeCircle, colliders[0]) === false, "sin tocar estalactita");
            assert(ColliderSystem.collides(safeCircle, colliders[1]) === false, "sin tocar estalagmita");
        }
    },
    {
        name: "engine/CavePillar: círculo DENTRO de la estalactita SÍ colisiona",
        fn: () => {
            const pillar = new CavePillar(400, CANVAS_H, 140);
            const insideCircle = createCircle(pillar.x + 33, 20, ECHOBAT_CONFIG.player.colliderRadius);
            assert(ColliderSystem.collides(insideCircle, pillar.getColliders()[0]) === true);
        }
    },
    {
        name: "engine/CavePillar: la punta afinada del trapecio es más justa que el AABB viejo",
        fn: () => {
            // Un círculo al costado de la punta (donde el dibujo ya se afina)
            // NO debe colisionar, aunque el AABB original de 68px sí lo haría.
            const pillar = new CavePillar(400, CANVAS_H, 140);
            const tipY = pillar.topHeight - 6;
            const besideTip = createCircle(pillar.x + 2, tipY, 8); // casi pegado al borde izquierdo
            const colliders = pillar.getColliders();
            const anyCollision = colliders.some(shape => ColliderSystem.collides(besideTip, shape));
            assert(anyCollision === false, "la zona afinada de la punta no colisiona");
        }
    },

    // ---------------- ParallaxBackground ----------------
    {
        name: "engine/ParallaxBackground: 4 capas con offsets proporcionales a worldSpeed",
        fn: () => {
            const bg = new ParallaxBackground(800, 450);
            bg.update(10, 1);
            const expected = [0.5, 1, 1.6, 2.4];
            assertEquals(bg.layers.length, 4);
            bg.layers.forEach((layer, index) => {
                assert(Math.abs(layer.offsetX - expected[index]) < 1e-9,
                    `capa ${index}: offset ${layer.offsetX} ≈ ${expected[index]}`);
            });
        }
    },
    {
        name: "engine/ParallaxBackground: offset envuelve con el ancho del tile espejado",
        fn: () => {
            const bg = new ParallaxBackground(100, 450);
            bg.update(1000, 1);
            assertEquals(bg.tileWidth, 200);
            bg.layers.forEach(layer => {
                assert(layer.offsetX >= 0 && layer.offsetX < bg.tileWidth,
                    `offset ${layer.offsetX} dentro de [0, ${bg.tileWidth})`);
            });
        }
    },
    {
        name: "engine/ParallaxBackground: 4 capas de imagen (7 fuentes pre-compuestas)",
        fn: () => {
            assertEquals(PARALLAX_LAYER_URLS.length, 4);
            const bg = new ParallaxBackground(800, 450);
            assertEquals(bg.layers.length, 4);
            assertEquals(bg.layers.map(l => l.speedRatio), [0.05, 0.10, 0.16, 0.24]);
        }
    },
    {
        name: "engine/ParallaxBackground: draw sin imágenes usa fallback y no rompe",
        fn: () => {
            const calls = [];
            const ctx = {
                fillStyle: '',
                fillRect: (...args) => calls.push(args),
                save() {},
                restore() {},
                drawImage() { throw new Error('no debería dibujar imágenes sin cargar'); }
            };
            const bg = new ParallaxBackground(800, 450, { dim: 0 });
            bg.draw(ctx);
            assertEquals(calls.length, 1, "dibuja el fallback una vez");
            assertEquals(calls[0], [0, 0, 800, 450]);
        }
    },
    {
        name: "engine/ParallaxBackground: dibuja normal + espejo solo cuando se ven",
        fn: () => {
            const draws = [];
            const ctx = {
                save() {},
                restore() {},
                translate() {},
                scale() {},
                drawImage: (...args) => draws.push(args)
            };
            const bg = new ParallaxBackground(800, 450, { dim: 0 });
            bg._images = [{}, {}, {}, {}];
            bg._loaded = true;

            bg.layers.forEach(layer => { layer.offsetX = 0; });
            bg.draw(ctx);
            assertEquals(draws.length, 4, "offset 0: solo la copia normal de cada capa");

            draws.length = 0;
            bg.layers.forEach(layer => { layer.offsetX = 400; });
            bg.draw(ctx);
            assertEquals(draws.length, 8, "offset 400: normal + espejo de cada capa");

            draws.length = 0;
            bg.layers.forEach(layer => { layer.offsetX = 1200; });
            bg.draw(ctx);
            assertEquals(draws.length, 8, "offset 1200: espejo del tile 0 + normal del tile 1");
        }
    },

    // ---------------- Entidades dinámicas ----------------
    {
        name: "engine/MothEntity: avanza, oscila y se marca fuera de pantalla",
        fn: () => {
            const moth = new MothEntity(100, 200);
            moth.update(3, 1);
            assert(moth.pos.x < 100, "se mueve hacia la izquierda");
            assert(moth.pos.y !== 200, "oscila verticalmente");
            moth.pos.x = -100;
            moth.update(3, 1);
            assert(moth.markedForDeletion === true);
        }
    },
    {
        name: "engine/MothEntity: reveal decae y su collider es circular",
        fn: () => {
            const moth = new MothEntity(100, 200);
            moth.reveal();
            assert(moth.revealedTimer > 0);
            moth.update(3, 1);
            assert(moth.revealedTimer < 180);
            assert(moth.getCollider().type === 'circle');
        }
    },
    {
        name: "engine/SpiderEntity: péndulo alrededor de initialY",
        fn: () => {
            const spider = new SpiderEntity(100, 200);
            spider.swingOffset = 0;
            spider.update(3, 1);
            assert(spider.pos.y > 200, "baja del punto inicial");
            spider.swingOffset = Math.PI;
            spider.update(3, 1);
            assert(spider.pos.y < 200, "sube en la otra mitad del vaivén");
        }
    },
    {
        name: "engine/SpiderEntity: collider circular de 12px de radio",
        fn: () => {
            const spider = new SpiderEntity(100, 200);
            const collider = spider.getCollider();
            assertEquals(collider.radius, 12);
            assertEquals(collider.x, spider.pos.x + 12);
        }
    },

    // ---------------- Dificultad (curva del hueco) ----------------
    {
        name: "engine/dificultad: hueco inicial 160px y nunca bajo 105px",
        fn: () => {
            assertEquals(gapHeightForScore(0), 160);
            assertEquals(gapHeightForScore(60), 154);
            assertEquals(gapHeightForScore(600), 105, "techo de dificultad");
            assertEquals(gapHeightForScore(999999), 105);
        }
    },
    {
        name: "engine/dificultad: score de pilar (10) no reduce el hueco antes de tiempo",
        fn: () => {
            assertEquals(gapHeightForScore(50), 160);
            assertEquals(gapHeightForScore(59), 160);
        }
    }
];
