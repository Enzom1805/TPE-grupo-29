// js/components/molecules/LevelCompleteModal.js

export function LevelCompleteModal({ levelName, time, moves, isLastLevel, imageUrl, onNextLevel, onMenu }) {
    const overlay = document.createElement('div');
    overlay.className = 'molecules-level-complete-modal';

    const card = document.createElement('div');
    card.className = 'molecules-level-complete-modal__card';

    if (imageUrl) {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'molecules-level-complete-modal__preview';

        const previewImg = document.createElement('img');
        previewImg.className = 'molecules-level-complete-modal__preview-image';
        previewImg.src = imageUrl;
        previewImg.alt = `Resumen de nivel: ${levelName}`;

        previewContainer.appendChild(previewImg);
        card.appendChild(previewContainer);
    }

    const content = document.createElement('div');
    content.className = 'molecules-level-complete-modal__content';

    const title = document.createElement('h3');
    title.className = 'molecules-level-complete-modal__title';
    title.textContent = isLastLevel ? '🎉 ¡Juego Completado!' : '✨ ¡Nivel Completado!';

    const subtitle = document.createElement('p');
    subtitle.className = 'molecules-level-complete-modal__subtitle';
    subtitle.textContent = `Superaste con éxito ${levelName}`;

    const statsContainer = document.createElement('div');
    statsContainer.className = 'molecules-level-complete-modal__stats';

    const timeStat = document.createElement('div');
    timeStat.className = 'molecules-level-complete-modal__stat-item';
    timeStat.innerHTML = `<span class="label">Tiempo</span><span class="value">${time}</span>`;

    const movesStat = document.createElement('div');
    movesStat.className = 'molecules-level-complete-modal__stat-item';
    movesStat.innerHTML = `<span class="label">Movimientos</span><span class="value">${moves}</span>`;

    statsContainer.appendChild(timeStat);
    statsContainer.appendChild(movesStat);

    const actionsGroup = document.createElement('div');
    actionsGroup.className = 'molecules-level-complete-modal__actions';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'atom-button atom-button--medium atom-button--primary';
    nextBtn.textContent = isLastLevel ? 'Volver a Empezar' : 'Siguiente Nivel ➔';
    nextBtn.addEventListener('click', () => {
        overlay.remove();
        if (typeof onNextLevel === 'function') onNextLevel();
    });

    const menuBtn = document.createElement('button');
    menuBtn.type = 'button';
    menuBtn.className = 'atom-button atom-button--medium atom-button--secondary';
    menuBtn.innerHTML = `<span class="icon-svg icon-svg--settings"></span> Cambiar Dificultad`;
    menuBtn.addEventListener('click', () => {
        overlay.remove();
        if (typeof onMenu === 'function') onMenu();
    });

    actionsGroup.appendChild(nextBtn);
    actionsGroup.appendChild(menuBtn);

    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(statsContainer);
    content.appendChild(actionsGroup);

    card.appendChild(content);
    overlay.appendChild(card);

    return overlay;
}