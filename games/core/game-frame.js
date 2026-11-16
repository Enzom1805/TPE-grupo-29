import ShareGroup from '../../shared/ui/molecules/ShareGroup.js';
import HelpButton from "../../shared/ui/molecules/HelpButton.js";
import { getGameById } from '../index.js';

/**
 * Viewport único de juegos: resuelve dinámicamente qué jugar según el id del
 * catálogo y delega en el contrato público del juego registrado
 * (games/index.js → GameRegistry). No conoce implementaciones internas.
 */
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
    // INYECCIÓN DINÁMICA SEGÚN EL REGISTRO DE JUEGOS
    // =========================================================
    const gameEntry = getGameById(game.id);

    if (gameEntry) {
        gameEntry.mount(boardArea);

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
