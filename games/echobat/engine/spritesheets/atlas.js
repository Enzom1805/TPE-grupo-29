/**
 * Spritesheets procedurales de las entidades dinámicas (requisito del
 * entregable: mínimo 2 elementos animados DIFERENTES con spritesheet).
 *
 * Técnica estándar de spritesheet: al inicializar se pre-dibujan los frames
 * de la animación en un canvas offscreen (atlas) organizados en celdas iguales;
 * en render se recorta la celda del frame actual con drawImage.
 * Cero dependencias externas: el atlas se genera en runtime.
 *
 * Los canvas se crean vía factory inyectable (Dependency Inversion): en tests
 * se pasa un canvas falso y el módulo sigue siendo agnóstico del DOM.
 */

const MOTH_CELL = { width: 26, height: 22 };
const SPIDER_CELL = { width: 28, height: 28 };

/**
 * Crea un atlas spritesheet a partir de funciones de dibujo por frame.
 * @param {{cellWidth: number, cellHeight: number, frames: Array<Function>}} spec
 * @param {() => HTMLCanvasElement} [createCanvas] factory inyectable
 */
export function createSpriteAtlas(spec, createCanvas = () => document.createElement('canvas')) {
    const { cellWidth, cellHeight, frames } = spec;
    if (!frames || frames.length === 0) {
        throw new Error('createSpriteAtlas: se requiere al menos un frame');
    }

    const canvas = createCanvas();
    canvas.width = cellWidth * frames.length;
    canvas.height = cellHeight;

    const ctx = canvas.getContext('2d');
    frames.forEach((drawFrame, i) => {
        ctx.save();
        ctx.translate(i * cellWidth, 0); // cada frame dibuja en coords locales 0..cellWidth
        drawFrame(ctx);
        ctx.restore();
    });

    return {
        canvas,
        cellWidth,
        cellHeight,
        frameCount: frames.length,

        /**
         * Dibuja el frame actual del atlas sobre un destino.
         * Normaliza el índice (acepta negativos y fuera de rango, siempre cíclico).
         */
        drawFrame(ctx, frameIndex, destX, destY) {
            const idx = ((Math.floor(frameIndex) % frames.length) + frames.length) % frames.length;
            ctx.drawImage(
                this.canvas,
                idx * this.cellWidth, 0, this.cellWidth, this.cellHeight,
                destX, destY, this.cellWidth, this.cellHeight
            );
        }
    };
}

// ============================================================
// LUCIÉRNAGA: 4 fases de aleteo (wingOffset sinusoidal, como el original)
// ============================================================

/** Frame de luciérnaga: cuerpo + alas desplazadas (paleta revelada, brillante). */
function drawMothFrame(ctx, wingOffset) {
    // Cuerpo
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 12;
    ctx.fillRect(10, 6, 6, 10);

    // Alas (se acercan y alejan del cuerpo)
    ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
    ctx.fillRect(Math.floor(4 - wingOffset), 4, 6, 6);
    ctx.fillRect(Math.floor(16 + wingOffset), 4, 6, 6);
}

/** Celdas de 26×22 con 2px de padding para que las alas no se recorten. */
export function createMothAtlas(createCanvas) {
    // wingOffsets equivalentes a sin(hoverOffset*3)*4 en hoverOffset 0, π/2, π, 3π/2
    const wingOffsets = [0, -4, 0, 4];
    return createSpriteAtlas({
        cellWidth: MOTH_CELL.width,
        cellHeight: MOTH_CELL.height,
        frames: wingOffsets.map(wo => (ctx) => drawMothFrame(ctx, wo))
    }, createCanvas);
}

// ============================================================
// ARAÑA: 4 fases de squash & stretch del cuerpo (el hilo se dibuja dinámico)
// ============================================================

/** Frame de araña: cuerpo (con aplastamiento vertical) + ojos. */
function drawSpiderFrame(ctx, bodyHeight) {
    const dy = 12 - bodyHeight; // mantiene el cuerpo anclado por su centro
    // Cuerpo
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(8, 8 + dy, 12, bodyHeight);
    // Ojos
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 9 + dy, 2, 2);
    ctx.fillRect(16, 9 + dy, 2, 2);
}

/** Celdas de 28×28 con 2px de padding. */
export function createSpiderAtlas(createCanvas) {
    const bodyHeights = [12, 11, 12, 13];
    return createSpriteAtlas({
        cellWidth: SPIDER_CELL.width,
        cellHeight: SPIDER_CELL.height,
        frames: bodyHeights.map(h => (ctx) => drawSpiderFrame(ctx, h))
    }, createCanvas);
}

// ============================================================
// Singletons lazy (creación diferida: el engine no toca el DOM al importar)
// ============================================================

let _mothAtlas = null;
let _spiderAtlas = null;

export function getMothAtlas() {
    if (!_mothAtlas) _mothAtlas = createMothAtlas();
    return _mothAtlas;
}

export function getSpiderAtlas() {
    if (!_spiderAtlas) _spiderAtlas = createSpiderAtlas();
    return _spiderAtlas;
}
