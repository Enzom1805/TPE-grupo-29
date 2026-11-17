/**
 * Configuración centralizada de gameplay de EchoBat (id 50).
 *
 * Todos los valores provienen del comportamiento original de echoBatv3.html
 * (se conservan EXACTOS para preservar la dificultad y el feel del juego).
 * Ningún módulo del juego debería hardcodear números mágicos: leer de acá.
 */

export const ECHOBAT_CONFIG = {
    /** Dimensiones lógicas del canvas de juego. */
    width: 800,
    height: 450,

    /** Velocidad horizontal constante del escenario (px por frame normalizado). */
    baseSpeed: 3.2,

    /** Vidas iniciales y puntajes. */
    lives: 3,
    scorePerPillar: 10,
    scorePerMoth: 50,

    player: {
        /** Posición fija en X dentro del viewport. */
        x: 120,
        width: 48,
        height: 28,
        gravity: 0.18,
        jumpStrength: -4.4,
        maxFallSpeed: 3.4,
        /** Velocidad de avance de la animación de aleteo (frames pixel-art). */
        flapSpeed: 0.15,
        pixelScale: 2.2,
        /** Duración (frames normalizados) de la animación de golpe y del cono sonar. */
        hitFrames: 25,
        sonarConeFrames: 25,
        /** Frames de invulnerabilidad tras recibir daño (~1.5s). */
        invincibilityFrames: 90,
        /**
         * Hitbox circular del murciélago (ColliderSystem): cubre la masa central
         * del cuerpo y excluye las puntas de las alas, para colisiones justas.
         * Offset relativo al centro del sprite y radio en px.
         */
        colliderOffsetX: 0,
        colliderOffsetY: 1,
        colliderRadius: 13
    },

    pillar: {
        width: 68,
        /** Perdón de colisión (px) heredado del original. */
        pad: 4,
        /** Margen mínimo desde borde superior/inferior para ubicar el hueco. */
        edgeMargin: 65,
        pixelSize: 6,
        /** Ancho dibujado real de la estalactita: floor(width/pixelSize) * pixelSize. */
        drawnWidth: 66,
        /** Semiancho recortado en la punta según el dibujo pixel-art. */
        tipInset: 24
    },

    /** Progresión de dificultad: el hueco vertical se achica con el puntaje. */
    difficulty: {
        initialGap: 160,
        minGap: 105,
        /** Cada `gapScoreStep` puntos reduce el hueco `gapReductionPerStep` px. */
        gapScoreStep: 60,
        gapReductionPerStep: 6,
        maxGapReduction: 55,
        /**
         * Progresión de velocidad: tras `speedStartScore` puntos la velocidad
         * de scroll sube `speedStepIncrease` px/frame cada `speedScoreStep`
         * puntos, con tope en `maxSpeed`. Escalonada (no aceleración física):
         * dentro de cada tramo la velocidad es constante, como exige el
         * entregable.
         */
        speedStartScore: 100,
        speedScoreStep: 100,
        speedStepIncrease: 0.4,
        maxSpeed: 4.8
    },

    /** Spawning de pilares y entidades dinámicas. */
    spawn: {
        /** Primer pilar, fuera de pantalla a la derecha. */
        initialXOffset: 100,
        /** X donde aparecen los pilares siguientes. */
        pillarX: 820,
        /**
         * Distancia horizontal aleatoria entre pilares (requisito 6a: la
         * separación NO es constante). Cada spawn elige un valor del rango.
         */
        spacingMin: 230,
        spacingMax: 380,
        /** Probabilidad de spawn de entidad (luciérnaga o araña) por pilar. */
        entityChance: 0.6,
        /** Umbral aleatorio: > threshold → luciérnaga, si no → araña. */
        mothThreshold: 0.45,
        entityMarginTop: 60,
        entityMarginBottom: 80
    },

    /** Sonar / ecolocalización. */
    sonar: {
        cooldownFrames: 120,
        coneFrames: 25,
        revealFrames: 180
    },

    /** Clave de Web Storage para el mejor puntaje. */
    storageKey: 'echobat_highscore'
};

/**
 * Hueco vertical actual según el puntaje acumulado (curva de dificultad pura).
 * Función pura: fácil de testear y reutilizable por el controller.
 * @param {number} score
 * @returns {number} altura del hueco en px
 */
export function gapHeightForScore(score) {
    const { initialGap, minGap, gapScoreStep, gapReductionPerStep, maxGapReduction } = ECHOBAT_CONFIG.difficulty;
    const steps = Math.floor((score || 0) / gapScoreStep);
    const reduction = Math.min(maxGapReduction, steps * gapReductionPerStep);
    return Math.max(minGap, initialGap - reduction);
}

/**
 * Velocidad de scroll actual según el puntaje (curva de dificultad pura).
 * Constante (= baseSpeed) hasta `speedStartScore`; luego sube un escalón
 * `speedStepIncrease` cada `speedScoreStep` puntos, con tope `maxSpeed`.
 * Función pura: fácil de testear y reutilizable por el controller.
 * @param {number} score
 * @returns {number} velocidad en px/frame
 */
export function scrollSpeedForScore(score) {
    const { baseSpeed, difficulty } = ECHOBAT_CONFIG;
    const { speedStartScore, speedScoreStep, speedStepIncrease, maxSpeed } = difficulty;
    const s = (typeof score === 'number' && !isNaN(score) && isFinite(score)) ? Math.max(0, score) : 0;
    if (s < speedStartScore) return baseSpeed;
    const steps = Math.floor((s - speedStartScore) / speedScoreStep) + 1;
    return Math.min(maxSpeed, baseSpeed + steps * speedStepIncrease);
}
