/**
 * Servicio de input: teclado (Espacio/↑ = impulso, Shift = ecolocalización)
 * y botones touch opcionales (la entrega no requiere mobile).
 *
 * A diferencia del monolito original, los listeners SON removibles:
 * el controller los desregula en destroy() para no filtrar eventos.
 */
export class InputHandler {
    constructor() {
        this.keys = { jump: false, echolocate: false };
        this._onKeyDown = this._handleKeyDown.bind(this);
        this._buttonBindings = [];
    }

    attach() {
        window.addEventListener('keydown', this._onKeyDown);
        this._bindButtons();
    }

    detach() {
        window.removeEventListener('keydown', this._onKeyDown);
        this._buttonBindings.forEach(({ el, event, handler }) => {
            el.removeEventListener(event, handler);
        });
        this._buttonBindings = [];
    }

    /**
     * Permite conectar botones touch/flap externos (ej: demo standalone).
     * @param {HTMLElement} el
     * @param {'jump'|'echolocate'} action
     */
    bindButton(el, action) {
        if (!el) return;
        const handler = (e) => {
            e.preventDefault();
            this.keys[action] = true;
        };
        el.addEventListener('touchstart', handler);
        el.addEventListener('click', handler);
        this._buttonBindings.push({ el, event: 'touchstart', handler });
        this._buttonBindings.push({ el, event: 'click', handler });
    }

    _handleKeyDown(e) {
        if (e.repeat) return;
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            this.keys.jump = true;
            e.preventDefault();
        }
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'Shift') {
            this.keys.echolocate = true;
            e.preventDefault();
        }
    }

    _bindButtons() {
        // Elementos opcionales del documento (existentes solo en modo standalone)
        const flapBtn = document.getElementById('touch-flap-btn');
        const echoBtn = document.getElementById('touch-echo-btn');
        if (flapBtn) this.bindButton(flapBtn, 'jump');
        if (echoBtn) this.bindButton(echoBtn, 'echolocate');
    }
}
