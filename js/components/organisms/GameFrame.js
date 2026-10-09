import ShareGroup from '../molecules/ShareGroup.js';
import HelpButton from "../molecules/HelpButton.js";
import PegBoard from './PegBoard.js';
import { BlockaController } from '../../controllers/BlockaController.js';

export default function GameFrame(game) {
    if (!game) {
        console.error("GameFrame: No se recibió ningún juego.");
        return document.createElement('div');
    }

    const section = document.createElement('section');
    section.className = 'organism-game-frame';

    const screen = document.createElement('div');
    screen.className = 'game-frame__screen';

    // Modificador temático exclusivamente para el juego de Batman (ID: 2)
    if (game.id === 2) {
        screen.classList.add('game-frame__screen--batman');
    }

    // 1. Título dinámico
    const title = document.createElement('h2');
    title.className = 'game-frame__title';
    title.textContent = game.title.toUpperCase();

    // 2. Área central del juego
    const boardArea = document.createElement('div');
    boardArea.className = 'game-frame__board-area';

    // =========================================================
    // RENDERIZADO SEGÚN EL ID DEL JUEGO
    // =========================================================
    if (game.id === 2) {
        // Batman Peg Solitaire
        const board = PegBoard();
        boardArea.appendChild(board);

    } else if (game.id === 3) {
        // Blocka Game
        const blockaContainer = document.createElement('div');
        blockaContainer.className = 'blocka-game-frame';
        boardArea.appendChild(blockaContainer);

        const controller = new BlockaController(blockaContainer);
        controller.init();

    } else {
        // Placeholder BEM sin código de estilos en JS
        const placeholderContainer = document.createElement('div');
        placeholderContainer.className = 'game-frame__placeholder';

        const placeholderImg = document.createElement('img');
        placeholderImg.className = 'game-frame__placeholder-img';
        placeholderImg.src = game.image;
        placeholderImg.alt = game.title;

        const overlayText = document.createElement('h3');
        overlayText.className = 'game-frame__placeholder-text';
        overlayText.textContent = "Juego no disponible en esta demo";

        placeholderContainer.append(placeholderImg, overlayText);
        boardArea.appendChild(placeholderContainer);
    }

    // 3. Footer de controles
    const screenFooter = document.createElement('div');
    screenFooter.className = 'game-frame__footer';

    const shareMolecule = ShareGroup();
    const helpMenu = HelpButton();

    screenFooter.append(shareMolecule, helpMenu);
    screen.append(title, boardArea, screenFooter);
    section.appendChild(screen);

    return section;
}