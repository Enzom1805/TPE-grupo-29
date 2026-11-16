/**
 * Araña: peligro colgante (resta 1 vida, NO termina el juego — requisito 4).
 * Entidad animada DIFERENTE Nº2 del entregable: cuerpo renderizado desde
 * spritesheet procedural (squash & stretch, 4 frames); el hilo es dinámico
 * porque conecta con el techo según su posición.
 */

import { GameEntity } from './GameEntity.js';
import { createCircle } from '../collider/shapes.js';
import { getSpiderAtlas } from '../spritesheets/atlas.js';

export class SpiderEntity extends GameEntity {
    constructor(x, y, atlas = null) {
        super(x, y, 24, 24);
        this.initialY = y;
        this.swingOffset = Math.random() * Math.PI * 2;
        this.revealedTimer = 0;
        this.revealFrames = 180;
        this.swingAmplitude = 45;
        /** Atlas inyectable (DIP); si falta, usa el singleton lazy. */
        this.atlas = atlas;
    }

    reveal() {
        this.revealedTimer = this.revealFrames;
    }

    /** Hitbox circular centrada en el cuerpo. */
    getCollider() {
        return createCircle(
            this.pos.x + this.width / 2,
            this.pos.y + this.height / 2,
            this.width / 2
        );
    }

    update(speed, dt = 1) {
        this.pos.x -= speed * dt;
        this.swingOffset += 0.05 * dt;
        this.pos.y = this.initialY + Math.sin(this.swingOffset) * this.swingAmplitude;

        if (this.revealedTimer > 0) this.revealedTimer -= dt;
        if (this.pos.x + this.width < -50) this.markedForDeletion = true;
    }

    /** Frame actual del spritesheet según la fase del vaivén (0..3 cíclico). */
    currentFrame() {
        return Math.floor(this.swingOffset / (Math.PI / 2));
    }

    draw(ctx) {
        const atlas = this.atlas || getSpiderAtlas();
        const fadeAlpha = Math.max(0, Math.min(1.0, this.revealedTimer / this.revealFrames));

        ctx.save();

        // Hilo de seda dinámico desde el techo (color ya lleva su propia alpha)
        ctx.strokeStyle = fadeAlpha > 0 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(71, 85, 105, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.pos.x + 12, 0);
        ctx.lineTo(this.pos.x + 12, this.pos.y + 12);
        ctx.stroke();

        // Cuerpo desde el spritesheet (revelada → opaca; oculta → tenue)
        ctx.globalAlpha = fadeAlpha > 0 ? 1 : 0.45;
        atlas.drawFrame(ctx, this.currentFrame(), Math.floor(this.pos.x - 2), Math.floor(this.pos.y - 2));

        ctx.restore();
    }
}
