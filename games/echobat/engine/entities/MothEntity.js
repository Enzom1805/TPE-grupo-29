/**
 * Luciérnaga: coleccionable (+50 pts y recarga de sonar en el controller).
 * Entidad animada DIFERENTE Nº1 del entregable: aleteo renderizado desde
 * spritesheet procedural (atlas de 4 frames pre-dibujado).
 */

import { GameEntity } from './GameEntity.js';
import { createCircle } from '../collider/shapes.js';
import { getMothAtlas } from '../spritesheets/atlas.js';

export const MOTH_REWARD_SCORE = 50;

export class MothEntity extends GameEntity {
    constructor(x, y, atlas = null) {
        super(x, y, 22, 22);
        this.hoverOffset = Math.random() * Math.PI * 2;
        this.revealedTimer = 0;
        this.revealFrames = 180;
        /** Atlas inyectable (DIP); si falta, usa el singleton lazy. */
        this.atlas = atlas;
    }

    reveal() {
        this.revealedTimer = this.revealFrames;
    }

    /** Hitbox circular centrada (más justa que el AABB de 22×22 en las esquinas). */
    getCollider() {
        return createCircle(
            this.pos.x + this.width / 2,
            this.pos.y + this.height / 2,
            this.width / 2
        );
    }

    update(speed, dt = 1) {
        this.pos.x -= speed * 1.1 * dt;
        this.hoverOffset += 0.08 * dt;
        this.pos.y += Math.sin(this.hoverOffset) * 0.8 * dt;

        if (this.revealedTimer > 0) this.revealedTimer -= dt;
        if (this.pos.x + this.width < -50) this.markedForDeletion = true;
    }

    /** Frame actual del spritesheet según la fase del aleteo (0..3 cíclico). */
    currentFrame() {
        return Math.floor((this.hoverOffset * 3) / (Math.PI / 2));
    }

    draw(ctx) {
        const atlas = this.atlas || getMothAtlas();
        const fadeAlpha = Math.max(0, Math.min(1.0, this.revealedTimer / this.revealFrames));

        ctx.save();
        // Revelada → opaca y brillante; oculta → tenue (misma paleta, menos alpha)
        ctx.globalAlpha = fadeAlpha > 0 ? 1 : 0.4;
        atlas.drawFrame(ctx, this.currentFrame(), Math.floor(this.pos.x - 2), Math.floor(this.pos.y));
        ctx.restore();
    }
}
