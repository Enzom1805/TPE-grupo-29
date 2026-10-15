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
        const { rows, filter } = this.currentLevel;

        // 1. Tamaño cuadrado exacto (1:1) derivado de la altura de la imagen y las filas requeridas
        const pieceSize = Math.floor(this.image.height / rows);

        // 2. Cálculo dinámico de columnas para cubrir todo el ancho de la imagen sin pérdida de píxeles
        const cols = Math.floor(this.image.width / pieceSize);

        // 3. Actualizamos la propiedad cols del nivel actual para que getGridConfig() la exponga al tablero CSS
        this.currentLevel.cols = cols;

        const possibleAngles = [0, 90, 180, 270];
        let id = 0;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const sx = col * pieceSize;
                const sy = row * pieceSize;

                // Canvas con filtro para el gameplay (Cuadrado 1:1)
                const filteredCanvas = document.createElement('canvas');
                filteredCanvas.width = pieceSize;
                filteredCanvas.height = pieceSize;
                const ctx = filteredCanvas.getContext('2d');

                if (filter && filter !== 'none') {
                    ctx.filter = filter;
                }
                ctx.drawImage(this.image, sx, sy, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);

                // Canvas original sin filtro para estado de victoria (Cuadrado 1:1)
                const originalCanvas = document.createElement('canvas');
                originalCanvas.width = pieceSize;
                originalCanvas.height = pieceSize;
                const origCtx = originalCanvas.getContext('2d');
                origCtx.drawImage(this.image, sx, sy, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);

                const randomAngle = possibleAngles[Math.floor(Math.random() * possibleAngles.length)];

                this.pieces.push({
                    id: id++,
                    col,
                    row,
                    width: pieceSize,
                    height: pieceSize,
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