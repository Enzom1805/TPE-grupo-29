
import { gridLayout } from "../data/pegGrid.js";

/**
 * Motor lógico del Peg Solitaire.
 *
 * Valores de la matriz:
 * 0 = Posición inexistente.
 * 1 = Ficha.
 * 2 = Posición vacía.
 */
export class PegEngine {

    constructor() {
        this.cols = 9;
        this.rows = 7;

        this.initialGrid = [...gridLayout];
        this.grid = [];

        this.reset();
    }

    reset() {
        this.grid = [...this.initialGrid];
    }

    getIndex(col, row) {
        if (
            col < 0 || col >= this.cols ||
            row < 0 || row >= this.rows
        ) {
            return -1;
        }

        return row * this.cols + col;
    }

    getCell(col, row) {
        const idx = this.getIndex(col, row);

        return idx !== -1 ? this.grid[idx] : 0;
    }

    getValidMoves(col, row) {
        if (this.getCell(col, row) !== 1) return [];

        const validMoves = [];

        const directions = [
            { dc: 0, dr: -2, jc: 0, jr: -1 },
            { dc: 0, dr: 2, jc: 0, jr: 1 },
            { dc: -2, dr: 0, jc: -1, jr: 0 },
            { dc: 2, dr: 0, jc: 1, jr: 0 }
        ];

        directions.forEach(dir => {

            const targetCol = col + dir.dc;
            const targetRow = row + dir.dr;

            const jumpedCol = col + dir.jc;
            const jumpedRow = row + dir.jr;

            if (
                this.getCell(jumpedCol, jumpedRow) === 1 &&
                this.getCell(targetCol, targetRow) === 2
            ) {
                validMoves.push({
                    toCol: targetCol,
                    toRow: targetRow,
                    jumpedCol,
                    jumpedRow
                });
            }

        });

        return validMoves;
    }

    executeMove(fromCol, fromRow, move) {
        const fromIdx = this.getIndex(fromCol, fromRow);

        const jumpedIdx = this.getIndex(
            move.jumpedCol,
            move.jumpedRow
        );

        const toIdx = this.getIndex(
            move.toCol,
            move.toRow
        );

        this.grid[fromIdx] = 2;
        this.grid[jumpedIdx] = 2;
        this.grid[toIdx] = 1;
    }

    getRemainingPegsCount() {
        return this.grid.reduce(
            (acc, cell) => acc + (cell === 1 ? 1 : 0),
            0
        );
    }

