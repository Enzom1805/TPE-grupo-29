import { assert, assertEquals } from "./assert.js";
import { FilterProcessor } from "../games/blocka/engine/FilterProcessor.js";

function fakeImageData(pixels) {
    // Imita la interfaz ImageData usada por FilterProcessor (solo .data)
    return { data: new Uint8ClampedArray(pixels), width: pixels.length / 4, height: 1 };
}

export default [
    {
        name: "FilterProcessor: applyNegative invierte los canales RGB",
        fn: () => {
            const img = fakeImageData([10, 20, 30, 255, 200, 210, 220, 255]);
            FilterProcessor.applyNegative(img);
            assertEquals([img.data[0], img.data[1], img.data[2]], [245, 235, 225], "píxel 1 invertido");
            assertEquals([img.data[4], img.data[5], img.data[6]], [55, 45, 35], "píxel 2 invertido");
            assertEquals(img.data[3], 255, "alfa intacto");
        }
    },
    {
        name: "FilterProcessor: applyGrayscale vuelve gris según luminancia",
        fn: () => {
            const img = fakeImageData([255, 0, 0, 255]);
            FilterProcessor.applyGrayscale(img);
            const g = img.data[0];
            assert(g > 70 && g < 80, `gris de rojo puro debe ser ~76, obtenido ${g}`);
            assertEquals(img.data[1], g, "G igual a R");
            assertEquals(img.data[2], g, "B igual a R");
        }
    },
    {
        name: "FilterProcessor: applyBrightness multiplica los canales",
        fn: () => {
            const img = fakeImageData([100, 100, 100, 255]);
            FilterProcessor.applyBrightness(img, 2);
            assertEquals(img.data[0], 200, "R duplicado");
            assertEquals(img.data[3], 255, "alfa no se multiplica");
        }
    },
    {
        name: "FilterProcessor: applyOpacity reduce el alfa",
        fn: () => {
            const img = fakeImageData([0, 0, 0, 255]);
            FilterProcessor.applyOpacity(img, 0.5);
            assertEquals(img.data[3], 128, "alfa reducido a la mitad (redondeo de Uint8ClampedArray)");
        }
    }
];
