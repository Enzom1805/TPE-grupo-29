import ShareGroup from '../molecules/ShareGroup.js';
import HelpButton from "../molecules/HelpButton.js";
import PegPlayer from './PegPlayer.js';
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

    if (game.id === 2) {
        screen.classList.add('game-frame__screen--batman');
    }

    const title = document.createElement('h2');
    title.className = 'game-frame__title';
    title.textContent = game.title.toUpperCase();

    const boardArea = document.createElement('div');
    boardArea.className = 'game-frame__board-area';

    // =========================================================
    // RENDERIZADO DINÁMICO SEGÚN ID DE JUEGO
    // =========================================================
    if (game.id === 2) {
        // Batman Peg Solitaire (Canvas + HUD + Timer + Hints)
        const pegPlayer = PegPlayer();
        boardArea.appendChild(pegPlayer);

    } else if (game.id === 3) {
        // Blocka Game
        const blockaContainer = document.createElement('div');
        blockaContainer.className = 'blocka-game-frame';
        boardArea.appendChild(blockaContainer);

        const controller = new BlockaController(blockaContainer);
        controller.init();

    } else {
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

    const screenFooter = document.createElement('div');
    screenFooter.className = 'game-frame__footer';

    const shareMolecule = ShareGroup();
    const helpMenu = HelpButton();

    screenFooter.append(shareMolecule, helpMenu);
    screen.append(title, boardArea, screenFooter);
    section.appendChild(screen);

    return section;
}