
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

    /**
     * Obtiene todos los movimientos válidos de una ficha.
     *
     * Permite:
     * - Saltar sobre una ficha.
     * - Saltar sobre dos fichas consecutivas.
     *
     * El destino debe estar vacío.
     */
    getValidMoves(col, row) {

        if (this.getCell(col, row) !== 1) return [];

        const validMoves = [];

        const directions = [
            { dc: 0, dr: -1 },
            { dc: 0, dr: 1 },
            { dc: -1, dr: 0 },
            { dc: 1, dr: 0 }
        ];

        // Máxima cantidad de fichas que podemos saltar.
        const MAX_JUMPED_PEGS = 2;

        directions.forEach(dir => {

            // Probamos saltar una o dos fichas.
            for (
                let jumpedCount = 1;
                jumpedCount <= MAX_JUMPED_PEGS;
                jumpedCount++
            ) {

                const targetCol = col + dir.dc * (jumpedCount + 1);
                const targetRow = row + dir.dr * (jumpedCount + 1);

                const jumpedPositions = [];

                let pathIsValid = true;

                // Comprobamos todas las posiciones intermedias.
                for (let step = 1; step <= jumpedCount; step++) {

                    const jumpedCol = col + dir.dc * step;
                    const jumpedRow = row + dir.dr * step;

                    if (this.getCell(jumpedCol, jumpedRow) !== 1) {
                        pathIsValid = false;
                        break;
                    }

                    jumpedPositions.push({
                        col: jumpedCol,
                        row: jumpedRow
                    });
                }

                if (!pathIsValid) continue;

                // El destino debe estar vacío.
                if (this.getCell(targetCol, targetRow) !== 2) {
                    continue;
                }

                validMoves.push({
                    toCol: targetCol,
                    toRow: targetRow,

                    jumpedPositions,

                    jumpedCount
                });
            }

        });

        return validMoves;
    }

    /**
     * Ejecuta un movimiento y elimina todas las fichas saltadas.
     */
    executeMove(fromCol, fromRow, move) {

        const fromIdx = this.getIndex(fromCol, fromRow);

        const toIdx = this.getIndex(
            move.toCol,
            move.toRow
        );

        if (fromIdx === -1 || toIdx === -1) {
            return false;
        }

        if (
            this.grid[fromIdx] !== 1 ||
            this.grid[toIdx] !== 2
        ) {
            return false;
        }

        if (
            !Array.isArray(move.jumpedPositions) ||
            move.jumpedPositions.length < 1 ||
            move.jumpedPositions.length > 2
        ) {
            return false;
        }

        // Verificamos que todas las fichas intermedias existan.
        const jumpedIndexes = move.jumpedPositions.map(position =>
            this.getIndex(position.col, position.row)
        );

        if (
            jumpedIndexes.some(index =>
                index === -1 || this.grid[index] !== 1
            )
        ) {
            return false;
        }

        // Eliminamos la ficha de origen.
        this.grid[fromIdx] = 2;

        // Eliminamos todas las fichas saltadas.
        jumpedIndexes.forEach(index => {
            this.grid[index] = 2;
        });

        // Colocamos la ficha en el destino.
        this.grid[toIdx] = 1;

        return true;
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
     * Obtiene movimientos inversos para la reorganización.
     *
     * IMPORTANTE:
     * Esta implementación conserva la lógica original
     * de movimientos inversos de una ficha.
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

                if (grid[targetIdx] !== 1) continue;

                directions.forEach(dir => {

                    const fromIdx = this.getIndex(
                        col + dir.dc,
                        row + dir.dr
                    );

                    const jumpedIdx = this.getIndex(
                        col + dir.jc,
                        row + dir.jr
                    );

                    if (fromIdx === -1 || jumpedIdx === -1) return;

                    if (
                        this.initialGrid[fromIdx] === 0 ||
                        this.initialGrid[jumpedIdx] === 0
                    ) {
                        return;
                    }

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
     * Reorganiza las fichas conservando su cantidad.
     */
    reorganizeToSolvable() {

        const targetCount = this.getRemainingPegsCount();

        const validPositions = [];

        this.initialGrid.forEach((cell, index) => {
            if (cell !== 0) validPositions.push(index);
        });

        if (
            targetCount < 1 ||
            targetCount > validPositions.length
        ) {
            return false;
        }

        if (targetCount === 1) return true;

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

        const search = (grid, currentCount) => {

            if (currentCount === targetCount) return true;

            if (exploredNodes >= MAX_NODES) return false;

            exploredNodes++;

            const stateKey = grid.join('');

            if (visited.has(stateKey)) return false;

            const possibleMoves = shuffle(
                this.getReverseMoves(grid)
            );

            for (const move of possibleMoves) {

                grid[move.fromIdx] = 1;
                grid[move.jumpedIdx] = 1;
                grid[move.targetIdx] = 2;

                if (search(grid, currentCount + 1)) {
                    return true;
                }

                grid[move.fromIdx] = 2;
                grid[move.jumpedIdx] = 2;
                grid[move.targetIdx] = 1;

                if (exploredNodes >= MAX_NODES) break;
            }

            visited.add(stateKey);

            return false;
        };

        const startingPositions = shuffle(validPositions);

        for (const startPosition of startingPositions) {

            if (exploredNodes >= MAX_NODES) break;

            const candidateGrid = this.initialGrid.map(
                cell => cell === 0 ? 0 : 2
            );

            candidateGrid[startPosition] = 1;

            if (search(candidateGrid, 1)) {

                this.grid = candidateGrid;

                return true;
            }
        }

        return false;
    }
}
