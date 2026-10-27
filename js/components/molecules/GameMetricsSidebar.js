import Button from '../atoms/Button.js';
import { StatCard } from '../atoms/StatCard.js';

/**
 * Molécula: GameMetricsSidebar
 * Sidebar lateral utilizando el átomo Button del proyecto.
 */
export function GameMetricsSidebar({ onReset, onBackMenu }) {
    const sidebar = document.createElement('aside');
    sidebar.className = 'peg-sidebar';

    const header = document.createElement('div');
    header.className = 'peg-sidebar__header';

    const title = document.createElement('h3');
    title.className = 'peg-sidebar__title';
    title.textContent = '⚙️ MÉTRICAS DEL JUEGO';
    header.appendChild(title);

    const statsContainer = document.createElement('div');
    statsContainer.className = 'peg-sidebar__stats';

    const movesStat = StatCard({ label: 'MOVIMIENTOS', initialValue: '0', id: 'peg-moves-val' });
    const timerStat = StatCard({ label: 'TIEMPO', initialValue: '05:00', id: 'peg-timer-val' });
    const themeStat = StatCard({ label: 'FICHAS', initialValue: 'Batman', id: 'peg-theme-val' });

    statsContainer.append(movesStat, timerStat, themeStat);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'peg-sidebar__actions';

    // Usamos tu componente Button.js atómico
    const resetBtn = Button('🔄 REINICIAR TABLERO', 'button', 'primary', 'medium');
    resetBtn.addEventListener('click', onReset);

    const menuBtn = Button('⚙️ CAMBIAR FICHAS', 'button', 'secondary', 'medium');
    menuBtn.addEventListener('click', onBackMenu);

    actionsContainer.append(resetBtn, menuBtn);

    sidebar.append(header, statsContainer, actionsContainer);

    sidebar.updateMoves = (count) => movesStat.update(count);
    sidebar.updateTimer = (timeStr) => timerStat.update(timeStr);
    sidebar.updateTheme = (name, color) => themeStat.update(name, color);
    sidebar.getTimerValue = () => timerStat.querySelector('#peg-timer-val').textContent;

    return sidebar;
}