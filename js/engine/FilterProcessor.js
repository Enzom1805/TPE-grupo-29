/** Algoritmos puros de filtros (Grayscale, Brightness, Negative) **/

export class FilterProcessor {
    static applyGrayscale(imageData) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = gray;     // R
            data[i + 1] = gray; // G
            data[i + 2] = gray; // B
        }
        return imageData;
    }

    static applyBrightness(imageData, factor = 1.3) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * factor;     // R
            data[i + 1] = data[i + 1] * factor; // G
            data[i + 2] = data[i + 2] * factor; // B
        }
        return imageData;
    }

    static applyNegative(imageData) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];         // R
            data[i + 1] = 255 - data[i + 1]; // G
            data[i + 2] = 255 - data[i + 2]; // B
        }
        return imageData;
    }
}