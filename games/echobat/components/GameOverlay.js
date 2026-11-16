/**
 * Overlay de inicio / game over del juego.
 * La animación de entrada (overlayEnter) es un @keyframes CSS reactivo al evento.
 */

export function GameOverlay() {
    const element = document.createElement('div');
    element.className = 'echobat__overlay';

    const card = document.createElement('div');
    card.className = 'echobat__overlay-card';

    const icon = document.createElement('div');
    icon.className = 'echobat__overlay-icon';
    icon.textContent = '🦇';

    const title = document.createElement('h2');
    title.className = 'echobat__overlay-title';
    title.textContent = 'ECHOBAT';

    const description = document.createElement('p');
    description.className = 'echobat__overlay-desc';
    description.innerHTML =
        'Navega en la penumbra de la cueva. El murciélago brilla en violeta, ' +
        'pero usá la <strong class="echobat__text-accent">Ecolocalización (SHIFT)</strong> ' +
        'para vislumbrar las estalactitas a distancia.';

    const scoresBox = document.createElement('div');
    scoresBox.className = 'echobat__overlay-scores';

    const bestBlock = document.createElement('div');
    const bestLabel = document.createElement('span');
    bestLabel.className = 'echobat__hud-caption';
    bestLabel.textContent = 'Mejor Puntaje';
    const bestValue = document.createElement('span');
    bestValue.className = 'echobat__overlay-score-value echobat__overlay-score-value--best';
    bestValue.textContent = '0';
    bestBlock.append(bestLabel, bestValue);

    const scoresSeparator = document.createElement('div');
    scoresSeparator.className = 'echobat__hud-separator echobat__hud-separator--tall';

    const lastBlock = document.createElement('div');
    const lastLabel = document.createElement('span');
    lastLabel.className = 'echobat__hud-caption';
    lastLabel.textContent = 'Último Puntaje';
    const lastValue = document.createElement('span');
    lastValue.className = 'echobat__overlay-score-value echobat__overlay-score-value--last';
    lastValue.textContent = '0';
    lastBlock.append(lastLabel, lastValue);

    scoresBox.append(bestBlock, scoresSeparator, lastBlock);

    const startBtn = document.createElement('button');
    startBtn.type = 'button';
    startBtn.className = 'echobat__start-btn';
    const btnIcon = document.createElement('span');
    btnIcon.textContent = '▶';
    const btnText = document.createElement('span');
    btnText.textContent = 'INICIAR VUELO';
    startBtn.append(btnIcon, btnText);

    card.append(icon, title, description, scoresBox, startBtn);
    element.appendChild(card);

    let startCallback = null;
    startBtn.addEventListener('click', () => {
        if (startCallback) startCallback();
    });

    function show() {
        // Animación keyframe de entrada del overlay
        element.classList.remove('is-hidden');
        element.classList.add('is-entering');
    }

    function hide() {
        element.classList.add('is-hidden');
        element.classList.remove('is-entering');
    }

    function onStart(callback) {
        startCallback = callback;
    }

    function setTitle(text) {
        title.textContent = text;
    }

    function setDescription(html) {
        description.innerHTML = html;
    }

    function setScores(best, last) {
        bestValue.textContent = String(best);
        lastValue.textContent = String(last);
    }

    function setButtonText(text) {
        btnText.textContent = text;
    }

    return { element, show, hide, onStart, setTitle, setDescription, setScores, setButtonText };
}
