import ShareGroup from '../molecules/ShareGroup.js';
import PegBoard from './PegBoard.js';
export default function GameFrame() {
    // Contenedor principal de la sección del juego
    const section = document.createElement('section');
    section.className = 'organism-game-frame';


    const screen = document.createElement('div');
    screen.className = 'game-frame__screen';

    // 1. Título
    const title = document.createElement('h2');
    title.className = 'game-frame__title';
    title.textContent = 'THE BATMAN PEG SOLITAIRE';

    // 2. Contenedor para el tablero
    const boardArea = document.createElement('div');
    boardArea.className = 'game-frame__board-area';
    // 3. Footer interno
    const screenFooter = document.createElement('div');
    screenFooter.className = 'game-frame__footer';

    //  redes sociales
    const shareMolecule = ShareGroup();
    const board = PegBoard();
    boardArea.appendChild(board);

    // Acá en el futuro podés instanciar y agregar el botón de "Necesitas ayuda?"

    screenFooter.appendChild(shareMolecule);

    // Ensamblamos la pantalla
    screen.append(title, boardArea, screenFooter);
    section.appendChild(screen);

    return section;
}