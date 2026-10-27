/**
 * Clase POO para las fichas del Peg Solitaire en Canvas.
 */
export class PegPiece {
    constructor(col, row, x, y, radius, image) {
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.radius = radius;
        this.image = image;
        this.isDragging = false;
        this.isSelected = false;
    }

    isPointInside(px, py) {
        const dx = px - this.x;
        const dy = py - this.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }

    draw(ctx, themeConfig) {
        ctx.save();

        if (this.isDragging || this.isSelected) {
            ctx.shadowColor = themeConfig.glowColor || 'rgba(252, 211, 77, 0.8)';
            ctx.shadowBlur = 18;
            ctx.shadowOffsetY = 6;
        } else {
            ctx.shadowColor = 'rgba(5, 4, 7, 0.6)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetY = 3;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3,
            this.y - this.radius * 0.3,
            this.radius * 0.1,
            this.x,
            this.y,
            this.radius
        );
        gradient.addColorStop(0, '#C9C5D3');
        gradient.addColorStop(1, '#2A2238');

        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = this.isSelected ? themeConfig.accentColor : '#766F82';
        ctx.stroke();

        if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 0.85, 0, Math.PI * 2);
            ctx.clip();

            const iconSize = this.radius * 1.65;
            ctx.drawImage(
                this.image,
                this.x - iconSize / 2,
                this.y - iconSize / 2,
                iconSize,
                iconSize
            );
            ctx.restore();
        }

        ctx.restore();
    }
}