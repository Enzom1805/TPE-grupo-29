/**
 * Utilidades matemáticas del engine.
 * La detección de colisiones vive en engine/collider/ (ColliderSystem).
 */
export class MathUtils {
    static randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
}