    hasPossibleMoves() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {

                if (
                    this.getCell(c, r) === 1 &&
                    this.getValidMoves(c, r).length > 0
                ) {
                    return true;
                }

            }
        }

        return false;
    }

    /**
     * Obtiene todos los movimientos inversos posibles.
     *
     * Movimiento normal:
     * 1 ficha + 1 ficha + 1 vacío
     *             ↓
     * 2 vacíos + 1 ficha
     *
     * Movimiento inverso:
     * 2 vacíos + 1 ficha
     *             ↓
     * 1 ficha + 1 ficha + 1 vacío
     *
     * Estos movimientos permiten construir un tablero
     * que sabemos que puede resolverse.
     */
    getReverseMoves(grid) {

        const reverseMoves = [];

        const directions = [
            { dc: 0, dr: -2, jc: 0, jr: -1 },
            { dc: 0, dr: 2, jc: 0, jr: 1 },
            { dc: -2, dr: 0, jc: -1, jr: 0 },
            { dc: 2, dr: 0, jc: 1, jr: 0 }
        ];

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {

                const targetIdx = this.getIndex(col, row);

                // El destino del movimiento normal debe tener ficha.
                if (grid[targetIdx] !== 1) continue;

                directions.forEach(dir => {

                    const fromCol = col + dir.dc;
                    const fromRow = row + dir.dr;

                    const jumpedCol = col + dir.jc;
                    const jumpedRow = row + dir.jr;

                    const fromIdx = this.getIndex(
                        fromCol,
                        fromRow
                    );

                    const jumpedIdx = this.getIndex(
                        jumpedCol,
                        jumpedRow
                    );

                    if (fromIdx === -1 || jumpedIdx === -1) return;

                    // Ambas posiciones deben pertenecer al tablero.
                    if (
                        this.initialGrid[fromIdx] === 0 ||
                        this.initialGrid[jumpedIdx] === 0
                    ) {
                        return;
                    }

                    // Las posiciones de origen y salto deben estar vacías.
                    if (
                        grid[fromIdx] === 2 &&
                        grid[jumpedIdx] === 2
                    ) {
                        reverseMoves.push({
                            fromIdx,
                            jumpedIdx,
                            targetIdx
                        });
                    }

                });

            }
        }

        return reverseMoves;
    }

    /**
     * Reorganiza las fichas existentes conservando su cantidad.
     *
     * Construye una distribución mediante movimientos inversos
     * a partir de una sola ficha.
     *
     * Si encuentra una solución:
     * - Actualiza this.grid.
     * - Devuelve true.
     *
     * Si no encuentra una solución dentro del límite:
     * - Conserva el tablero original.
     * - Devuelve false.
     */
    reorganizeToSolvable() {

        const targetCount = this.getRemainingPegsCount();

        const validPositions = [];

        this.initialGrid.forEach((cell, index) => {
            if (cell !== 0) {
                validPositions.push(index);
            }
        });

        // No hay fichas o hay más fichas que posiciones válidas.
        if (
            targetCount < 1 ||
            targetCount > validPositions.length
        ) {
            return false;
        }

        // Una única ficha ya representa una partida ganada.
        if (targetCount === 1) {
            return true;
        }

        // Aleatoriza el orden de exploración.
        const shuffle = array => {

            const result = [...array];

            for (let i = result.length - 1; i > 0; i--) {

                const j = Math.floor(Math.random() * (i + 1));

                [result[i], result[j]] = [
                    result[j],
                    result[i]
                ];
            }

            return result;
        };

        const visited = new Set();

        let exploredNodes = 0;

        const MAX_NODES = 1000000;

        /**
         * Búsqueda recursiva con retroceso.
         *
         * currentCount indica cuántas fichas contiene
         * actualmente la distribución candidata.
         */
        const search = (grid, currentCount) => {

            // Alcanzamos exactamente la cantidad original.
            if (currentCount === targetCount) {
                return true;
            }

            if (exploredNodes >= MAX_NODES) {
                return false;
            }

            exploredNodes++;

            const stateKey = grid.join('');

            if (visited.has(stateKey)) {
                return false;
            }

            const possibleMoves = shuffle(
                this.getReverseMoves(grid)
            );

            for (const move of possibleMoves) {

                // Ejecutamos el movimiento inverso.
                grid[move.fromIdx] = 1;
                grid[move.jumpedIdx] = 1;
                grid[move.targetIdx] = 2;

                if (search(grid, currentCount + 1)) {
                    return true;
                }

                // Backtracking: deshacemos el movimiento.
                grid[move.fromIdx] = 2;
                grid[move.jumpedIdx] = 2;
                grid[move.targetIdx] = 1;

                if (exploredNodes >= MAX_NODES) {
                    break;
                }
            }

            visited.add(stateKey);

            return false;
        };

        // Probamos diferentes posiciones como punto de partida.
        const startingPositions = shuffle(validPositions);

        for (const startPosition of startingPositions) {

            if (exploredNodes >= MAX_NODES) {
                break;
            }

            // Creamos un tablero vacío.
            const candidateGrid = this.initialGrid.map(
                cell => cell === 0 ? 0 : 2
            );

            // Colocamos una única ficha inicial.
            candidateGrid[startPosition] = 1;

            if (search(candidateGrid, 1)) {

                // Solo modificamos el tablero original
                // cuando encontramos una distribución válida.
                this.grid = candidateGrid;

                return true;
            }
        }

        return false;
    }
}
