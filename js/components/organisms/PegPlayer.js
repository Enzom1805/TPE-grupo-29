
import PegBoardCanvas from './PegBoardCanvas.js';

import { PegMenuOverlay } from '../molecules/PegMenuOverlay.js';
import { GameMetricsSidebar } from '../molecules/GameMetricsSidebar.js';
import { PegResultModal } from '../molecules/PegResultModal.js';

import { PEG_THEMES } from '../../data/pegThemes.js';

export default function PegPlayer() {

    const container = document.createElement('div');

    container.className = 'peg-workspace';

    let currentThemeKey = 'batman';

    let movesCount = 0;
    let remainingPegs = 32;

    let timeRemaining = 300;
    let timerInterval = null;

    let boardCanvasNode = null;

    // 1. Sidebar de métricas.
    const sidebar = GameMetricsSidebar({

        onReset: () => resetCurrentGame(),

        onBackMenu: () => returnToMenu(),

        onHelp: () => reorganizePeg()
    });

    // 2. Workspace del juego.
    const gameWorkspace = document.createElement('div');

    gameWorkspace.className = 'peg-workspace__content hidden';

    const boardArea = document.createElement('div');

    boardArea.className = 'peg-workspace__board-area';

    gameWorkspace.append(boardArea, sidebar);

    // 3. Menú inicial.
    const menuOverlay = PegMenuOverlay({

        currentThemeKey,

        onSelectTheme: (key) => {
            currentThemeKey = key;
        },

        onStartGame: () => startGame()
    });

    container.append(menuOverlay, gameWorkspace);

    function updateTimerDisplay() {

        const mins = String(
            Math.floor(timeRemaining / 60)
        ).padStart(2, '0');

        const secs = String(
            timeRemaining % 60
        ).padStart(2, '0');

        sidebar.updateTimer(`${mins}:${secs}`);
    }

    function startTimer() {

        stopTimer();

        timeRemaining = 300;

        updateTimerDisplay();

        timerInterval = setInterval(() => {

            timeRemaining--;

            updateTimerDisplay();

            if (timeRemaining <= 0) {

                stopTimer();

                showResultModal(
                    false,
                    remainingPegs,
                    '¡El tiempo límite de la partida ha finalizado!'
                );
            }

        }, 1000);
    }

    function stopTimer() {

        if (timerInterval) {

            clearInterval(timerInterval);

            timerInterval = null;
        }
    }

    function showResultModal(
        isVictory,
        remainingPegs,
        titleMessage
    ) {

        const modal = PegResultModal({

            isVictory,

            remainingPegs,

            movesCount,

            timeString: sidebar.getTimerValue(),

            titleMessage,

            onRetry: () => resetCurrentGame(),

            onMenu: () => returnToMenu()
        });

        container.appendChild(modal);
    }

    function resetCurrentGame() {

        movesCount = 0;
        remainingPegs = 32;

        sidebar.updateMoves('0');
        sidebar.updateRemaining(remainingPegs);

        if (boardCanvasNode && boardCanvasNode.reset) {

            boardCanvasNode.reset();

        } else {

            launchGame();

            return;
        }

        startTimer();
    }

    function returnToMenu() {

        stopTimer();

        if (boardCanvasNode && boardCanvasNode.destroy) {
            boardCanvasNode.destroy();
        }

        gameWorkspace.classList.add('hidden');

        menuOverlay.classList.remove('hidden');
    }

    /**
     * NUEVA FUNCIONALIDAD:
     * Solicita al Canvas reorganizar las fichas.
     *
     * No reinicia:
     * - El contador de movimientos.
     * - El temporizador.
     *
     * Conserva:
     * - La cantidad actual de fichas.
     */
    function reorganizePeg() {

        if (
            !boardCanvasNode ||
            typeof boardCanvasNode.reorganize !== 'function'
        ) {
            return;
        }

        const success = boardCanvasNode.reorganize();

        if (!success) {

            console.warn(
                'No se pudo encontrar una distribución resoluble para este tablero.'
            );

            return;
        }

        // Actualizamos la cantidad de fichas.
        remainingPegs = remainingPegs;

        sidebar.updateRemaining(remainingPegs);

        console.info(
            'Tablero reorganizado correctamente.'
        );
    }

    function launchGame() {

        if (boardCanvasNode && boardCanvasNode.destroy) {
            boardCanvasNode.destroy();
        }

        boardArea.innerHTML = '';

        movesCount = 0;
        remainingPegs = 32;

        sidebar.updateMoves('0');
        sidebar.updateRemaining(remainingPegs);

        const activeTheme = PEG_THEMES[currentThemeKey];

        sidebar.updateTheme(
            activeTheme.name,
            activeTheme.accentColor
        );

        boardCanvasNode = PegBoardCanvas({

            currentThemeKey,

            onMovePerformed: (newRemainingPegs) => {

                movesCount++;

                remainingPegs = newRemainingPegs;

                sidebar.updateMoves(movesCount);

                sidebar.updateRemaining(remainingPegs);
            },

            onGameOver: (result) => {

                stopTimer();

                showResultModal(
                    result.won,
                    result.remainingPegs,

                    result.won
                        ? '¡Perfecto! Has completado el acertijo dejando una sola ficha en el tablero.'
                        : 'No quedan más movimientos válidos en el tablero.'
                );
            }
        });

        boardArea.appendChild(boardCanvasNode);

        startTimer();
    }

    function startGame() {

        menuOverlay.classList.add('hidden');

        gameWorkspace.classList.remove('hidden');

        launchGame();
    }

    return container;
}
