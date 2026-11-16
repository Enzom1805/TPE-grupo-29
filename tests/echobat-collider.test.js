/**
 * Tests del ColliderSystem de EchoBat: cobertura de cada par de formas
 * y casos borde (tangencia, esquinas, rotaciones).
 */

import { assert } from "./assert.js";
import {
    createRect,
    createCircle,
    createTriangle,
    createPolygon
} from "../games/echobat/engine/collider/shapes.js";
import {
    rectRect,
    circleCircle,
    circleRect,
    polygonCircle,
    polygonPolygon,
    rectPolygon,
    triangleRect,
    circleTriangle,
    triangleTriangle,
    pointInPolygon,
    pointSegmentDistance
} from "../games/echobat/engine/collider/collide.js";
import { ColliderSystem } from "../games/echobat/engine/collider/ColliderSystem.js";

export default [
    {
        name: "collider/rectRect: AABB superpuestos → true",
        fn: () => {
            const a = createRect(0, 0, 20, 20);
            const b = createRect(10, 10, 20, 20);
            assert(rectRect(a, b) === true);
        }
    },
    {
        name: "collider/rectRect: AABB separados → false",
        fn: () => {
            const a = createRect(0, 0, 20, 20);
            const b = createRect(100, 100, 20, 20);
            assert(rectRect(a, b) === false);
        }
    },
    {
        name: "collider/rectRect: bordes que solo se tocan → false (convención original)",
        fn: () => {
            const a = createRect(0, 0, 20, 20);
            const b = createRect(20, 0, 20, 20); // tangente por la derecha
            assert(rectRect(a, b) === false);
        }
    },
    {
        name: "collider/circleCircle: solapados y tangentes → true",
        fn: () => {
            const a = createCircle(0, 0, 10);
            const b = createCircle(15, 0, 10); // distancia 15 < 20 → solapan
            const c = createCircle(20, 0, 10); // distancia 20 == 20 → tangentes
            assert(circleCircle(a, b) === true);
            assert(circleCircle(a, c) === true, "tangencia debe ser inclusiva");
        }
    },
    {
        name: "collider/circleCircle: separados → false",
        fn: () => {
            const a = createCircle(0, 0, 10);
            const b = createCircle(21, 0, 10);
            assert(circleCircle(a, b) === false);
        }
    },
    {
        name: "collider/circleRect: centro del círculo dentro del rect → true",
        fn: () => {
            const circle = createCircle(10, 10, 5);
            const rect = createRect(0, 0, 20, 20);
            assert(circleRect(circle, rect) === true);
        }
    },
    {
        name: "collider/circleRect: solapamiento por borde → true",
        fn: () => {
            const circle = createCircle(26, 10, 10); // borde derecho del rect en x=20
            const rect = createRect(0, 0, 20, 20);
            assert(circleRect(circle, rect) === true);
        }
    },
    {
        name: "collider/circleRect: esquina (caso clásico) → true solo si entra",
        fn: () => {
            const rect = createRect(0, 0, 20, 20);
            // Esquina en (20,20); círculo centrado en (25,25) radio 4: dist a esquina ≈ 7.07 > 4
            const outside = createCircle(25, 25, 4);
            assert(circleRect(outside, rect) === false, "no alcanza la esquina");
            // Radio 8: dist 7.07 <= 8 → colisión de esquina detectada
            const inside = createCircle(25, 25, 8);
            assert(circleRect(inside, rect) === true, "alcanza la esquina");
        }
    },
    {
        name: "collider/circleRect: lejos del rect → false",
        fn: () => {
            const circle = createCircle(100, 100, 5);
            const rect = createRect(0, 0, 20, 20);
            assert(circleRect(circle, rect) === false);
        }
    },
    {
        name: "collider/pointInPolygon: dentro, fuera y en el borde de un triángulo",
        fn: () => {
            const tri = [{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 10, y: 20 }];
            assert(pointInPolygon(10, 5, tri) === true, "dentro");
            assert(pointInPolygon(19, 15, tri) === false, "fuera");
            assert(pointInPolygon(10, 0, tri) === true, "sobre el borde cuenta como dentro");
        }
    },
    {
        name: "collider/polygonCircle: centro dentro del polígono → true",
        fn: () => {
            const tri = createTriangle(0, 0, 40, 0, 20, 40);
            const circle = createCircle(20, 10, 2);
            assert(polygonCircle(tri.vertices, circle) === true);
        }
    },
    {
        name: "collider/polygonCircle: borde a distancia <= radio → true",
        fn: () => {
            const tri = createTriangle(0, 0, 40, 0, 20, 40);
            const circle = createCircle(20, 45, 10); // centro fuera, pero radio 10 alcanza el borde inferior
            assert(polygonCircle(tri.vertices, circle) === true);
        }
    },
    {
        name: "collider/polygonCircle: sin contacto → false",
        fn: () => {
            const tri = createTriangle(0, 0, 40, 0, 20, 40);
            const circle = createCircle(100, 100, 5);
            assert(polygonCircle(tri.vertices, circle) === false);
        }
    },
    {
        name: "collider/polygonPolygon (SAT): cuadrados solapados y separados",
        fn: () => {
            const a = createPolygon([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }]);
            const b = createPolygon([{ x: 5, y: 5 }, { x: 15, y: 5 }, { x: 15, y: 15 }, { x: 5, y: 15 }]);
            const c = createPolygon([{ x: 50, y: 50 }, { x: 60, y: 50 }, { x: 60, y: 60 }, { x: 50, y: 60 }]);
            assert(polygonPolygon(a, b) === true);
            assert(polygonPolygon(a, c) === false);
        }
    },
    {
        name: "collider/polygonPolygon (SAT): triángulo rotado vs cuadrado",
        fn: () => {
            const tri = createTriangle(12, 0, 24, 12, 12, 24); // rombo (triángulo en coords)
            const square = createPolygon([{ x: 10, y: 10 }, { x: 30, y: 10 }, { x: 30, y: 30 }, { x: 10, y: 30 }]);
            assert(polygonPolygon(tri, square) === true);
        }
    },
    {
        name: "collider/triangleRect: triángulo vs rectángulo en ambos órdenes",
        fn: () => {
            const tri = createTriangle(15, 5, 30, 15, 15, 25);
            const rect = createRect(0, 10, 20, 20);
            assert(triangleRect(tri, rect) === true);
            assert(rectPolygon(rect, tri) === true, "orden inverso");
            const triFar = createTriangle(100, 100, 130, 115, 100, 130);
            assert(triangleRect(triFar, rect) === false);
        }
    },
    {
        name: "collider/triangleTriangle: dos triángulos entrelazados y separados",
        fn: () => {
            const a = createTriangle(0, 0, 20, 0, 10, 20);
            const b = createTriangle(5, 5, 25, 5, 15, 25);
            const c = createTriangle(100, 0, 120, 0, 110, 20);
            assert(triangleTriangle(a, b) === true);
            assert(triangleTriangle(a, c) === false);
        }
    },
    {
        name: "collider/circleTriangle: círculo vs triángulo",
        fn: () => {
            const tri = createTriangle(0, 0, 40, 0, 20, 40);
            assert(circleTriangle(createCircle(20, 10, 3), tri) === true);
            assert(circleTriangle(createCircle(20, 100, 3), tri) === false);
        }
    },
    {
        name: "collider/pointSegmentDistance: proyección dentro y fuera del segmento",
        fn: () => {
            const d1 = pointSegmentDistance(10, 5, 0, 0, 20, 0); // perpendicular
            assert(Math.abs(d1 - 5) < 1e-9, "distancia perpendicular = 5");
            const d2 = pointSegmentDistance(-5, 0, 0, 0, 20, 0); // proyección fuera → clamp al extremo
            assert(Math.abs(d2 - 5) < 1e-9, "clamp al extremo del segmento");
        }
    },
    {
        name: "ColliderSystem: despacha circle×rect en ambos órdenes",
        fn: () => {
            const circle = createCircle(26, 10, 10);
            const rect = createRect(0, 0, 20, 20);
            assert(ColliderSystem.collides(circle, rect) === true);
            assert(ColliderSystem.collides(rect, circle) === true, "orden inverso");
        }
    },
    {
        name: "ColliderSystem: despacha circle×triángulo y rect×triángulo",
        fn: () => {
            const tri = createTriangle(0, 0, 40, 0, 20, 40);
            assert(ColliderSystem.collides(createCircle(20, 10, 3), tri) === true);
            assert(ColliderSystem.collides(createRect(0, 10, 20, 20), tri) === true);
            assert(ColliderSystem.collides(tri, createRect(100, 100, 20, 20)) === false);
        }
    },
    {
        name: "ColliderSystem: broad-phase descarta por AABB sin test fino",
        fn: () => {
            const a = createCircle(0, 0, 10);
            const b = createCircle(500, 500, 10);
            assert(ColliderSystem.collides(a, b) === false);
        }
    },
    {
        name: "ColliderSystem: par no soportado devuelve false sin romper",
        fn: () => {
            const fake = { type: 'hexagon', bounds: { minX: 0, minY: 0, maxX: 10, maxY: 10 } };
            const rect = createRect(0, 0, 20, 20);
            assert(ColliderSystem.collides(fake, rect) === false);
        }
    }
];
