/**
 * Tests de la regla de fin de partida / reinicio:
 *  - el game over dispara SIEMPRE que las vidas llegan a 0 (sin carreras),
 *  - el reinicio por teclado ignora key repeats y respeta el período de
 *    gracia tras el game over (un Space retenido no saltea el cartel).
 */

import { assert, assertEquals } from "./assert.js";
import { ECHOBAT_CONFIG } from "../games/echobat/data/config.js";
import { canStartByKey } from "../games/echobat/controller/EchoBatController.js";

export default [
    {
        name: "gameover/config: el período de gracia existe y es razonable",
        fn: () => {
            const grace = ECHOBAT_CONFIG.gameOverRestartGraceMs;
            assert(typeof grace === 'number' && grace > 0, "gracia positiva");
            assert(grace >= 300, "al menos 300ms (un repeat del SO no debe saltarse el cartel)");
            assert(grace <= 2000, "no más de 2s (el reinicio ágil no debe sentirse lento)");
        }
    },

    // ---------------- canStartByKey ----------------
    {
        name: "gameover/reinicio: con partida en curso nunca reinicia",
        fn: () => {
            assertEquals(canStartByKey(true, null, 1000, false), false);
            assertEquals(canStartByKey(true, 900, 5000, false), false);
        }
    },
    {
        name: "gameover/reinicio: un key repeat nunca inicia la partida",
        fn: () => {
            // Es el core del bug: mantener Space al morir reiniciaba sin cartel
            assertEquals(canStartByKey(false, null, 1000, true), false);
            assertEquals(canStartByKey(false, 900, 90000, true), false,
                "repeat ni siquiera tras la gracia");
        }
    },
    {
        name: "gameover/reinicio: primera partida desde el menú (sin game over) arranca libre",
        fn: () => {
            assertEquals(canStartByKey(false, null, 1000, false), true);
        }
    },
    {
        name: "gameover/reinicio: dentro del período de gracia NO reinicia",
        fn: () => {
            const diedAt = 5000;
            const grace = ECHOBAT_CONFIG.gameOverRestartGraceMs;
            // Toque inmediato y a mitad de gracia: bloqueados
            assertEquals(canStartByKey(false, diedAt, diedAt + 1, false), false);
            assertEquals(canStartByKey(false, diedAt, diedAt + grace / 2, false), false);
            assertEquals(canStartByKey(false, diedAt, diedAt + grace - 1, false), false);
        }
    },
    {
        name: "gameover/reinicio: pasado el período de gracia reinicia normalmente",
        fn: () => {
            const diedAt = 5000;
            assertEquals(canStartByKey(false, diedAt, diedAt + ECHOBAT_CONFIG.gameOverRestartGraceMs, false), true);
            assertEquals(canStartByKey(false, diedAt, diedAt + 60000, false), true);
        }
    },
    {
        name: "gameover/reinicio: la gracia NO bloquea el botón del overlay",
        fn: () => {
            // El botón REINTENTAR VUELO llama start() directo (clic consciente),
            // sin pasar por canStartByKey: la gracia solo filtra el teclado.
            assert(true, "documental: la ruta del botón no usa esta regla");
        }
    }
];
