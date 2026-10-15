import { PieceCanvas } from '../atoms/PieceCanvas.js';
import { TimerBadge } from '../atoms/TimerBadge.js';

export function BlockaPlayer(engine, levelConfig, onWinCallback, onLoseCallback) {
    const container = document.createElement('div');
    container.className = 'blocka-workspace';

    let isGameOver = false;

    // 1. Columna Tablero
    const boardWrapper = document.createElement('div');
    boardWrapper.className = 'blocka-workspace__board-container';

    const board = document.createElement('div');
    const { cols } = engine.getGridConfig ? engine.getGridConfig() : { cols: 2 };


    board.className = `organism-blocka-board organism-blocka-board--${cols}x${cols}`;
    board.dataset.cols = cols;

    boardWrapper.appendChild(board);

    // Función de Derrota
    const renderLoseState = () => {
        isGameOver = true;


        const pieces = engine.getPieces();
        pieces.forEach(p => {
            if (p.canvas) {
                p.canvas.classList.add('blocka-piece--disabled');
            }
        });

        if (onLoseCallback) {
            onLoseCallback({
                time: timerBadgeComponent.getTimeSpentFormatted(),
                moves: movesCount
            });
        }
    };

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

    const timerBadgeComponent = TimerBadge({
        maxTime: levelConfig.maxTime || null,
        onTimeUp: renderLoseState
    });

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

    // Contenedor de Acciones
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'blocka-sidebar__actions';

    const helpBtn = document.createElement('button');
    helpBtn.type = 'button';
    helpBtn.className = 'atom-button atom-button--medium atom-button--primary btn-blocka-help';
    helpBtn.innerHTML = `<span class="icon-svg icon-svg--ayuda"></span> Pedir Ayudita`;

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'atom-button atom-button--medium atom-button--secondary btn-blocka-reset';
    resetBtn.innerHTML = `<img src="../assets/icons/reset.svg" alt="Reiniciar" class="atom-button__icon"><span>Reiniciar Nivel</span>`;

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
                if (isGameOver) return;

                const rotated = engine.rotatePiece(id, direction);
                if (rotated) {
                    movesCount++;
                    updateMovesDisplay();
                    renderBoard();
                    if (engine.isSolved) {
                        isGameOver = true;
                        timerBadgeComponent.stop();
                        renderWinState();
                    }
                }
            });

            // Si el juego está en estado de derrota y volvemos a renderizar,
            // nos aseguramos de que las piezas mantengan su clase deshabilitada.
            if (isGameOver) {
                canvasElem.classList.add('blocka-piece--disabled');
            }

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
                time: timerBadgeComponent.getTimeSpentFormatted(),
                moves: movesCount
            });
        }
    };

    helpBtn.addEventListener('click', () => {
        if (isGameOver) return;

        const pieceId = engine.useHelp();
        if (pieceId !== null) {
            movesCount++;
            timerBadgeComponent.applyPenalty(5);

            if (isGameOver) return;

            updateMovesDisplay();
            renderBoard();

            if (engine.isSolved) {
                isGameOver = true;
                timerBadgeComponent.stop();
                renderWinState();
            }
        }
    });

    resetBtn.addEventListener('click', () => {
        isGameOver = false;
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

    container.destroy = () => {
        timerBadgeComponent.stop(); // Frena el setInterval
    };

    return container;
}