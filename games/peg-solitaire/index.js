/**
 * Punto de entrada público del módulo Batman Peg Solitaire (id 2).
 * Encapsula al PegPlayer: el resto de la app no importa nada interno de este juego.
 */

import PegPlayer from './components/PegPlayer.js';

export default {
    id: 2,

    /**
     * Monta el juego en el contenedor del viewport.
     * @param {HTMLElement} container
     * @returns {HTMLElement} nodo raíz montado (expone destroy()).
     */
    mount(container) {
        const playerNode = PegPlayer();
        container.appendChild(playerNode);
        return playerNode;
    }
};
