/**
 * Spec del spritesheet del murciélago (datos puros, sin lógica de juego).
 *
 * El atlas fue generado offline desde el GIF de referencia
 * (murcielago-pixeleado.gif, 3 poses de aleteo ya transparentes) con
 * tools/build-bat-sheet.py: celdas de 112×84, contenido centrado, y se dibuja
 * a 0.5× (≈54×40 en pantalla) para preservar la nitidez del pixel-art.
 *
 * El ciclo de aleteo es PING-PONG 0→1→2→1: recorre las 3 poses ida y vuelta
 * para que el aleteo no tenga el salto brusco de volver 2→0.
 */

const SHEET_URL = new URL('../assets/images/echobat-bat-sheet.png', import.meta.url);

export const BAT_SHEET_SPEC = {
    url: SHEET_URL.href,
    /** Cantidad de poses en el atlas (una fila): 3 del GIF + 1 de dash sintetizada. */
    frameCount: 4,
    /** Índice de la pose de dash (alas hacia atrás, picado). */
    dashFrame: 3,
    /** Tamaño de celda en píxeles del atlas. */
    cellWidth: 112,
    cellHeight: 84,
    /** Escala de dibujo en pantalla (0.5× → 56×42, contenido ≈54×40). */
    drawScale: 0.5,
    /**
     * Secuencia de índices del ciclo de aleteo: ping-pong sobre las 3 poses
     * del GIF (la pose de dash no entra en el ciclo normal).
     */
    cycle: [0, 1, 2, 1],
    /** Tinte de daño (silueta roja, como el original). */
    hitTint: '#ef4444',
    /** Tinte mientras el sonar está activo (violeta claro). */
    sonarTint: 'rgba(192, 132, 252, 0.85)',
    /** Tinte cian del murciélago y sus estelas durante el dash. */
    dashTint: 'rgba(56, 189, 248, 0.85)'
};

/**
 * Función pura del ciclo ping-pong: posición de animación → índice de frame
 * del atlas. Acepta negativos y valores fuera de rango (siempre acotado).
 * @param {number} framePos avance continuo de la animación
 * @param {number[]} [cycle] secuencia ping-pong (inyectable para tests)
 * @returns {number} índice de celda dentro del atlas
 */
export function pingPongFrame(framePos, cycle = BAT_SHEET_SPEC.cycle) {
    if (typeof framePos !== 'number' || isNaN(framePos) || !isFinite(framePos)) {
        return cycle[0];
    }
    const n = cycle.length;
    const step = ((Math.floor(framePos) % n) + n) % n;
    return cycle[step];
}

/**
 * Carga (lazy, cacheada) de la imagen del atlas. Resuelve con el elemento
 * Image listo, o rechaza si no se pudo cargar (el render usa el fallback).
 * @param {() => HTMLImageElement} [createImage] factory inyectable (tests)
 */
export function loadBatSheet(createImage = () => new Image()) {
    if (!loadBatSheet._promise) {
        loadBatSheet._promise = new Promise((resolve, reject) => {
            const img = createImage();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', () => reject(new Error('No se pudo cargar el spritesheet del murciélago')));
            img.src = BAT_SHEET_SPEC.url;
        });
    }
    return loadBatSheet._promise;
}
