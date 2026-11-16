// js/components/molecules/LevelSelectorModal.js

export function LevelSelectorModal({ levels, currentLevelIndex, onSelectLevel, onClose }) {
    const overlay = document.createElement('div');
    overlay.className = 'molecules-level-complete-modal';

    const card = document.createElement('div');
    card.className = 'molecules-level-selector-modal__card';

    const header = document.createElement('div');
    header.className = 'molecules-level-selector-modal__header';

    const icon = document.createElement('span');
    icon.className = 'icon-svg icon-svg--settings';

    const title = document.createElement('h3');
    title.className = 'molecules-level-complete-modal__title';
    title.textContent = 'Selección de Dificultad';

    header.appendChild(icon);
    header.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'molecules-level-complete-modal__subtitle';
    subtitle.textContent = 'Selecciona el nivel que deseas aplicar a la imagen actual:';

    const list = document.createElement('div');
    list.className = 'molecules-level-selector-modal__list';

    levels.forEach((lvl, index) => {
        const item = document.createElement('button');
        item.type = 'button';
        const isActive = index === currentLevelIndex;
        item.className = `molecules-level-selector-modal__item ${isActive ? 'molecules-level-selector-modal__item--active' : ''}`;

        item.innerHTML = `
            <div class="level-info">
                <span class="level-title">${lvl.name}</span>
                <span class="level-desc">${lvl.description || 'Desafío de piezas rotativas'}</span>
            </div>
            <span class="level-badge">${lvl.gridSize ? `${lvl.gridSize}x${lvl.gridSize}` : 'Nivel'}</span>
        `;

        item.addEventListener('click', () => {
            overlay.remove();
            onSelectLevel(index);
        });

        list.appendChild(item);
    });

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'atom-button atom-button--medium atom-button--secondary molecules-level-selector-modal__cancel-btn';
    closeBtn.textContent = 'Cancelar';
    closeBtn.addEventListener('click', () => {
        overlay.remove();
        if (typeof onClose === 'function') onClose();
    });

    card.appendChild(header);
    card.appendChild(subtitle);
    card.appendChild(list);
    card.appendChild(closeBtn);
    overlay.appendChild(card);

    return overlay;
}