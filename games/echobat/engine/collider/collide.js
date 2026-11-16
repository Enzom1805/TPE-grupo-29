/**
 * Funciones PURAS de colisión por par de formas geométricas.
 *
 * Cada función recibe dos formas (creadas con shapes.js) y devuelve boolean.
 * Convención: el contacto tangente (borde con borde) cuenta como colisión
 * (comparaciones inclusivas), decisión documentada y cubierta por tests.
 */

function clamp(value, min, max) {
    return value < min ? min : (value > max ? max : value);
}

// ============================================================
// RECT × RECT (AABB)
// ============================================================

/**
 * Colisión entre dos rectángulos alineados a ejes.
 * Semántica de borde estricta: bordes que solo se tocan NO colisionan
 * (misma convención que el checkRectCollision original de EchoBat).
 */
export function rectRect(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// ============================================================
// CIRCLE × CIRCLE
// ============================================================

/** Colisión entre dos círculos (distancia entre centros vs suma de radios). */
export function circleCircle(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const r = a.radius + b.radius;
    return dx * dx + dy * dy <= r * r;
}

// ============================================================
// CIRCLE × RECT
// ============================================================

/**
 * Colisión círculo vs rectángulo AABB.
 * Técnica: punto más cercano del rect al centro del círculo (clamp),
 * luego distancia al centro <= radio. Cubre el caso de esquina correctamente.
 */
export function circleRect(circle, rect) {
    const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
    const closestY = clamp(circle.y, rect.y, rect.y + rect.height);
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
}

// ============================================================
// PUNTO / POLÍGONO
// ============================================================

/** Punto dentro de un polígono convexo (incluye borde): cross products de igual signo. */
export function pointInPolygon(px, py, vertices) {
    let sign = 0;
    const n = vertices.length;
    for (let i = 0; i < n; i++) {
        const a = vertices[i];
        const b = vertices[(i + 1) % n];
        const cross = (b.x - a.x) * (py - a.y) - (b.y - a.y) * (px - a.x);
        if (cross === 0) continue; // punto sobre la línea del borde
        const s = cross > 0 ? 1 : -1;
        if (sign === 0) sign = s;
        else if (s !== sign) return false;
    }
    return true;
}

/** Distancia de un punto a un segmento [a, b]. */
export function pointSegmentDistance(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const lengthSq = abx * abx + aby * aby;
    let t = 0;
    if (lengthSq > 0) {
        t = ((px - ax) * abx + (py - ay) * aby) / lengthSq;
        t = clamp(t, 0, 1);
    }
    const closestX = ax + abx * t;
    const closestY = ay + aby * t;
    const dx = px - closestX;
    const dy = py - closestY;
    return Math.sqrt(dx * dx + dy * dy);
}

// ============================================================
// POLYGON × CIRCLE (cubre también TRIANGLE × CIRCLE)
// ============================================================

/**
 * Colisión entre polígono convexo y círculo.
 * Hay colisión si: el centro está dentro del polígono, O algún borde
 * queda a distancia <= radio del centro.
 * @param {Array<{x:number,y:number}>} vertices
 * @param {{x:number,y:number,radius:number}} circle
 */
export function polygonCircle(vertices, circle) {
    if (pointInPolygon(circle.x, circle.y, vertices)) return true;

    const n = vertices.length;
    for (let i = 0; i < n; i++) {
        const a = vertices[i];
        const b = vertices[(i + 1) % n];
        if (pointSegmentDistance(circle.x, circle.y, a.x, a.y, b.x, b.y) <= circle.radius) {
            return true;
        }
    }
    return false;
}

/** Círculo vs triángulo. */
export function circleTriangle(circle, triangle) {
    return polygonCircle(triangle.vertices, circle);
}

/** Triángulo vs círculo (orden inverso). */
export function triangleCircle(triangle, circle) {
    return polygonCircle(triangle.vertices, circle);
}

// ============================================================
// POLYGON × POLYGON vía SAT (cubre TRIANGLE y RECT)
// ============================================================

/** Normales de los bordes de un polígono convexo (ejes del SAT). */
function polygonAxes(vertices) {
    const axes = [];
    const n = vertices.length;
    for (let i = 0; i < n; i++) {
        const a = vertices[i];
        const b = vertices[(i + 1) % n];
        const edgeX = b.x - a.x;
        const edgeY = b.y - a.y;
        const length = Math.sqrt(edgeX * edgeX + edgeY * edgeY);
        if (length === 0) continue;
        // Normal del borde
        axes.push({ x: -edgeY / length, y: edgeX / length });
    }
    return axes;
}

/** Proyección de un polígono sobre un eje: [min, max]. */
function projectPolygon(vertices, axis) {
    let min = Infinity;
    let max = -Infinity;
    for (const v of vertices) {
        const p = v.x * axis.x + v.y * axis.y;
        if (p < min) min = p;
        if (p > max) max = p;
    }
    return [min, max];
}

/**
 * Separating Axis Theorem entre dos polígonos CONVEXOS.
 * También resuelve triángulo×triángulo, triángulo×trapecio, etc.
 * @returns {boolean}
 */
export function polygonPolygon(polyA, polyB) {
    const a = polyA.vertices || polyA;
    const b = polyB.vertices || polyB;
    const axes = [...polygonAxes(a), ...polygonAxes(b)];

    for (const axis of axes) {
        const [minA, maxA] = projectPolygon(a, axis);
        const [minB, maxB] = projectPolygon(b, axis);
        // Proyecciones separadas (con tolerancia de contacto inclusiva)
        if (maxA < minB || maxB < minA) return false;
    }
    return true;
}

/** Rectángulo vs polígono: el rect se trata como polígono de 4 vértices. */
export function rectPolygon(rect, poly) {
    const rectPoly = {
        vertices: [
            { x: rect.x, y: rect.y },
            { x: rect.x + rect.width, y: rect.y },
            { x: rect.x + rect.width, y: rect.y + rect.height },
            { x: rect.x, y: rect.y + rect.height }
        ]
    };
    return polygonPolygon(rectPoly, poly);
}

/** Polígono vs rectángulo (orden inverso). */
export function polygonRect(poly, rect) {
    return rectPolygon(rect, poly);
}

/** Triángulo vs rectángulo. */
export function triangleRect(triangle, rect) {
    return rectPolygon(rect, triangle);
}

/** Rectángulo vs triángulo. */
export function rectTriangle(rect, triangle) {
    return rectPolygon(rect, triangle);
}

/** Triángulo vs triángulo. */
export function triangleTriangle(a, b) {
    return polygonPolygon(a, b);
}
