/**
 * Tests de las mejoras de UX:
 *  - curva de velocidad progresiva según puntaje (función pura),
 *  - input de pausa (P/Esc) y pantalla completa (F) vía callbacks,
 *  - bloqueo de scroll (wheel/touchmove) sobre el frame del juego.
 */

import { assert, assertEquals } from "./assert.js";
import { ECHOBAT_CONFIG, scrollSpeedForScore } from "../games/echobat/data/config.js";
import { InputHandler } from "../games/echobat/controller/InputHandler.js";

/** Evento de teclado falso (sin DOM). */
function fakeKey(code, { repeat = false } = {}) {
    return { code, repeat, preventDefault() { this.prevented = true; } };
}

/** Elemento falso que registra los listeners agregados/removidos. */
function fakeElement() {
    const listeners = [];
    return {
        listeners,
        addEventListener(event, handler, opts) { listeners.push({ event, handler, opts }); },
        removeEventListener(event, handler) {
            const i = listeners.findIndex(l => l.event === event && l.handler === handler);
            if (i >= 0) listeners.splice(i, 1);
        }
    };
}

export default [
    // ---------------- Curva de velocidad (función pura) ----------------
    {
        name: "speed/curva: velocidad base por debajo del umbral de arranque",
        fn: () => {
            const { baseSpeed, difficulty } = ECHOBAT_CONFIG;
            assertEquals(scrollSpeedForScore(0), baseSpeed);
            const pre = Math.max(0, difficulty.speedStartScore - 1);
            assertEquals(scrollSpeedForScore(pre), baseSpeed);
        }
    },
    {
        name: "speed/curva: sube el primer escalón justo en el umbral",
        fn: () => {
            const { baseSpeed, difficulty } = ECHOBAT_CONFIG;
            const expected = baseSpeed + difficulty.speedStepIncrease;
            assertEquals(scrollSpeedForScore(difficulty.speedStartScore), expected);
            // Dentro del primer tramo (antes del 2º escalón) queda constante
            const mid = difficulty.speedStartScore + difficulty.speedScoreStep - 1;
            assertEquals(scrollSpeedForScore(mid), expected, "constante dentro del tramo");
        }
    },
    {
        name: "speed/curva: es monótona creciente y sube por escalones",
        fn: () => {
            let prev = scrollSpeedForScore(0);
            for (let s = 10; s <= 1200; s += 10) {
                const v = scrollSpeedForScore(s);
                assert(v >= prev, `debe ser no decreciente en ${s}`);
                prev = v;
            }
        }
    },
    {
        name: "speed/curva: nunca supera el tope maxSpeed",
        fn: () => {
            const { difficulty } = ECHOBAT_CONFIG;
            assertEquals(scrollSpeedForScore(100000), difficulty.maxSpeed);
            assertEquals(scrollSpeedForScore(999999), difficulty.maxSpeed);
            for (let s = 0; s <= 3000; s += 37) {
                const v = scrollSpeedForScore(s);
                assert(v <= difficulty.maxSpeed + 1e-9, `tope violado en ${s}: ${v}`);
            }
        }
    },
    {
        name: "speed/curva: tolera entradas basura (NaN, negativos)",
        fn: () => {
            const { baseSpeed } = ECHOBAT_CONFIG;
            assertEquals(scrollSpeedForScore(NaN), baseSpeed);
            assertEquals(scrollSpeedForScore(Infinity), baseSpeed);
            assertEquals(scrollSpeedForScore(-50), baseSpeed);
        }
    },
    {
        name: "speed/curva: el primer escalón ocurre después del tope del hueco",
        fn: () => {
            // Diseño: el jugador aprende con hueco estrechándose ANTES de que
            // la velocidad empiece a subir (hueco se achica cada 60 pts).
            assert(ECHOBAT_CONFIG.difficulty.speedStartScore >= ECHOBAT_CONFIG.difficulty.gapScoreStep,
                "la velocidad debe empezar a subir después (o al mismo tiempo) que el hueco");
        }
    },

    // ---------------- Input: pausa y pantalla completa ----------------
    {
        name: "input/pausa: KeyP dispara el callback de pausa",
        fn: () => {
            const input = new InputHandler();
            let calls = 0;
            input.onPause(() => calls++);
            input._handleKeyDown(fakeKey('KeyP'));
            assertEquals(calls, 1);
        }
    },
    {
        name: "input/pausa: Escape también dispara el callback",
        fn: () => {
            const input = new InputHandler();
            let calls = 0;
            input.onPause(() => calls++);
            input._handleKeyDown(fakeKey('Escape'));
            assertEquals(calls, 1);
        }
    },
    {
        name: "input/pausa: key repeat NO vuelve a disparar la pausa",
        fn: () => {
            const input = new InputHandler();
            let calls = 0;
            input.onPause(() => calls++);
            input._handleKeyDown(fakeKey('KeyP', { repeat: true }));
            assertEquals(calls, 0, "e.repeat debe ignorarse");
        }
    },
    {
        name: "input/fullscreen: KeyF dispara el callback de pantalla completa",
        fn: () => {
            const input = new InputHandler();
            let calls = 0;
            input.onFullscreenToggle(() => calls++);
            input._handleKeyDown(fakeKey('KeyF'));
            assertEquals(calls, 1);
        }
    },
    {
        name: "input/pausa: sin callback registrado no lanza errores",
        fn: () => {
            const input = new InputHandler();
            input._handleKeyDown(fakeKey('KeyP'));
            input._handleKeyDown(fakeKey('KeyF'));
            assert(true); // llegó sin excepción
        }
    },

    // ---------------- Bloqueo de scroll ----------------
    {
        name: "input/scroll: wheel y touchmove se registran con passive:false",
        fn: () => {
            const input = new InputHandler();
            const el = fakeElement();
            input.bindScrollLock(el);
            assertEquals(el.listeners.length, 2);
            const wheel = el.listeners.find(l => l.event === 'wheel');
            const touch = el.listeners.find(l => l.event === 'touchmove');
            assert(wheel && wheel.opts && wheel.opts.passive === false,
                "wheel requiere passive:false para poder preventDefault");
            assert(touch && touch.opts && touch.opts.passive === false);
        }
    },
    {
        name: "input/scroll: detach() libera los listeners de scroll",
        fn: () => {
            const input = new InputHandler();
            const el = fakeElement();
            input.bindScrollLock(el);
            assertEquals(el.listeners.length, 2);
            input.detach();
            assertEquals(el.listeners.length, 0, "sin fugas de listeners");
        }
    },
    {
        name: "input/scroll: bindScrollLock(null) es inofensivo",
        fn: () => {
            const input = new InputHandler();
            input.bindScrollLock(null);
            assert(true); // llegó sin excepción
        }
    }
];
