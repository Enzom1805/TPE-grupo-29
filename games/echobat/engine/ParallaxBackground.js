/**
 * Fondo parallax de EchoBat basado en imágenes (4 capas, requisito del entregable).
 *
 * Cada capa es una escena completa de cueva (PNG 1600x900) que se desplaza a
 * `speedRatio × worldSpeed`. Las capas más lejanas se mueven más lento y las
 * cercanas más rápido; el controller pasa la misma `worldSpeed` que mueve
 * pilares/entidades, por lo que el dash y la pausa se reflejan automáticamente.
 *
 * Como las imágenes no son tileables, cada capa se dibuja normal + espejada y
 * el offset envuelve cada `2 × width` (ancho del tile espejado). Eso da un loop
 * continuo sin costura visible.
 *
 * Si las imágenes aún no cargaron (o fallaron), se dibuja un fondo oscuro
 * sólido. El tinte `dim` se aplica siempre sobre el fondo para que los
 * obstáculos del juego se lean bien.
 */

import { ECHOBAT_CONFIG } from '../data/config.js';
import { loadParallaxLayers } from '../data/parallax-layers.js';

export class ParallaxBackground {
    /**
     * @param {number} [width] ancho lógico del canvas
     * @param {number} [height] alto lógico del canvas
     * @param {object} [options] inyecciones para tests
     * @param {() => HTMLImageElement} [options.createImage] factory de imágenes
     * @param {number} [options.dim] alpha del tinte (override de config)
     */
    constructor(width = ECHOBAT_CONFIG.width, height = ECHOBAT_CONFIG.height, options = {}) {
        this.width = width;
        this.height = height;
        /** Ancho del tile normal + espejado: el offset envuelve con este valor. */
        this.tileWidth = width * 2;

        this.layers = ECHOBAT_CONFIG.parallax.speedRatios.map((speedRatio) => ({
            speedRatio,
            offsetX: 0
        }));

        /** @type {HTMLImageElement[]|null} */
        this._images = null;
        this._loaded = false;
        this._loading = null;
        this._disposed = false;

        this._createImage = options.createImage || null;
        this._dim = options.dim ?? ECHOBAT_CONFIG.parallax.dim;
    }

    /**
     * Carga las 4 imágenes en diferido. Es idempotente: llamadas repetidas
     * devuelven la misma promesa. Si falla, el fondo queda en fallback.
     * @returns {Promise<void>}
     */
    load() {
        if (this._loading) return this._loading;
        if (this._loaded || this._disposed) return Promise.resolve();

        this._loading = loadParallaxLayers(this._createImage || undefined)
            .then((images) => {
                if (this._disposed) return;
                this._images = images;
                this._loaded = true;
            })
            .catch(() => {
                // Permite reintentar en un próximo load() si la red falló.
                this._loading = null;
                /* fallback: se sigue dibujando el fondo oscuro */
            });

        return this._loading;
    }

    /**
     * Avanza el offset de cada capa con la velocidad del mundo.
     * @param {number} baseSpeed px/frame normalizados
     * @param {number} [dt] delta-time normalizado
     */
    update(baseSpeed, dt = 1) {
        this.layers.forEach((layer) => {
            layer.offsetX = (layer.offsetX + baseSpeed * layer.speedRatio * dt) % this.tileWidth;
        });
    }

    /**
     * Dibuja el fondo completo (capas + tinte) en el contexto del juego.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (this._loaded && this._images) {
            this._drawImageLayers(ctx);
        } else {
            this._drawFallback(ctx);
        }

        if (this._dim > 0) {
            ctx.save();
            ctx.fillStyle = `rgba(2, 6, 23, ${this._dim})`;
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
        }
    }

    /** Libera referencias al desmontar el juego. */
    destroy() {
        this._disposed = true;
        this._images = null;
        this._loaded = false;
    }

    // ======================================================
    // RENDER
    // ======================================================

    _drawImageLayers(ctx) {
        this.layers.forEach((layer, index) => {
            const img = this._images[index];
            if (!img) return;

            const offset = layer.offsetX;
            // Tile 0: cubre el viewport mientras offset <= width.
            this._drawTile(ctx, img, -offset);

            // Con offset > width, el tile 0 ya no llega al borde derecho:
            // el tile 1 (siguiente copia) completa la cobertura.
            if (offset > this.width) {
                this._drawTile(ctx, img, this.tileWidth - offset);
            }
        });
    }

    /**
     * Dibuja una copia del tile: imagen normal + su espejo horizontal.
     * @param {CanvasRenderingContext2D} ctx
     * @param {CanvasImageSource} img
     * @param {number} x posición lógica del inicio del tile
     */
    _drawTile(ctx, img, x) {
        const w = this.width;
        const h = this.height;

        // Copia normal: [x, x + w]. Se omite si quedó fuera del viewport.
        if (x < w && x + w > 0) {
            ctx.drawImage(img, x, 0, w, h);
        }

        // Copia espejada: [x + w, x + 2w]. También se omite si no se ve.
        const mirrorX = x + w;
        if (mirrorX < w && mirrorX + w > 0) {
            ctx.save();
            ctx.translate(x + w * 2, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, w, h);
            ctx.restore();
        }
    }

    _drawFallback(ctx) {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, this.width, this.height);
    }
}
