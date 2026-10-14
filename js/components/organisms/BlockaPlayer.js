import { PieceCanvas } from '../atoms/PieceCanvas.js';
import { TimerBadge } from '../atoms/TimerBadge.js';

export function BlockaPlayer(engine, levelConfig, onWinCallback,onLoseCallback) {
    const container = document.createElement('div');
    container.className = 'blocka-workspace';

    // === NUEVO ESTADO: CONTROL DE GAME OVER ===
    let isGameOver = false;

    // 1. Columna Tablero
    const boardWrapper = document.createElement('div');
    boardWrapper.className = 'blocka-workspace__board-container';

    const board = document.createElement('div');
    const { cols, rows } = engine.getGridConfig ? engine.getGridConfig() : { cols: 2, rows: 2 };

    board.className = `organism-blocka-board organism-blocka-board--${cols}x${cols}`;
    board.style.setProperty('--grid-cols', cols);
    board.style.setProperty('--grid-rows', rows || cols);
    board.style.setProperty('--grid-size', cols);
    // Para que podamos centrar el mensaje de derrota:
    board.style.position = 'relative';

    const img = engine.loadedImage || engine.image;
    if (img && img.width && img.height) {
        board.style.setProperty('--board-aspect', `${img.width} / ${img.height}`);
    } else {
        board.style.setProperty('--board-aspect', '16 / 9');
    }

    board.dataset.cols = cols;
    boardWrapper.appendChild(board);

    // === NUEVO: FUNCIÓN DE DERROTA ===
    const renderLoseState = () => {
        isGameOver = true;

        // Bloqueamos visualmente las piezas para que no parezcan clickeables
        const pieces = engine.getPieces();
        pieces.forEach(p => {
            if (p.canvas) {
                p.canvas.style.opacity = '0.5';
                p.canvas.style.pointerEvents = 'none';
            }
        });

        // Llamamos al controlador pasándole las estadísticas finales
        if (onLoseCallback) {
            onLoseCallback({
                time: timerBadgeComponent.getTimeFormatted(),
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

    // === NUEVO: INSTANCIAMOS EL TIMER PASÁNDOLE CONFIGURACIÓN ===
    const timerBadgeComponent = TimerBadge({
        // Si levelConfig.maxTime existe (ej. 60 segundos), lo usa. Si no, usa null.
        maxTime: levelConfig.maxTime || null,
        // Si el tiempo llega a 0, ejecuta renderLoseState
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

    // Contenedor de Acciones en el Sidebar
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
        // Limpiamos el tablero (si había un overlay de Game Over, se borra aquí)
        board.innerHTML = '';
        const pieces = engine.getPieces();

        pieces.forEach(piece => {
            const canvasElem = PieceCanvas(piece, (id, direction) => {
                // === NUEVO: BLOQUEO DE ROTACIÓN ===
                // Si el juego ya terminó (ganó o perdió), ignoramos el clic
                if (isGameOver) return;

                const rotated = engine.rotatePiece(id, direction);
                if (rotated) {
                    movesCount++;
                    updateMovesDisplay();
                    renderBoard();
                    if (engine.isSolved) {
                        isGameOver = true; // Para bloquear más clics
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
                time: timerBadgeComponent.getTimeSpentFormatted(),
                moves: movesCount
            });
        }
    };

    helpBtn.addEventListener('click', () => {
        if (isGameOver) return; // Bloqueo preventivo

        const pieceId = engine.useHelp();
        if (pieceId !== null) {
            movesCount++;

            // 1. Aplicamos la penalidad (esto puede disparar el Game Over)
            timerBadgeComponent.applyPenalty(5);

            // ==========================================
            // Si la penalidad nos dejó en 0,
            // isGameOver ahora es true. Cortamos la ejecución
            // para no borrar la pantalla negra de derrota.
            // ==========================================
            if (isGameOver) return;

            // Si sobrevivimos, actualizamos la vista normalmente
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
        // === NUEVO: REESTABLECER ESTADO ===
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

    return container;
}