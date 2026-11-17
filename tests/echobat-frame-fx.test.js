/**
 * Tests del ciclo de vida de las clases de evento del frame (is-hit / is-dashing):
 *  - deben limpiarse solas al terminar su animación, porque si quedan pegadas,
 *    alternar la propiedad `animation` re-reproduce la otra desde 0% (bug:
 *    la pantalla temblaba "sola" al terminar un dash tras un golpe viejo),
 *  - el game over debe disparar siempre que las vidas lleguen a 0.
 *
 * Los timers se reemplazan por un fake manual (patrón fake timers): avanzar el
 * tiempo es sincrónico, sin depender del timing del screenshot headless.
 */

import { assert } from "./assert.js";
import { ECHOBAT_CONFIG } from "../games/echobat/data/config.js";
import { EchoBatController } from "../games/echobat/controller/EchoBatController.js";
import { BatPlayer } from "../games/echobat/engine/BatPlayer.js";

/**
 * Reemplaza setTimeout/clearTimeout globales por un registro manual.
 * Devuelve { advance(ms), restore() }: advance ejecuta los callbacks cuyo
 * delay virtual haya vencido.
 */
function installFakeTimers() {
    const pending = [];
    const realSet = window.setTimeout;
    const realClear = window.clearTimeout;

    window.setTimeout = (fn, ms) => {
        pending.push({ fn, ms, id: Math.random() });
        return pending[pending.length - 1].id;
    };
    window.clearTimeout = (id) => {
        const i = pending.findIndex(p => p.id === id);
        if (i >= 0) pending.splice(i, 1);
    };

    return {
        /** Ejecuta, en orden de programación, los callbacks con delay <= ms. */
        advance(ms) {
            const due = pending.filter(p => p.ms <= ms).sort((a, b) => a.ms - b.ms);
            due.forEach(p => {
                const i = pending.findIndex(q => q.id === p.id);
                if (i >= 0) pending.splice(i, 1);
                p.fn();
            });
        },
        restore() {
            window.setTimeout = realSet;
            window.clearTimeout = realClear;
        }
    };
}

/** Controller real montado en un contenedor DESMONTADO (el harness corre en browser). */
function createController() {
    const container = document.createElement('div');
    const controller = new EchoBatController(container);
    controller.player = new BatPlayer(ECHOBAT_CONFIG.player.x, 200);
    return controller;
}

export default [
    {
        name: "framefx/is-hit: se agrega al perder vida y se limpia sola (350ms)",
        fn: () => {
            const timers = installFakeTimers();
            const controller = createController();
            controller.lives = 3;

            try {
                controller._handleLifeLoss();
                assert(controller.frame.classList.contains('is-hit'),
                    "la clase queda durante la sacudida");

                timers.advance(200);
                assert(controller.frame.classList.contains('is-hit'),
                    "a mitad de la animación sigue (350ms de screenShake)");

                timers.advance(400);
                assert(!controller.frame.classList.contains('is-hit'),
                    "la clase se remueve al terminar (evita replay de screenShake)");
            } finally {
                timers.restore();
                controller.destroy();
            }
        }
    },
    {
        name: "framefx/is-dashing: se limpia sola (450ms) y no deja is-hit residual",
        fn: () => {
            const timers = installFakeTimers();
            const controller = createController();
            controller.dashCharges = 1;

            try {
                controller._triggerDash();
                assert(controller.frame.classList.contains('is-dashing'),
                    "la clase queda durante el destello");

                timers.advance(500);
                assert(!controller.frame.classList.contains('is-dashing'),
                    "la clase se remueve al terminar la animación");
                assert(!controller.frame.classList.contains('is-hit'),
                    "sin is-hit residual que el navegador re-reproduzca");
            } finally {
                timers.restore();
                controller.destroy();
            }
        }
    },
    {
        name: "framefx/golpe-then-dash: tras el dash NO reaparece la sacudida del golpe viejo",
        fn: () => {
            const timers = installFakeTimers();
            const controller = createController();
            controller.lives = 3;

            try {
                // 1. Colisión: tiembla (correcto) y la clase debería limpiarse
                controller._handleLifeLoss();
                assert(controller.frame.classList.contains('is-hit'));

                // 2. Dash antes de que la limpieza avance: is-dashing pisa la animation
                controller.dashCharges = 1;
                controller._triggerDash();

                // 3. Corren AMBOS timeouts (350ms del hit, 450ms del dash)...
                timers.advance(1000);
                assert(!controller.frame.classList.contains('is-hit'));
                assert(!controller.frame.classList.contains('is-dashing'));

                // 4. Estado final limpio: ninguna animación pendiente de re-aplicarse
                assert(controller.frame.className === 'echobat__frame',
                    "el frame queda sin clases de evento residuales");
            } finally {
                timers.restore();
                controller.destroy();
            }
        }
    },
    {
        name: "framefx/gameover: con 1 vida, el golpe la lleva a 0 y TERMINA la partida",
        fn: () => {
            const timers = installFakeTimers();
            const controller = createController();
            controller.lives = 1;

            try {
                controller._handleLifeLoss();
                timers.advance(1000);

                assert(controller.lives <= 0, "las vidas quedaron en 0");
                assert(controller.isRunning === false, "la partida termina");
                assert(controller._gameOverAt !== null, "el período de gracia del cartel quedó armado");
                assert(!controller.overlay.element.classList.contains('is-hidden'),
                    "el cartel de game over es visible");
            } finally {
                timers.restore();
                controller.destroy();
            }
        }
    }
];
