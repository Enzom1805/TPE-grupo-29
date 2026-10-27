import Button from '../atoms/Button.js';
import { PegThemeCard } from './PegThemeCard.js';
import { PEG_THEMES } from '../../data/pegThemes.js';

/**
 * Molécula: PegMenuOverlay
 * Pantalla inicial de bienvenida y selección de temática.
 */
export function PegMenuOverlay({ currentThemeKey, onSelectTheme, onStartGame }) {
    const overlay = document.createElement('div');
    overlay.className = 'peg-menu-screen';

    const card = document.createElement('div');
    card.className = 'peg-menu-card';

    const title = document.createElement('h2');
    title.className = 'peg-menu-card__title';
    title.textContent = 'BATMAN PEG SOLITAIRE';

    const subtitle = document.createElement('p');
    subtitle.className = 'peg-menu-card__subtitle';
    subtitle.textContent = 'Selecciona tus fichas para comenzar la misión en Gotham:';

    const themesContainer = document.createElement('div');
    themesContainer.className = 'peg-menu-card__themes';

    Object.keys(PEG_THEMES).forEach(key => {
        const themeCard = PegThemeCard({
            themeKey: key,
            themeData: PEG_THEMES[key],
            isSelected: key === currentThemeKey,
            onSelect: () => {
                themesContainer.querySelectorAll('.peg-theme-card').forEach(b => b.classList.remove('selected'));
                themeCard.classList.add('selected');
                onSelectTheme(key);
            }
        });
        themesContainer.appendChild(themeCard);
    });

    // Reutilizamos tu átomo Button.js en tamaño 'large' y variante 'primary'
    const startBtn = Button('🦇 COMENZAR JUEGO', 'button', 'primary', 'large');
    startBtn.addEventListener('click', onStartGame);

    card.append(title, subtitle, themesContainer, startBtn);
    overlay.appendChild(card);

    return overlay;
}