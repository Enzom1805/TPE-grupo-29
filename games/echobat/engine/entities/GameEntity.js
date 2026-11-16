/**
 * Entidad base del juego (Open/Closed: extensible sin tocar el render).
 * Subclases definen update/draw y pueden exponer getCollider() para el ColliderSystem.
 */

import { Vector2D } from '../Vector2D.js';

export class GameEntity {
    constructor(x, y, width, height) {
        this.pos = new Vector2D(x, y);
        this.width = width;
        this.height = height;
        this.markedForDeletion = false;
    }

    /** AABB lógico de la entidad (para límites de pantalla, no para colisión fina). */
    getBounds() {
        return {
            x: this.pos.x,
            y: this.pos.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Forma geométrica para el ColliderSystem. Las subclases colisionables
     * la implementan con la forma que mejor representa su volumen.
     * @returns {{type: string, bounds: object}} shape (datos planos)
     */
    getCollider() {
        return null;
    }

    update(speed, dt = 1) {}
    draw(ctx) {}
}
