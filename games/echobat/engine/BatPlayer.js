/**
 * Jugador: murciélago con física de planeo, spritesheet real de 3 poses
 * (atlas generado desde el GIF de referencia, ciclo ping-pong 0→1→2→1),
 * animaciones de golpe y de cono sonar, e invulnerabilidad temporal.
 *
 * La física (gravedad/impulso/rotación) es EXACTAMENTE la del original.
 * Si el atlas aún no cargó (o falló), cae al pixel-art ASCII original.
 */

import { GameEntity } from './entities/GameEntity.js';
import { createCircle } from './collider/shapes.js';
import { BAT_PALETTE, BAT_PIXEL_FRAMES } from '../data/bat-sprite.js';
import { BAT_SHEET_SPEC, pingPongFrame, loadBatSheet } from '../data/bat-sheet.js';
import { ECHOBAT_CONFIG } from '../data/config.js';

export class BatPlayer extends GameEntity {
    /**
     * @param {number} x posición inicial
     * @param {number} y posición inicial
     * @param {object} [options] inyecciones para tests (DIP)
     * @param {HTMLImageElement} [options.sheetImage] atlas ya cargado
     * @param {() => HTMLCanvasElement} [options.createCanvas] factory de canvas
     *   auxiliares (para los tintes de golpe/sonar)
     */
    constructor(x, y, options = {}) {
        super(x, y, ECHOBAT_CONFIG.player.width, ECHOBAT_CONFIG.player.height);

        const p = ECHOBAT_CONFIG.player;
        this.velocity = 0;
        this.gravity = p.gravity;
        this.jumpStrength = p.jumpStrength;
        this.maxFallSpeed = p.maxFallSpeed;
        this.rotation = 0;
        this.isHit = false;
        this.hitTimer = 0;
        this.hitFrames = p.hitFrames;
        this.sonarConeTimer = 0;
        this.sonarConeFrames = p.sonarConeFrames;
        /** Tiempo de gracia / invulnerabilidad tras recibir daño. */
        this.invincibilityTimer = 0;
        this.invincibilityFrames = p.invincibilityFrames;

        this.animFrame = 2;
        this.flapSpeed = p.flapSpeed;
        this.pixelScale = p.pixelScale;

        // Dash (→ / D): ráfaga hacia adelante con gravedad reducida
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashFrames = ECHOBAT_CONFIG.dash.dashFrames;

        /** Spritesheet inyectado (tests) o cargado en diferido. */
        this.sheetImage = options.sheetImage || null;
        this._createCanvas = options.createCanvas || (() => document.createElement('canvas'));
        /** Canvas auxiliar reutilizado para los tintes (creación diferida). */
        this._tintCanvas = null;
        /** Siluetas cian cacheadas por pose (para las estelas fantasma). */
        this._ghostCanvases = null;

        if (!this.sheetImage && typeof Image !== 'undefined') {
            loadBatSheet()
                .then(img => { this.sheetImage = img; })
                .catch(() => { /* fallback al pixel-art */ });
        }
    }

    /** Activa la ráfaga de dash (el controller valida cargas previamente). */
    triggerDash() {
        this.isDashing = true;
        this.dashTimer = this.dashFrames;
    }

    /** X base del murciélago (posición fija del viewport): adonde vuelve tras el dash. */
    get baseX() {
        return ECHOBAT_CONFIG.player.x;
    }

    /** El atlas está listo para dibujarse (imagen cargada y válida). */
    _hasSheet() {
        const img = this.sheetImage;
        return Boolean(img && img.complete && img.naturalWidth > 0);
    }

    /** Impulso hacia arriba (requisito del entregable). Resetea el aleteo al frame 0. */
    flap() {
        this.velocity = this.jumpStrength;
        this.animFrame = 0;
    }

    /** Evento de colisión: activa la animación de golpe. */
    triggerHitAnimation() {
        this.isHit = true;
        this.hitTimer = this.hitFrames;
    }

    /** Evento de ecolocalización: activa la animación del cono. */
    triggerSonarAnimation() {
        this.sonarConeTimer = this.sonarConeFrames;
    }

    /**
     * Hitbox circular del cuerpo (ColliderSystem). Excluye las puntas de las
     * alas para que las colisiones sean justas con la silueta visual.
     * @returns {{type: string, bounds: object}}
     */
    getCollider() {
        const p = ECHOBAT_CONFIG.player;
        return createCircle(
            this.pos.x + this.width / 2 + p.colliderOffsetX,
            this.pos.y + this.height / 2 + p.colliderOffsetY,
            p.colliderRadius
        );
    }

