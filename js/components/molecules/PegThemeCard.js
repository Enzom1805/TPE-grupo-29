import { loadThemeImageSafely } from '../../data/pegThemes.js';

/**
 * Molécula: PegThemeCard
 * Tarjeta interactiva para seleccionar la temática de fichas.
 */
export function PegThemeCard({ themeKey, themeData, isSelected, onSelect }) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `peg-theme-card ${isSelected ? 'selected' : ''}`;

    const previewBox = document.createElement('div');
    previewBox.className = 'peg-theme-card__preview';
    previewBox.style.borderColor = themeData.accentColor;

    const previewImg = document.createElement('img');
    previewImg.className = 'peg-theme-card__img';
    previewImg.alt = themeData.name;

    loadThemeImageSafely(themeKey, (loadedImg) => {
        previewImg.src = loadedImg.src;
    });

    previewBox.appendChild(previewImg);

    const label = document.createElement('span');
    label.className = 'peg-theme-card__label';
    label.textContent = themeData.name;

    card.append(previewBox, label);

    card.addEventListener('click', onSelect);

    return card;
}