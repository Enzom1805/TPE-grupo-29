import { PegEngine } from '../../engine/PegEngine.js';
import { PegPiece } from '../../engine/PegPiece.js';
import { PEG_THEMES, loadThemeImageSafely } from '../../data/pegThemes.js';

export default function PegBoardCanvas({ onMovePerformed, onGameOver, currentThemeKey = 'batman' }) {
    const container = document.createElement('div');
    container.className = 'peg-board-canvas-container';

    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 480;
    canvas.className = 'peg-board-canvas';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const engine = new PegEngine();

    let currentTheme = PEG_THEMES[currentThemeKey] || PEG_THEMES.batman;
    let themeImage = null;
    let animationId = null;

    loadThemeImageSafely(currentThemeKey, (img) => {
        themeImage = img;
        syncPiecesWithGrid();
    });

    let pieces = [];
    let selectedPiece = null;
    let activeValidMoves = [];
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    const padding = 60; // Margen de seguridad para no chocar con los bordes
    const availableWidth = canvas.width - padding;
    const availableHeight = canvas.height - padding;

    // Calcula el espaciado máximo permitido sin desbordar el canvas
    const cellSpacing = Math.min(
        availableWidth / (engine.cols - 1),
        availableHeight / (engine.rows - 1)
    );

    // Escala la ficha proporcionalmente al tamaño de su celda
    const pegRadius = cellSpacing * 0.38;

    const offsetX = (canvas.width - (engine.cols - 1) * cellSpacing) / 2;
    const offsetY = (canvas.height - (engine.rows - 1) * cellSpacing) / 2;

    function gridToCanvas(col, row) {
        return { x: offsetX + col * cellSpacing, y: offsetY + row * cellSpacing };
    }

    function canvasToGrid(x, y) {
        return {
            col: Math.round((x - offsetX) / cellSpacing),
            row: Math.round((y - offsetY) / cellSpacing)
        };
    }

    function syncPiecesWithGrid() {
        pieces = [];
        for (let r = 0; r < engine.rows; r++) {
            for (let c = 0; c < engine.cols; c++) {
                if (engine.getCell(c, r) === 1) {
                    const pos = gridToCanvas(c, r);
                    pieces.push(new PegPiece(c, r, pos.x, pos.y, pegRadius, themeImage));
                }
            }
        }
    }

    function drawHoles() {
        for (let r = 0; r < engine.rows; r++) {
            for (let c = 0; c < engine.cols; c++) {
                if (engine.getCell(c, r) !== 0) {
                    const pos = gridToCanvas(c, r);
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, pegRadius, 0, Math.PI * 2);
                    ctx.fillStyle = '#15111F';
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#2A2238';
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }

    function drawAnimatedHints() {
        if (!selectedPiece || activeValidMoves.length === 0) return;

        const time = Date.now() * 0.006;
        const pulse = pegRadius * (1 + 0.15 * Math.sin(time * 3));
        const bounceY = Math.sin(time * 4) * 5;

        activeValidMoves.forEach(move => {
            const pos = gridToCanvas(move.toCol, move.toRow);
            ctx.save();
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, pulse, 0, Math.PI * 2);
            ctx.strokeStyle = currentTheme.accentColor;
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 4]);
            ctx.stroke();

            const arrowY = pos.y - pegRadius - 14 + bounceY;
            ctx.fillStyle = currentTheme.accentColor;
            ctx.beginPath();
            ctx.moveTo(pos.x, arrowY + 8);
            ctx.lineTo(pos.x - 7, arrowY);
            ctx.lineTo(pos.x + 7, arrowY);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#211B2C';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawHoles();
        drawAnimatedHints();

        pieces.forEach(p => {
            if (p !== selectedPiece) p.draw(ctx, currentTheme);
        });

        if (selectedPiece) selectedPiece.draw(ctx, currentTheme);

        animationId = requestAnimationFrame(render);
    }

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const scale = Math.min(rect.width / canvas.width, rect.height / canvas.height);
        const drawnWidth = canvas.width * scale;
        const drawnHeight = canvas.height * scale;
        const paddingLeft = (rect.width - drawnWidth) / 2;
        const paddingTop = (rect.height - drawnHeight) / 2;

        const x = (e.clientX - rect.left - paddingLeft) / scale;
        const y = (e.clientY - rect.top - paddingTop) / scale;

        return { x, y };
    }

    function handleMouseDown(e) {
        const pos = getMousePos(e);
        const mx = pos.x;
        const my = pos.y;

        const clicked = pieces.find(p => p.isPointInside(mx, my));
        if (clicked) {
            if (selectedPiece) selectedPiece.isSelected = false;
            selectedPiece = clicked;
            selectedPiece.isSelected = true;
            selectedPiece.isDragging = true;
            isDragging = true;

            dragOffset.x = mx - selectedPiece.x;
            dragOffset.y = my - selectedPiece.y;
            activeValidMoves = engine.getValidMoves(selectedPiece.col, selectedPiece.row);
        } else if (selectedPiece) {
            selectedPiece.isSelected = false;
            selectedPiece = null;
            activeValidMoves = [];
        }
    }

    function handleMouseMove(e) {
        if (isDragging && selectedPiece) {
            const pos = getMousePos(e);
            selectedPiece.x = pos.x - dragOffset.x;
            selectedPiece.y = pos.y - dragOffset.y;
        }
    }

    function handleMouseUp() {
        if (!isDragging || !selectedPiece) return;

        isDragging = false;
        selectedPiece.isDragging = false;

        const targetGrid = canvasToGrid(selectedPiece.x, selectedPiece.y);
        const validMove = activeValidMoves.find(m => m.toCol === targetGrid.col && m.toRow === targetGrid.row);

        if (validMove) {
            engine.executeMove(selectedPiece.col, selectedPiece.row, validMove);
            syncPiecesWithGrid();
            if (onMovePerformed) onMovePerformed();

            if (!engine.hasPossibleMoves()) {
                const remaining = engine.getRemainingPegsCount();
                if (onGameOver) onGameOver({ won: remaining === 1, remainingPegs: remaining });
            }
        } else {
            selectedPiece.x = selectedPiece.originX;
            selectedPiece.y = selectedPiece.originY;
        }

        selectedPiece.isSelected = false;
        selectedPiece = null;
        activeValidMoves = [];
    }

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    animationId = requestAnimationFrame(render);

    container.reset = () => {
        engine.reset();
        syncPiecesWithGrid();
        selectedPiece = null;
        activeValidMoves = [];
    };

    container.destroy = () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
    };

    return container;
}