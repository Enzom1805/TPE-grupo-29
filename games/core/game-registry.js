/**
 * GameRegistry: infraestructura central de registro de juegos.
 *
 * Cada juego expone un punto de entrada público (games/<juego>/index.js) con el
 * contrato de integración:
 *
 *   {
 *     id: number,                    // id del catálogo (game.html?id=N)
 *     mount: (container) => node,    // monta el juego en el contenedor del viewport
 *     destroy?: () => void           // limpieza de eventos, timers y recursos
 *   }
 *
 * El viewport (games/core/game-frame.js) solo conoce este contrato, nunca las
 * implementaciones internas de cada juego.
 */

const registry = new Map();

/**
 * Registra un juego. Falla en consola si el id está duplicado.
 * @param {{ id: number, mount: Function, destroy?: Function }} entry
 */
export function registerGame(entry) {
    if (!entry || typeof entry.id !== 'number' || typeof entry.mount !== 'function') {
        console.error('GameRegistry: entrada inválida, se ignora.', entry);
        return false;
    }
    if (registry.has(entry.id)) {
        console.error(`GameRegistry: el id ${entry.id} ya está registrado.`, entry);
        return false;
    }
    registry.set(entry.id, entry);
    return true;
}

/**
 * Devuelve la entrada de integración del juego con ese id, o undefined.
 * @param {number} id
 */
export function getGameById(id) {
    return registry.get(id);
}

/** Lista de ids registrados (para depuración / futura descubribilidad). */
export function getRegisteredGameIds() {
    return [...registry.keys()];
}
