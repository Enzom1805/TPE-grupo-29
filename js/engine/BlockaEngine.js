/** Logica matematica, Canvas API, corte y manipulacion de pixeles **/

export class BlockaEngine {
    constructor() {
        this.pieces = [];
        this.currentLevel = null;
        this.image = null;
        this.isSolved = false;
    }

    async loadLevel(levelConfig, imageSrc) {
        this.currentLevel = levelConfig;
        this.image = await this.loadImage(imageSrc);
        this.isSolved = false;
        this.createPieces();
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Error al cargar la imagen: ${src}`));
            img.src = src;
        });
    }

    createPieces() {
        this.pieces = [];
        const { cols, rows, filter } = this.currentLevel;
        const pieceWidth = Math.floor(this.image.width / cols);
        const pieceHeight = Math.floor(this.image.height / rows);

        const possibleAngles = [0, 90, 180, 270];
        let id = 0;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const sx = col * pieceWidth;
                const sy = row * pieceHeight;

                // Canvas con filtro para el gameplay
                const filteredCanvas = document.createElement('canvas');
                filteredCanvas.width = pieceWidth;
                filteredCanvas.height = pieceHeight;
                const ctx = filteredCanvas.getContext('2d');

                if (filter && filter !== 'none') {
                    ctx.filter = filter;
                }
                ctx.drawImage(this.image, sx, sy, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

                // Canvas original sin filtro (para mostrar cuando gana)
                const originalCanvas = document.createElement('canvas');
                originalCanvas.width = pieceWidth;
                originalCanvas.height = pieceHeight;
                const origCtx = originalCanvas.getContext('2d');
                origCtx.drawImage(this.image, sx, sy, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

                // Asignar ángulo aleatorio
                const randomAngle = possibleAngles[Math.floor(Math.random() * possibleAngles.length)];

                this.pieces.push({
                    id: id++,
                    col,
                    row,
                    width: pieceWidth,
                    height: pieceHeight,
                    angle: randomAngle,
                    isFixed: false,
                    filteredCanvas,
                    originalCanvas
                });
            }
        }

        // Asegurar que al menos una pieza esté desordenada
        if (this.pieces.every(p => p.angle === 0)) {
            this.pieces[0].angle = 90;
        }

        this.checkSolved();
    }

    rotatePiece(pieceId, direction = 'right') {
        const piece = this.pieces.find(p => p.id === pieceId);
        if (!piece || piece.isFixed || this.isSolved) return false;

        const delta = direction === 'right' ? 90 : -90;
        piece.angle = (piece.angle + delta + 360) % 360;

        this.checkSolved();
        return true;
    }

    useHelp() {
        if (this.isSolved) return null;

        const unfixed = this.pieces.filter(p => !p.isFixed && p.angle !== 0);
        if (unfixed.length === 0) return null;

        const targetPiece = unfixed[Math.floor(Math.random() * unfixed.length)];
        targetPiece.angle = 0;
        targetPiece.isFixed = true;

        this.checkSolved();
        return targetPiece.id;
    }

    checkSolved() {
        this.isSolved = this.pieces.every(p => p.angle === 0);
        return this.isSolved;
    }

    getPieces() {
        return this.pieces;
    }

    getGridConfig() {
        return {
            cols: this.currentLevel.cols,
            rows: this.currentLevel.rows
        };
    }
}