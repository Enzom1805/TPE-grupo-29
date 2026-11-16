/** Renderiza un lienzo <canvas> individual para una subimagen. Captura eventos click y contextmenu (click derecho). **/

export function PieceCanvas(piece, onRotate) {
    const canvas = document.createElement('canvas');
    canvas.className = 'atom-canvas-piece';

    if (piece.isFixed) {
        canvas.classList.add('atom-canvas-piece--fixed');
    }

    canvas.dataset.pieceId = piece.id;
    canvas.dataset.angle = piece.angle; // Se delega el ángulo al atributo CSS

    canvas.width = piece.width;
    canvas.height = piece.height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(piece.filteredCanvas, 0, 0);

    // Eventos (bloqueados si la pieza está fija)
    canvas.addEventListener('click', (e) => {
        e.preventDefault();
        if (!piece.isFixed) {
            onRotate(piece.id, 'left');
        }
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!piece.isFixed) {
            onRotate(piece.id, 'right');
        }
    });

    return canvas;
}