    update(canvasHeight, dt = 1) {
        if (isNaN(dt) || dt <= 0) dt = 1;

        // Física de planeo (gravedad reducida durante el dash: vuelo horizontal)
        const gravityFactor = this.isDashing ? ECHOBAT_CONFIG.dash.gravityFactor : 1;
        this.velocity += this.gravity * gravityFactor * dt;
        if (this.velocity > this.maxFallSpeed) {
            this.velocity = this.maxFallSpeed;
        }
        this.pos.y += this.velocity * dt;

        // Ráfaga hacia adelante: empuje + clamping (no invade el spawn de pilares)
        if (this.isDashing) {
            this.pos.x += ECHOBAT_CONFIG.dash.playerPush * dt;
            if (this.pos.x > ECHOBAT_CONFIG.dash.maxX) {
                this.pos.x = ECHOBAT_CONFIG.dash.maxX;
            }
            this.dashTimer -= dt;
            if (this.dashTimer <= 0) {
                this.isDashing = false;
            }
        } else if (this.pos.x > this.baseX) {
            // Al terminar el dash, regreso suave a la posición base del viewport
            this.pos.x -= 6 * dt;
            if (this.pos.x < this.baseX) this.pos.x = this.baseX;
        }

        // Inclinación según velocidad vertical (enderezado durante el dash)
        const targetRotation = this.isDashing
            ? 0.08
            : Math.min(Math.PI / 6, Math.max(-Math.PI / 7, this.velocity * 0.08));
        this.rotation += (targetRotation - this.rotation) * 0.15 * dt;

        // Límites verticales del canvas
        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.velocity = 0;
        }
        if (this.pos.y + this.height > canvasHeight) {
            this.pos.y = canvasHeight - this.height;
        }

        // Animación de aleteo
        if (isNaN(this.animFrame) || !isFinite(this.animFrame)) {
            this.animFrame = 0;
        }
        this.animFrame += this.flapSpeed * dt;

