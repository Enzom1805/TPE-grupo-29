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
    let timeRemaining = 300;
    let timerInterval = null;
    let boardCanvasNode = null;

    // 1. Sidebar de Métricas (Molécula)
    const sidebar = GameMetricsSidebar({
        onReset: () => resetCurrentGame(),
        onBackMenu: () => returnToMenu()
    });

    // 2. Grilla de Juego (Canvas + Sidebar)
    const gameWorkspace = document.createElement('div');
    gameWorkspace.className = 'peg-workspace__content hidden';

    const boardArea = document.createElement('div');
    boardArea.className = 'peg-workspace__board-area';

    gameWorkspace.append(boardArea, sidebar);

    // 3. Menú Inicial (Molécula)
    const menuOverlay = PegMenuOverlay({
        currentThemeKey,
        onSelectTheme: (key) => { currentThemeKey = key; },
        onStartGame: () => startGame()
    });

    container.append(menuOverlay, gameWorkspace);

    function updateTimerDisplay() {
        const mins = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
        const secs = String(timeRemaining % 60).padStart(2, '0');
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
                showResultModal(false, 32 - movesCount, '¡El tiempo límite de la partida ha finalizado!');
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) clearInterval(timerInterval);
    }

    function showResultModal(isVictory, remainingPegs, titleMessage) {
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
        sidebar.updateMoves('0');
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
        if (boardCanvasNode && boardCanvasNode.destroy) boardCanvasNode.destroy();
        gameWorkspace.classList.add('hidden');
        menuOverlay.classList.remove('hidden');
    }

    function launchGame() {
        if (boardCanvasNode && boardCanvasNode.destroy) {
            boardCanvasNode.destroy();
        }

        boardArea.innerHTML = '';
        movesCount = 0;
        sidebar.updateMoves('0');

        const activeTheme = PEG_THEMES[currentThemeKey];
        sidebar.updateTheme(activeTheme.name, activeTheme.accentColor);

        boardCanvasNode = PegBoardCanvas({
            currentThemeKey,
            onMovePerformed: () => {
                movesCount++;
                sidebar.updateMoves(movesCount);
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