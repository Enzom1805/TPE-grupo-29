/**
 * Clase encargada del motor lógico del juego Peg Solitaire.
 * Controla el mapa del tablero de 33 posiciones y verifica la validez de los saltos.
 */
export class PegEngine {
    constructor() {
        this.cols = 9;
        this.rows = 7;
        // 0 = Fuera del tablero, 1 = Ficha activa, 2 = Hueco vacío
        this.initialGrid = [
            0, 0, 0, 1, 1, 1, 0, 0, 0,
            0, 0, 0, 1, 1, 1, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 0,
            0, 1, 1, 1, 2, 1, 1, 1, 0, // El centro inicia vacío
            0, 1, 1, 1, 1, 1, 1, 1, 0,
            0, 0, 0, 1, 1, 1, 0, 0, 0,
            0, 0, 0, 1, 1, 1, 0, 0, 0
        ];
        this.grid = [];
        this.reset();
    }

    reset() {
        this.grid = [...this.initialGrid];
    }

    getIndex(col, row) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return -1;
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
            { dc: 0, dr: -2, jc: 0, jr: -1 }, // Arriba
            { dc: 0, dr: 2, jc: 0, jr: 1 },   // Abajo
            { dc: -2, dr: 0, jc: -1, jr: 0 }, // Izquierda
            { dc: 2, dr: 0, jc: 1, jr: 0 }    // Derecha
        ];

        directions.forEach(dir => {
            const targetCol = col + dir.dc;
            const targetRow = row + dir.dr;
            const jumpedCol = col + dir.jc;
            const jumpedRow = row + dir.jr;

            if (this.getCell(jumpedCol, jumpedRow) === 1 && this.getCell(targetCol, targetRow) === 2) {
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
        const jumpedIdx = this.getIndex(move.jumpedCol, move.jumpedRow);
        const toIdx = this.getIndex(move.toCol, move.toRow);

        this.grid[fromIdx] = 2;
        this.grid[jumpedIdx] = 2;
        this.grid[toIdx] = 1;
    }

    getRemainingPegsCount() {
        return this.grid.reduce((acc, cell) => acc + (cell === 1 ? 1 : 0), 0);
    }

    hasPossibleMoves() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.getCell(c, r) === 1 && this.getValidMoves(c, r).length > 0) {
                    return true;
                }
            }
        }
        return false;
    }
}