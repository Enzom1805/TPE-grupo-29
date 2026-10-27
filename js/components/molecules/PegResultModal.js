import Button from '../atoms/Button.js';
import { StatCard } from '../atoms/StatCard.js';

/**
 * Molécula: PegResultModal
 * Modal flotante superpuesto al final de la partida.
 */
export function PegResultModal({ isVictory, remainingPegs, movesCount, timeString, titleMessage, onRetry, onMenu }) {
    const overlay = document.createElement('div');
    overlay.className = 'peg-modal-overlay';

    const card = document.createElement('div');
    card.className = 'peg-modal-card';

    // 1. Encabezado dinámico según Victoria / Derrota
    const header = document.createElement('div');
    header.className = `peg-modal-card__header ${isVictory ? 'peg-modal-card__header--victory' : 'peg-modal-card__header--defeat'}`;

    const title = document.createElement('h2');
    title.className = 'peg-modal-card__title';
    title.textContent = isVictory ? '🏆 ¡VICTORIA MAGISTRAL!' : '🦇 FIN DE LA PARTIDA';
    header.appendChild(title);

    // 2. Cuerpo del Modal con Resumen de Métricas
    const body = document.createElement('div');
    body.className = 'peg-modal-card__body';

    const msg = document.createElement('p');
    msg.className = 'peg-modal-card__msg';
    msg.textContent = titleMessage;

    const summary = document.createElement('div');
    summary.className = 'peg-modal-card__summary';

    const movesStat = StatCard({ label: 'MOVIMIENTOS', initialValue: String(movesCount) });
    const timeStat = StatCard({ label: 'TIEMPO RESTANTE', initialValue: timeString });
    const pegsStat = StatCard({ label: 'FICHAS SOBRANTES', initialValue: String(remainingPegs) });

    summary.append(movesStat, timeStat, pegsStat);
    body.append(msg, summary);

    // 3. Botones de Acción utilizando el Átomo Button.js
    const footer = document.createElement('div');
    footer.className = 'peg-modal-card__footer';

    const retryBtn = Button('🔄 Reintentar', 'button', 'primary', 'medium');
    retryBtn.addEventListener('click', () => {
        overlay.remove();
        onRetry();
    });

    const menuBtn = Button('⚙️ Menú Principal', 'button', 'secondary', 'medium');
    menuBtn.addEventListener('click', () => {
        overlay.remove();
        onMenu();
    });

    footer.append(retryBtn, menuBtn);
    card.append(header, body, footer);
    overlay.appendChild(card);

    return overlay;
}