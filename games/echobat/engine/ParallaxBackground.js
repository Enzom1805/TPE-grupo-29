/**
 * Fondo con parallax scrolling de 4 capas (requisito del entregable).
 * Cada capa se mueve a speedRatio × velocidad base; las siluetas se generan
 * con ruido senoidal determinístico por capa (idéntico al original).
 */

import { ECHOBAT_CONFIG } from '../data/config.js';

export class ParallaxBackground {
    constructor(width = ECHOBAT_CONFIG.width, height = ECHOBAT_CONFIG.height) {
        this.width = width;
        this.height = height;
        this.layers = [
            { speedRatio: 0.1, offsetX: 0, color: '#020617' },
            { speedRatio: 0.25, offsetX: 0, color: '#0f172a' },
            { speedRatio: 0.5, offsetX: 0, color: '#1e1b4b' },
            { speedRatio: 0.85, offsetX: 0, color: '#312e81' }
        ];
    }

    update(baseSpeed, dt = 1) {
        this.layers.forEach(layer => {
            layer.offsetX = (layer.offsetX + baseSpeed * layer.speedRatio * dt) % this.width;
        });
    }

    draw(ctx) {
        this.layers.forEach((layer, idx) => {
            ctx.save();
            ctx.fillStyle = layer.color;

            const offset = layer.offsetX;
            const yOffset = (idx + 1) * 35;

            for (let i = 0; i < 2; i++) {
                const startX = i * this.width - offset;

                ctx.beginPath();
                ctx.moveTo(startX, this.height);
                for (let x = 0; x <= this.width; x += 40) {
                    const noise = Math.sin((startX + x) * 0.01 * (idx + 1)) * (20 + idx * 10);
                    ctx.lineTo(startX + x, this.height - yOffset + noise);
                }
                ctx.lineTo(startX + this.width, this.height);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        });
    }
}
