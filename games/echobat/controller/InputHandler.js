/**
 * Servicio de input: teclado (Espacio/↑ = impulso, Shift = ecolocalización,
 * P/Esc = pausa, F = pantalla completa) y bloqueo de scroll sobre el frame.
 *
 * A diferencia del monolito original, los listeners SON removibles:
 * el controller los desregula en destroy() para no filtrar eventos.
 *
 * Las acciones de pausa/fullscreen se exponen como callbacks (no flags):
 * son eventos discretos de UI, no estados de gameplay.
 */
export class InputHandler {
    constructor() {
        this.keys = { jump: false, echolocate: false };
        this._onKeyDown = this._handleKeyDown.bind(this);
        this._buttonBindings = [];
        this._pauseCallback = null;
        this._fullscreenCallback = null;
        this._scrollBindings = [];
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
        this._scrollBindings.forEach(({ el, event, handler }) => {
            el.removeEventListener(event, handler);
        });
        this._scrollBindings = [];
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

    /**
     * Bloquea el scroll de la página sobre el elemento (frame del juego):
     * la rueda del mouse y el gesto touch no desplazan el documento.
     * Requiere { passive: false } para poder preventDefault en wheel.
     * @param {HTMLElement} el
     */
    bindScrollLock(el) {
        if (!el) return;
        const wheelHandler = (e) => e.preventDefault();
        const touchHandler = (e) => e.preventDefault();
        el.addEventListener('wheel', wheelHandler, { passive: false });
        el.addEventListener('touchmove', touchHandler, { passive: false });
        this._scrollBindings.push({ el, event: 'wheel', handler: wheelHandler });
        this._scrollBindings.push({ el, event: 'touchmove', handler: touchHandler });
    }

    /** Callback de pausa (P / Esc). El controller valida el estado de partida. */
    onPause(callback) {
        this._pauseCallback = callback;
    }

    /** Callback de pantalla completa (F o botón ⛶). */
    onFullscreenToggle(callback) {
        this._fullscreenCallback = callback;
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
        if (e.code === 'KeyP' || e.code === 'Escape') {
            if (this._pauseCallback) this._pauseCallback();
        }
        if (e.code === 'KeyF') {
            if (this._fullscreenCallback) this._fullscreenCallback();
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
