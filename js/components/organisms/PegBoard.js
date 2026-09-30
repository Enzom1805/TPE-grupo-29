import Peg from '../atoms/PegChip.js';
import { gridLayout } from '../../data/pegGrid.js';
export default function PegBoard() {
    const board = document.createElement('div');
    board.className = 'organism-game-board';

    // Mapa lógico del tablero Inglés (33 posiciones)
    // 0 = Fuera del tablero, 1 = Ficha (filled), 2 = Hueco (hole)

    gridLayout.forEach(cellType => {
        if (cellType === 0) {
            // Celda invisible para mantener la estructura de la grilla
            const placeholder = document.createElement('div');
            placeholder.className = 'board__placeholder';
            board.appendChild(placeholder);
        } else if (cellType === 1) {
            board.appendChild(Peg('filled'));
        } else if (cellType === 2) {
            board.appendChild(Peg('hole'));
        }
    });

    return board;
}