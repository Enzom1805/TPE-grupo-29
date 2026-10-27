/**
 * Configuración de temáticas de fichas para Peg Solitaire.
 */
export const PEG_THEMES = {
    batman: {
        id: 'batman',
        name: 'Batman',
        iconPath: '../assets/images/bat.png',
        accentColor: '#FCD34D',
        glowColor: 'rgba(252, 211, 77, 0.8)'
    },
    joker: {
        id: 'joker',
        name: 'Joker',
        iconPath: '../assets/images/joker.png',
        accentColor: '#A78BFA',
        glowColor: 'rgba(167, 139, 250, 0.8)'
    },
    robin: {
        id: 'robin',
        name: 'Red Robin',
        iconPath: '../assets/images/robin.png',
        accentColor: '#EF4444',
        glowColor: 'rgba(239, 68, 68, 0.8)'
    }
};

/**
 * Preprocesador de imágenes: escala la imagen a 120x120px, elimina fondos
 * blancos mediante canal Alfa y aplica máscara circular.
 */
export function loadThemeImageSafely(themeKey, callback) {
    const theme = PEG_THEMES[themeKey] || PEG_THEMES.batman;
    const rawImg = new Image();

    rawImg.onload = () => {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 120;
        offCanvas.height = 120;
        const offCtx = offCanvas.getContext('2d');

        // Recorte circular
        offCtx.beginPath();
        offCtx.arc(60, 60, 58, 0, Math.PI * 2);
        offCtx.clip();

        offCtx.clearRect(0, 0, 120, 120);
        offCtx.drawImage(rawImg, 0, 0, 120, 120);

        // Eliminación de fondos blancos/claros
        try {
            const imgData = offCtx.getImageData(0, 0, 120, 120);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235) {
                    data[i + 3] = 0; // Transparencia completa
                }
            }
            offCtx.putImageData(imgData, 0, 0);
        } catch (e) {
            // Ignorado si hay restricciones locales de CORS
        }

        const cleanImg = new Image();
        cleanImg.src = offCanvas.toDataURL('image/png');
        cleanImg.onload = () => callback(cleanImg);
    };

    rawImg.onerror = () => {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 120;
        offCanvas.height = 120;
        const offCtx = offCanvas.getContext('2d');

        offCtx.fillStyle = theme.accentColor;
        offCtx.beginPath();
        offCtx.arc(60, 60, 56, 0, Math.PI * 2);
        offCtx.fill();

        offCtx.fillStyle = '#15111F';
        offCtx.font = 'bold 48px Inter, sans-serif';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText(theme.name.charAt(0), 60, 64);

        const fallbackImg = new Image();
        fallbackImg.src = offCanvas.toDataURL();
        fallbackImg.onload = () => callback(fallbackImg);
    };

    rawImg.src = theme.iconPath;
}