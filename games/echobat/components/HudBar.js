/**
 * HUD superior del juego (barra de vidas, medidor de sonar, puntaje y tiempo).
 * Componente de UI del juego: construye su DOM y expone setters de estado.
 * Las animaciones keyframe (scorePop) se disparan por clases CSS de evento.
 */

import { ECHOBAT_CONFIG } from '../data/config.js';

export function HudBar() {
    const element = document.createElement('div');
    element.className = 'echobat__hud';

    // --- Panel vidas + sonar ---
    const statusPanel = document.createElement('div');
    statusPanel.className = 'echobat__hud-panel';

    const livesContainer = document.createElement('div');
    livesContainer.className = 'echobat__lives';

    const separator = document.createElement('div');
    separator.className = 'echobat__hud-separator';

    const sonarBlock = document.createElement('div');
    sonarBlock.className = 'echobat__sonar';

    const sonarLabels = document.createElement('div');
    sonarLabels.className = 'echobat__sonar-labels';
    const sonarTitle = document.createElement('span');
    sonarTitle.textContent = 'SONAR ECO';
    const sonarStatus = document.createElement('span');
    sonarStatus.id = 'echobat-sonar-status';
    sonarStatus.textContent = 'LISTO';
    sonarLabels.append(sonarTitle, sonarStatus);

    const sonarTrack = document.createElement('div');
    sonarTrack.className = 'echobat__sonar-track';
    const sonarBar = document.createElement('div');
    sonarBar.className = 'echobat__sonar-bar';
    sonarBar.style.width = '100%';
    sonarTrack.appendChild(sonarBar);

    sonarBlock.append(sonarLabels, sonarTrack);
    statusPanel.append(livesContainer, separator, sonarBlock);

    // --- Panel puntaje + tiempo ---
    const scorePanel = document.createElement('div');
    scorePanel.className = 'echobat__hud-panel echobat__hud-panel--right';

    const scoreBlock = document.createElement('div');
    scoreBlock.className = 'echobat__score';
    const scoreLabel = document.createElement('span');
    scoreLabel.className = 'echobat__hud-caption';
    scoreLabel.textContent = 'Puntaje';
    const scoreValue = document.createElement('span');
    scoreValue.className = 'echobat__score-value';
    scoreValue.textContent = '0';
    scoreBlock.append(scoreLabel, scoreValue);

    const verticalSep = document.createElement('div');
    verticalSep.className = 'echobat__hud-separator echobat__hud-separator--tall';

    const timeBlock = document.createElement('div');
    timeBlock.className = 'echobat__time';
    const timeLabel = document.createElement('span');
    timeLabel.className = 'echobat__hud-caption';
    timeLabel.textContent = 'Tiempo';
    const timeValue = document.createElement('span');
    timeValue.className = 'echobat__time-value';
    timeValue.textContent = '00:00';
    timeBlock.append(timeLabel, timeValue);

    scorePanel.append(scoreBlock, verticalSep, timeBlock);
    element.append(statusPanel, scorePanel);

    let lastScore = -1;

    function setLives(lives) {
        const maxLives = ECHOBAT_CONFIG.lives;
        livesContainer.innerHTML = '';
        for (let i = 0; i < maxLives; i++) {
            const heart = document.createElement('span');
            heart.className = i < lives
                ? 'echobat__heart echobat__heart--full'
                : 'echobat__heart echobat__heart--lost';
            heart.textContent = '♥';
            livesContainer.appendChild(heart);
        }
    }

    function setScore(score) {
        scoreValue.textContent = String(score);
        if (lastScore >= 0 && score > lastScore) {
            // Animación keyframe reactiva al evento "sumar puntaje"
            scoreValue.classList.remove('is-pop');
            // Fuerza reflow para reiniciar la animación
            void scoreValue.offsetWidth;
            scoreValue.classList.add('is-pop');
        }
        lastScore = score;
    }

    function setTime(totalSeconds) {
        const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        timeValue.textContent = `${mins}:${secs}`;
    }

    function setSonar(cooldownFrames, maxCooldownFrames) {
        const ratio = 1 - (cooldownFrames / maxCooldownFrames);
        const pct = Math.max(0, Math.min(100, ratio * 100));
        sonarBar.style.width = `${pct}%`;

        if (pct >= 100) {
            sonarStatus.textContent = 'LISTO';
            sonarStatus.className = 'echobat__sonar-status echobat__sonar-status--ready';
        } else {
            sonarStatus.textContent = 'RECARGANDO';
            sonarStatus.className = 'echobat__sonar-status echobat__sonar-status--charging';
        }
    }

    return { element, setLives, setScore, setTime, setSonar };
}
