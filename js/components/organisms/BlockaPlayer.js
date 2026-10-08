import { PieceCanvas } from '../atoms/PieceCanvas.js';
import { TimerBadge } from '../atoms/TimerBadge.js';

export function BlockaPlayer(engine, levelConfig, onWinCallback) {
    const container = document.createElement('div');
    container.className = 'blocka-workspace';

    // 1. Columna Tablero
    const boardWrapper = document.createElement('div');
    boardWrapper.className = 'blocka-workspace__board-container';

    const board = document.createElement('div');
    const { cols, rows } = engine.getGridConfig ? engine.getGridConfig() : { cols: 2, rows: 2 };

    board.className = `organism-blocka-board organism-blocka-board--${cols}x${cols}`;
    board.style.setProperty('--grid-cols', cols);
    board.style.setProperty('--grid-rows', rows || cols);
    board.style.setProperty('--grid-size', cols);

    const img = engine.loadedImage || engine.image;
    if (img && img.width && img.height) {
        board.style.setProperty('--board-aspect', `${img.width} / ${img.height}`);
    } else {
        board.style.setProperty('--board-aspect', '16 / 9');
    }

    board.dataset.cols = cols;
    boardWrapper.appendChild(board);

    // 2. Columna Lateral de Métricas
    const metricsSidebar = document.createElement('aside');
    metricsSidebar.className = 'blocka-workspace__sidebar';

    const sidebarHeader = document.createElement('div');
    sidebarHeader.className = 'blocka-sidebar__header';

    const badge = document.createElement('span');
    badge.className = 'blocka-sidebar__badge';
    badge.textContent = levelConfig.name;
    sidebarHeader.appendChild(badge);

    const statsContainer = document.createElement('div');
    statsContainer.className = 'blocka-sidebar__stats';

    const timerBadgeComponent = TimerBadge();

    let movesCount = 0;
    const movesCard = document.createElement('div');
    movesCard.className = 'blocka-stat-card';

    const movesLabel = document.createElement('span');
    movesLabel.className = 'blocka-stat-card__label';
    movesLabel.textContent = 'Movimientos';

    const movesValue = document.createElement('span');
    movesValue.className = 'blocka-stat-card__value';
    movesValue.textContent = '0';

    movesCard.appendChild(movesLabel);
    movesCard.appendChild(movesValue);

    statsContainer.appendChild(timerBadgeComponent.element);
    statsContainer.appendChild(movesCard);

    // Contenedor de Acciones en el Sidebar
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'blocka-sidebar__actions';

    // Botón 1: Pedir Ayudita
    const helpBtn = document.createElement('button');
    helpBtn.type = 'button';
    helpBtn.className = 'atom-button atom-button--medium atom-button--primary btn-blocka-help';
    helpBtn.innerHTML = `<span class="icon-svg icon-svg--ayuda"></span> Pedir Ayudita`;

    // Botón 2: Reiniciar Nivel
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'atom-button atom-button--medium atom-button--secondary btn-blocka-reset';

    const resetIcon = document.createElement('img');
    resetIcon.src = '../assets/icons/reset.svg';
    resetIcon.alt = 'Reiniciar';
    resetIcon.className = 'atom-button__icon';

    const resetText = document.createElement('span');
    resetText.textContent = 'Reiniciar Nivel';

    resetBtn.appendChild(resetIcon);
    resetBtn.appendChild(resetText);

    // Botón 3: Cambiar Dificultad
    const difficultyBtn = document.createElement('button');
    difficultyBtn.type = 'button';
    difficultyBtn.className = 'atom-button atom-button--medium atom-button--secondary btn-blocka-difficulty';
    difficultyBtn.innerHTML = `<span class="icon-svg icon-svg--settings"></span> Cambiar Dificultad`;

    actionsContainer.appendChild(helpBtn);
    actionsContainer.appendChild(resetBtn);
    actionsContainer.appendChild(difficultyBtn);

    metricsSidebar.appendChild(sidebarHeader);
    metricsSidebar.appendChild(statsContainer);
    metricsSidebar.appendChild(actionsContainer);

    const updateMovesDisplay = () => {
        movesValue.textContent = movesCount;
    };

    const renderBoard = () => {
        board.innerHTML = '';
        const pieces = engine.getPieces();

        pieces.forEach(piece => {
            const canvasElem = PieceCanvas(piece, (id, direction) => {
                const rotated = engine.rotatePiece(id, direction);
                if (rotated) {
                    movesCount++;
                    updateMovesDisplay();
                    renderBoard();
                    if (engine.isSolved) {
                        timerBadgeComponent.stop();
                        renderWinState();
                    }
                }
            });
            board.appendChild(canvasElem);
        });
    };

    const renderWinState = () => {
        const pieces = engine.getPieces();
        pieces.forEach(p => {
            p.filteredCanvas = p.originalCanvas;
        });
        renderBoard();
        if (onWinCallback) {
            onWinCallback({
                time: timerBadgeComponent.getTimeFormatted(),
                moves: movesCount
            });
        }
    };

    helpBtn.addEventListener('click', () => {
        const pieceId = engine.useHelp();
        if (pieceId !== null) {
            movesCount++;
            timerBadgeComponent.addSeconds(5);
            updateMovesDisplay();
            renderBoard();
            if (engine.isSolved) {
                timerBadgeComponent.stop();
                renderWinState();
            }
        }
    });

    resetBtn.addEventListener('click', () => {
        engine.createPieces();
        movesCount = 0;
        updateMovesDisplay();
        timerBadgeComponent.reset();
        renderBoard();
    });

    container.appendChild(boardWrapper);
    container.appendChild(metricsSidebar);

    renderBoard();
    timerBadgeComponent.start();

    return container;
}