/**
 * Capa de pausa del juego (P / Esc). Independiente del GameOverlay:
 * es un estado transitorio de gameplay, no de inicio/fin de partida.
 * La animación de entrada reutiliza el keyframe overlayEnter (evento CSS).
 */

export function PauseOverlay() {
    const element = document.createElement('div');
    element.className = 'echobat__pause echobat__pause--hidden';

    const card = document.createElement('div');
    card.className = 'echobat__pause-card';

    const icon = document.createElement('div');
    icon.className = 'echobat__pause-icon';
    icon.textContent = '⏸';

    const title = document.createElement('h2');
    title.className = 'echobat__pause-title';
    title.textContent = 'PAUSA';

    const hint = document.createElement('p');
    hint.className = 'echobat__pause-hint';
    hint.innerHTML = 'Presioná <kbd class="echobat__hint-key">P</kbd> o ' +
        '<kbd class="echobat__hint-key">ESC</kbd> para continuar el vuelo';

    card.append(icon, title, hint);
    element.appendChild(card);

    function show() {
        element.classList.remove('echobat__pause--hidden');
        // Reinicia la animación de entrada aunque se pause dos veces seguidas
        element.classList.remove('is-entering');
        void element.offsetWidth;
        element.classList.add('is-entering');
    }

    function hide() {
        element.classList.add('echobat__pause--hidden');
        element.classList.remove('is-entering');
    }

    return { element, show, hide };
}
