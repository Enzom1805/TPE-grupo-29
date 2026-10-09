import ShareGroup from '../molecules/ShareGroup.js';
import HelpButton from "../molecules/HelpButton.js";
import PegBoard from './PegBoard.js';
import {BlockaPlayer} from "./BlockaPlayer.js";

export default function GameFrame(game) {
    // Validación por seguridad
    if (!game) {
        console.error("GameFrame: No se recibió ningún juego.");
        return document.createElement('div');
    }

    // Contenedor principal de la sección del juego
    const section = document.createElement('section');
    section.className = 'organism-game-frame';

    const screen = document.createElement('div');
    screen.className = 'game-frame__screen';

    // 1. Título DINÁMICO
    const title = document.createElement('h2');
    title.className = 'game-frame__title';
    // Convertimos a mayúsculas para mantener tu diseño original
    title.textContent = game.title.toUpperCase();

    // 2. Contenedor para el tablero
    const boardArea = document.createElement('div');
    boardArea.className = 'game-frame__board-area';

    // =========================================================
    // LÓGICA DINÁMICA: ¿Qué juego renderizamos en la pantalla?
    // =========================================================
    if (game.id === 2) {
        // Es Batman Peg Solitaire: Inyectamos su lógica específica
        const board = PegBoard();
        boardArea.appendChild(board);

    } else if (game.id === 3) {
        // 1. Definir la configuración del nivel
        const levelConfig = { name: "Nivel 1 - Básico" };

        // 2. Instanciar tu motor real de Blocka (necesitarás importarlo arriba)
        // const myBlockaEngine = new BlockaEngine();

        // --> MOCK TEMPORAL: Usa esto para probar que la interfaz carga sin errores
        // mientras conectas tu motor real.
        const mockEngine = {
            getGridConfig: () => ({ cols: 3, rows: 3 }), // Evita el error de getGridConfig
            getPieces: () => [], // Evita errores en renderBoard()
            loadedImage: { width: 800, height: 600 }
        };

        // 3. Inyectar los parámetros requeridos
        const blocka = BlockaPlayer(mockEngine, levelConfig, (resultado) => {
            console.log("¡Juego terminado!", resultado);
        });

        boardArea.appendChild(blocka);

    } else {
        // Para todos los demás juegos de la lista (Sonic, Contra, Doom, etc.)
        // Normalmente aquí iría un iframe con un emulador web, o una imagen.
        // Haremos un placeholder bonito usando la imagen del juego:
        boardArea.style.position = 'relative';
        boardArea.style.overflow = 'hidden';

        const placeholderImg = document.createElement('img');
        placeholderImg.src = game.image;
        placeholderImg.alt = game.title;
        placeholderImg.style.width = '100%';
        placeholderImg.style.height = '100%';
        placeholderImg.style.objectFit = 'cover';
        placeholderImg.style.opacity = '0.3'; // Oscurecemos un poco la imagen

        const overlayText = document.createElement('h3');
        overlayText.textContent = "Juego no disponible en esta demo";
        overlayText.style.position = 'absolute';
        overlayText.style.top = '50%';
        overlayText.style.left = '50%';
        overlayText.style.transform = 'translate(-50%, -50%)';
        overlayText.style.color = 'white';

        boardArea.append(placeholderImg, overlayText);
    }
    // =========================================================
    // 3. Footer interno
    const screenFooter = document.createElement('div');
    screenFooter.className = 'game-frame__footer';

    // Redes sociales y ayuda
    const shareMolecule = ShareGroup();
    const helpMenu = HelpButton();

    screenFooter.append(shareMolecule, helpMenu);

    // Ensamblamos la pantalla
    screen.append(title, boardArea, screenFooter);
    section.appendChild(screen);

    return section;
}