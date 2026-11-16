/**
 * Jugador: murciélago con física de planeo, animación pixel-art de 6 frames,
 * animaciones de golpe y de cono sonar, e invulnerabilidad temporal.
 *
 * La física (gravedad/impulso/rotación) es EXACTAMENTE la del original.
 */

import { GameEntity } from './entities/GameEntity.js';
import { createCircle } from './collider/shapes.js';
import { BAT_PALETTE, BAT_PIXEL_FRAMES } from '../data/bat-sprite.js';
import { ECHOBAT_CONFIG } from '../data/config.js';

export class BatPlayer extends GameEntity {
    constructor(x, y) {
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

        // Física de planeo
        this.velocity += this.gravity * dt;
        if (this.velocity > this.maxFallSpeed) {
            this.velocity = this.maxFallSpeed;
        }
        this.pos.y += this.velocity * dt;

        // Inclinación según velocidad vertical
        const targetRotation = Math.min(Math.PI / 6, Math.max(-Math.PI / 7, this.velocity * 0.08));
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

    _drawSprite(ctx) {
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
