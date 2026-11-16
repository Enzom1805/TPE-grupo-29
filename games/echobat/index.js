/**
 * Punto de entrada público del módulo EchoBat Game (id 50).
 * Encapsula al EchoBatController: el resto de la app no importa nada interno
 * de este juego. Contrato de integración del GameRegistry:
 *
 *   { id, mount(container) → handle { destroy() } }
 */

import { EchoBatController } from './controller/EchoBatController.js';

export default {
    id: 50,

    /**
     * Monta el juego en el contenedor del viewport.
     * @param {HTMLElement} container
     * @returns {{ destroy: Function }} handle de ciclo de vida.
     */
    mount(container) {
        const controller = new EchoBatController(container);

        const handle = {
            destroy() {
                controller.destroy();
            }
        };

        controller.init();
        return handle;
    }
};
