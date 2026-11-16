/**
 * Fábricas de formas geométricas del ColliderSystem.
 *
 * Toda forma es un objeto de datos plano con:
 *   - `type`: 'rect' | 'circle' | 'polygon' | 'triangle'
 *   - `bounds`: AABB { minX, minY, maxX, maxY } calculado al crear (broad-phase).
 *
 * Las formas NO se mutan: las entidades crean su forma nueva por frame
 * (allocation trivial: ~10 formas/frame) y el collider trabaja con datos puros.
 */

function boundsFromPoints(points) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
    }
    return { minX, minY, maxX, maxY };
}

/** Rectángulo alineado a ejes (AABB). */
export function createRect(x, y, width, height) {
    return {
        type: 'rect',
        x, y, width, height,
        bounds: { minX: x, minY: y, maxX: x + width, maxY: y + height }
    };
}

/** Círculo por centro y radio. */
export function createCircle(x, y, radius) {
    return {
        type: 'circle',
        x, y, radius,
        bounds: { minX: x - radius, minY: y - radius, maxX: x + radius, maxY: y + radius }
    };
}

/**
 * Polígono convexo por lista de vértices [{x, y}, ...] en orden horario o antihorario.
 * Es la forma general: cuadriláteros, trapecios, etc.
 */
export function createPolygon(vertices) {
    if (!Array.isArray(vertices) || vertices.length < 3) {
        throw new Error('createPolygon: se requieren al menos 3 vértices');
    }
    return {
        type: 'polygon',
        vertices,
        bounds: boundsFromPoints(vertices)
    };
}

/** Triángulo por sus 3 vértices. Tipo específico para despachar con semántica propia. */
export function createTriangle(x1, y1, x2, y2, x3, y3) {
    return {
        type: 'triangle',
        vertices: [
            { x: x1, y: y1 },
            { x: x2, y: y2 },
            { x: x3, y: y3 }
        ],
        bounds: boundsFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }])
    };
}
