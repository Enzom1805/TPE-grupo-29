/**
 * ColliderSystem: punto de entrada único del sistema de colisiones de EchoBat.
 *
 * Responsabilidades:
 *   1. Despachar al par de funciones correcto según los tipos de las formas
 *      (el resto del juego NO sabe qué función de collide.js aplica).
 *   2. Broad-phase: si los AABB (`bounds`) de las formas no se solapan,
 *      se descarta sin ejecutar el test fino.
 *
 * Uso:
 *   import { ColliderSystem } from '.../collider/ColliderSystem.js';
 *   ColliderSystem.collides(shapeA, shapeB); // → boolean
 */

import {
    rectRect,
    circleCircle,
    circleRect,
    polygonCircle,
    polygonPolygon,
    rectPolygon
} from './collide.js';

/**
 * Los triángulos se resuelven con la maquinaria de polígonos convexos (SAT).
 * @param {{type: string}} shape
 */
function normalizeType(shape) {
    return shape.type === 'triangle' ? 'polygon' : shape.type;
}

/** Ranking para fijar orden canónico en pares asimétricos. */
const TYPE_RANK = { circle: 0, rect: 1, polygon: 2 };

/** Handlers de pares: clave `tipoA|tipoB` con orden canónico por TYPE_RANK. */
const PAIRS = {
    'circle|circle': (a, b) => circleCircle(a, b),
    'circle|rect': (a, b) => circleRect(a, b),
    'circle|polygon': (a, b) => polygonCircle(b.vertices, a),
    'rect|rect': (a, b) => rectRect(a, b),
    'rect|polygon': (a, b) => rectPolygon(a, b),
    'polygon|polygon': (a, b) => polygonPolygon(a, b)
};

function boundsOverlap(a, b) {
    return (
        a.bounds.minX <= b.bounds.maxX &&
        b.bounds.minX <= a.bounds.maxX &&
        a.bounds.minY <= b.bounds.maxY &&
        b.bounds.minY <= a.bounds.maxY
    );
}

export const ColliderSystem = {
    /**
     * ¿Colisionan estas dos formas?
     * @param {{type: string, bounds: object}} shapeA
     * @param {{type: string, bounds: object}} shapeB
     * @returns {boolean}
     */
    collides(shapeA, shapeB) {
        const typeA = normalizeType(shapeA);
        const typeB = normalizeType(shapeB);

        // Broad-phase: AABBs disjuntos → sin colisión garantizada.
        if (!boundsOverlap(shapeA, shapeB)) return false;

        const key = typeA === typeB
            ? `${typeA}|${typeA}`
            : (TYPE_RANK[typeA] <= TYPE_RANK[typeB] ? `${typeA}|${typeB}` : `${typeB}|${typeA}`);

        const handler = PAIRS[key];
        if (!handler) {
            console.error(`ColliderSystem: par de formas no soportado "${typeA}×${typeB}"`);
            return false;
        }

        // Los handlers esperan sus argumentos en orden canónico.
        const canonicalFirst = key.split('|')[0];
        return canonicalFirst === typeA ? handler(shapeA, shapeB) : handler(shapeB, shapeA);
    }
};
