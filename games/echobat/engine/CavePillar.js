/**
 * Obstáculos: par de estalactita (techo) y estalagmita (suelo) con hueco
 * variable. Reemplaza el AABB burdo original por colliders de TRAPECIO que
 * calcan la silueta pixel-art real: el ancho se reduce linealmente hacia la
 * punta (igual que el dibujo con inset = progress * maxInset).
 *
 * Requisitos del entregable cubiertos acá:
 *   - Hueco vertical que se reduce a medida que se avanza (config.difficulty).
 *   - Hueco NO alineado verticalmente (topHeight aleatorio dentro de márgenes).
 */

import { createPolygon } from './collider/shapes.js';
import { MathUtils } from './MathUtils.js';
import { ECHOBAT_CONFIG } from '../data/config.js';

export class CavePillar {
    constructor(x, canvasHeight, currentGapHeight) {
        const cfg = ECHOBAT_CONFIG.pillar;

        this.x = x;
        this.width = cfg.width;
        this.canvasHeight = canvasHeight;
        this.gapHeight = currentGapHeight;

        const minTop = cfg.edgeMargin;
        const maxTop = canvasHeight - currentGapHeight - cfg.edgeMargin;
        this.topHeight = MathUtils.randomRange(minTop, maxTop);
        this.bottomY = this.topHeight + this.gapHeight;
        this.bottomHeight = canvasHeight - this.bottomY;

        this.passed = false;
        this.revealedTimer = 0;
        this.revealFrames = ECHOBAT_CONFIG.sonar.revealFrames;
    }

    reveal() {
        this.revealedTimer = this.revealFrames;
    }

    update(speed, dt = 1) {
        this.x -= speed * dt;
        if (this.revealedTimer > 0) this.revealedTimer -= dt;
    }

    /**
     * Colliders de este pilar: dos trapecios (polígonos de 4 vértices).
     *   - Estalactita: ancho completo en el techo, se afina hacia la punta inferior.
     *   - Estalagmita: punta fina arriba (en el hueco), ancha en el suelo.
     * @returns {Array<{type: string, bounds: object}>}
     */
    getColliders() {
        const cfg = ECHOBAT_CONFIG.pillar;
        const w = cfg.drawnWidth;      // 66 px dibujados reales
        const tip = cfg.tipInset;      // semiancho recortado en la punta (24 px)

        return [
            createPolygon([
                { x: this.x, y: 0 },
                { x: this.x + w, y: 0 },
                { x: this.x + w - tip, y: this.topHeight },
                { x: this.x + tip, y: this.topHeight }
            ]),
            createPolygon([
                { x: this.x + tip, y: this.bottomY },
                { x: this.x + w - tip, y: this.bottomY },
                { x: this.x + w, y: this.canvasHeight },
                { x: this.x, y: this.canvasHeight }
            ])
        ];
    }

    draw(ctx) {
        ctx.save();
        const fadeAlpha = Math.max(0, Math.min(1.0, this.revealedTimer / this.revealFrames));

        this._drawPixelStalactite(ctx, this.x, 0, this.width, this.topHeight, true, fadeAlpha);
        this._drawPixelStalactite(ctx, this.x, this.bottomY, this.width, this.bottomHeight, false, fadeAlpha);

        ctx.restore();
    }

    _drawPixelStalactite(ctx, x, y, width, height, isTop, fadeAlpha) {
        const pSize = ECHOBAT_CONFIG.pillar.pixelSize;
        const cols = Math.floor(width / pSize);
        const rows = Math.max(1, Math.floor(height / pSize));

        for (let r = 0; r < rows; r++) {
            const progress = isTop ? (r / rows) : (1 - r / rows);
            const inset = Math.floor(progress * (cols / 2.6));

            for (let c = inset; c < cols - inset; c++) {
                const px = Math.floor(x + c * pSize);
                const py = Math.floor(y + r * pSize);

                const isOutline = (c === inset || c === cols - inset - 1 || (isTop ? r === rows - 1 : r === 0));

                if (fadeAlpha > 0) {
                    if (isOutline) {
                        ctx.fillStyle = `rgba(34, 197, 94, ${fadeAlpha})`;
                    } else {
                        ctx.fillStyle = (c + r) % 3 === 0 ? '#064e3b' : '#022c22';
                    }
                } else {
                    if (isOutline) {
                        ctx.fillStyle = '#0f172a';
                    } else {
                        ctx.fillStyle = (c + r) % 4 === 0 ? '#090d16' : '#030712';
                    }
                }

                ctx.fillRect(px, py, pSize, pSize);
            }
        }
    }
}
