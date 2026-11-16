/**
 * Punto de entrada público del módulo Blocka Game (id 3).
 * Encapsula al BlockaController: el resto de la app no importa nada interno de este juego.
 */

import { BlockaController } from './controller/BlockaController.js';

export default {
    id: 3,

    /**
     * Monta el juego en el contenedor del viewport.
     * @param {HTMLElement} container
     * @returns {{ destroy: Function }} handle de ciclo de vida.
     */
    mount(container) {
        const controller = new BlockaController(container);

        const handle = {
            destroy() {
                controller.container.innerHTML = '';
            }
        };

        controller.init();
        return handle;
    }
};