        // Timers de eventos
        if (this.isHit) {
            this.hitTimer -= dt;
            if (this.hitTimer <= 0) this.isHit = false;
        }
        if (this.invincibilityTimer > 0) {
            this.invincibilityTimer -= dt;
            if (this.invincibilityTimer < 0) this.invincibilityTimer = 0;
        }
        if (this.sonarConeTimer > 0) {
            this.sonarConeTimer -= dt;
        }
    }

    draw(ctx) {
        // Parpadeo visual durante el periodo de invulnerabilidad tras colisión
        if (this.invincibilityTimer > 0 && Math.floor(this.invincibilityTimer / 4) % 2 === 0) {
            return;
        }

        ctx.save();
        ctx.translate(this.pos.x + this.width / 2, this.pos.y + this.height / 2);

        if (this.sonarConeTimer > 0) {
            this._drawSonarCone(ctx);
        }

        ctx.rotate(this.rotation);
        this._drawSprite(ctx);

        ctx.restore();
    }

    _drawSonarCone(ctx) {
        const progress = 1 - (Math.max(0, this.sonarConeTimer) / this.sonarConeFrames);
        const coneLength = 580 * progress;
        const coneHalfWidth = 150 * progress;

        ctx.save();
        const grad = ctx.createRadialGradient(0, 0, 10, coneLength, 0, coneLength);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.50)');
        grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.25)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(15 + coneLength, -coneHalfWidth);
        ctx.lineTo(15 + coneLength, coneHalfWidth);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(168, 85, 247, ' + (1 - progress) + ')';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(15, 0, coneLength, -0.32, 0.32);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Dibuja el murciélago desde el spritesheet (celda del frame actual del
     * ciclo ping-pong, a drawScale). Los efectos de golpe (silueta roja) y de
     * sonar (tinte violeta) se aplican con composición source-atop sobre un
     * canvas auxiliar para preservar la transparencia del sprite.
     */
    _drawSprite(ctx) {
        if (this._hasSheet()) {
            this._drawSheetFrame(ctx);
        } else {
            this._drawPixelSprite(ctx);
        }
    }

    _drawSheetFrame(ctx) {
        const spec = BAT_SHEET_SPEC;
        // Durante el dash se usa la pose dedicada de picado (alas hacia atrás)
        const frameIdx = this.isDashing ? spec.dashFrame : pingPongFrame(this.animFrame, spec.cycle);
        const drawW = spec.cellWidth * spec.drawScale;
        const drawH = spec.cellHeight * spec.drawScale;
        const sx = frameIdx * spec.cellWidth;
        const dx = -drawW / 2;
        const dy = -drawH / 2;

        // Prioridad de tinte: daño (rojo) > dash (cian) > sonar (violeta)
        const tint = this.isHit ? spec.hitTint
            : this.isDashing ? spec.dashTint
            : this.sonarConeTimer > 0 ? spec.sonarTint
            : null;

        // Sin efectos → blit directo del frame
        if (!tint) {
            ctx.drawImage(
                this.sheetImage,
                sx, 0, spec.cellWidth, spec.cellHeight,
                dx, dy, drawW, drawH
            );
            return;
        }

        // Con efecto → tinte plano preservando alfa (source-atop)
        if (!this._tintCanvas) {
            this._tintCanvas = this._createCanvas();
            this._tintCanvas.width = spec.cellWidth;
            this._tintCanvas.height = spec.cellHeight;
        }
        const tctx = this._tintCanvas.getContext('2d');
        tctx.clearRect(0, 0, spec.cellWidth, spec.cellHeight);
        tctx.drawImage(this.sheetImage, sx, 0, spec.cellWidth, spec.cellHeight, 0, 0, spec.cellWidth, spec.cellHeight);
        tctx.globalCompositeOperation = 'source-atop';
        tctx.fillStyle = tint;
        tctx.fillRect(0, 0, spec.cellWidth, spec.cellHeight);
        tctx.globalCompositeOperation = 'source-over';

        ctx.drawImage(
            this._tintCanvas,
            0, 0, spec.cellWidth, spec.cellHeight,
            dx, dy, drawW, drawH
        );
    }

    /**
     * Siluetas cian cacheadas por pose (para las estelas fantasma del dash).
     * Se generan una única vez por pose del atlas y se reutilizan con alpha.
     * @returns {HTMLCanvasElement[]}
     */
    _getGhostCanvases() {
        if (this._ghostCanvases) return this._ghostCanvases;
        const spec = BAT_SHEET_SPEC;
        this._ghostCanvases = [];
        for (let i = 0; i < spec.frameCount; i++) {
            const canvas = this._createCanvas();
            canvas.width = spec.cellWidth;
            canvas.height = spec.cellHeight;
            const gctx = canvas.getContext('2d');
            gctx.drawImage(this.sheetImage, i * spec.cellWidth, 0, spec.cellWidth, spec.cellHeight, 0, 0, spec.cellWidth, spec.cellHeight);
            gctx.globalCompositeOperation = 'source-atop';
            gctx.fillStyle = spec.dashTint;
            gctx.fillRect(0, 0, spec.cellWidth, spec.cellHeight);
            this._ghostCanvases.push(canvas);
        }
        return this._ghostCanvases;
    }

    /**
     * Dibuja una estela fantasma (silueta cian translúcida) en una posición
     * y rotación capturadas durante el dash.
     */
    drawGhost(ctx, ghost) {
        if (!this._hasSheet()) return;
        const spec = BAT_SHEET_SPEC;
        const ghosts = this._getGhostCanvases();
        const alpha = Math.max(0, Math.min(1, ghost.life / ghost.maxLife)) * 0.55;
        const drawW = spec.cellWidth * spec.drawScale;
        const drawH = spec.cellHeight * spec.drawScale;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(ghost.x + this.width / 2, ghost.y + this.height / 2);
        ctx.rotate(ghost.rotation);
        ctx.drawImage(
            ghosts[ghost.frameIdx % ghosts.length],
            0, 0, spec.cellWidth, spec.cellHeight,
            -drawW / 2, -drawH / 2, drawW, drawH
        );
        ctx.restore();
    }

    /** Fallback: pixel-art ASCII original (si el atlas no cargó). */
    _drawPixelSprite(ctx) {
        if (isNaN(this.animFrame) || !isFinite(this.animFrame)) {
            this.animFrame = 0;
        }
        const totalFrames = BAT_PIXEL_FRAMES.length;
        let currentFrameIdx = Math.floor(Math.abs(this.animFrame)) % totalFrames;
        if (isNaN(currentFrameIdx) || currentFrameIdx < 0 || currentFrameIdx >= totalFrames) {
            currentFrameIdx = 0;
        }
        const frameData = BAT_PIXEL_FRAMES[currentFrameIdx] || BAT_PIXEL_FRAMES[0];
        const rows = frameData.length;
        const cols = frameData[0].length;
        const pSize = this.pixelScale;

        const startX = - (cols * pSize) / 2;
        const startY = - (rows * pSize) / 2;

        for (let r = 0; r < rows; r++) {
            const rowStr = frameData[r];
            for (let c = 0; c < cols; c++) {
                const code = rowStr[c];
                if (code !== '.' && BAT_PALETTE[code]) {
                    let color = BAT_PALETTE[code];

                    if (this.isHit) {
                        color = '#ef4444';
                    } else if (this.sonarConeTimer > 0 && (code === 'K' || code === 'L')) {
                        color = '#c084fc';
                    }

                    ctx.fillStyle = color;
                    ctx.fillRect(
                        Math.floor(startX + c * pSize),
                        Math.floor(startY + r * pSize),
                        Math.ceil(pSize),
                        Math.ceil(pSize)
                    );
                }
            }
        }
    }
}
