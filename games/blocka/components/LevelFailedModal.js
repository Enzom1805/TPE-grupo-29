export function LevelFailedModal({ levelName, time, moves, imageUrl, onRetry, onMenu }) {
    const overlay = document.createElement('div');
    overlay.className = 'molecules-level-complete-modal';

    const card = document.createElement('div');
    card.className = 'molecules-level-complete-modal__card';

    if (imageUrl) {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'molecules-level-complete-modal__preview';

        const previewImg = document.createElement('img');
        // Agregamos la clase modificadora "--failed" para aplicar el blur/escala de grises en CSS
        previewImg.className = 'molecules-level-complete-modal__preview-image molecules-level-complete-modal__preview-image--failed';
        previewImg.src = imageUrl;
        previewImg.alt = `Nivel fallido: ${levelName}`;

        previewContainer.appendChild(previewImg);
        card.appendChild(previewContainer);
    }

    const content = document.createElement('div');
    content.className = 'molecules-level-complete-modal__content';

    const title = document.createElement('h3');
    // Agregamos la clase modificadora "--failed" para el color rojo en CSS
    title.className = 'molecules-level-complete-modal__title molecules-level-complete-modal__title--failed';
    title.textContent = '❌ ¡Tiempo Agotado!';

    const subtitle = document.createElement('p');
    subtitle.className = 'molecules-level-complete-modal__subtitle';
    subtitle.textContent = `No lograste resolver ${levelName} a tiempo.`;

    const statsContainer = document.createElement('div');
    statsContainer.className = 'molecules-level-complete-modal__stats';

    const timeStat = document.createElement('div');
    timeStat.className = 'molecules-level-complete-modal__stat-item';
    // Agregamos la clase modificadora "value--failed" al span
    timeStat.innerHTML = `<span class="label">Tiempo</span><span class="value value--failed">${time}</span>`;

    const movesStat = document.createElement('div');
    movesStat.className = 'molecules-level-complete-modal__stat-item';
    movesStat.innerHTML = `<span class="label">Movimientos</span><span class="value">${moves}</span>`;

    statsContainer.appendChild(timeStat);
    statsContainer.appendChild(movesStat);

    const actionsGroup = document.createElement('div');
    actionsGroup.className = 'molecules-level-complete-modal__actions';

    const retryBtn = document.createElement('button');
    retryBtn.type = 'button';
    retryBtn.className = 'atom-button atom-button--medium atom-button--primary';
    retryBtn.textContent = 'Reintentar Nivel ↻';
    retryBtn.addEventListener('click', () => {
        overlay.remove();
        if (typeof onRetry === 'function') onRetry();
    });

    const menuBtn = document.createElement('button');
    menuBtn.type = 'button';
    menuBtn.className = 'atom-button atom-button--medium atom-button--secondary';
    menuBtn.innerHTML = `<span class="icon-svg icon-svg--settings"></span> Cambiar Dificultad`;
    menuBtn.addEventListener('click', () => {
        overlay.remove();
        if (typeof onMenu === 'function') onMenu();
    });

    actionsGroup.appendChild(retryBtn);
    actionsGroup.appendChild(menuBtn);

    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(statsContainer);
    content.appendChild(actionsGroup);

    card.appendChild(content);
    overlay.appendChild(card);

    return overlay;
}