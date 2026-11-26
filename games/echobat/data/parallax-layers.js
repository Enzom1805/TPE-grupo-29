/**
 * Capas del fondo parallax de EchoBat (datos puros + loader cacheado).
 *
 * Las 4 capas se generan offline con `tools/build-parallax-layers.py` a partir
 * de las 7 imágenes fuente (cave-1.png .. cave-7.png):
 *
 *   capa 1 = cave-1 + cave-2   (fondo)
 *   capa 2 = cave-3 + cave-4
 *   capa 3 = cave-5 + cave-6
 *   capa 4 = cave-7            (frente)
 *
 * Cada capa es un PNG de 1600x900 (2x del canvas lógico 800x450). Las imágenes
 * de un mismo grupo comparten offset: pre-componerlas evita que se desalineen
 * entre sí y reduce draws/memoria en runtime.
 *
 * Los ratios de velocidad viven en `ECHOBAT_CONFIG.parallax.speedRatios`.
 */

const LAYER_COUNT = 4;

/** URLs de las 4 capas, resueltas relativas a este módulo. */
export const PARALLAX_LAYER_URLS = Array.from({ length: LAYER_COUNT }, (_, index) => {
    const number = index + 1;
    return new URL(`../assets/images/parallax/parallax-layer-${number}.png`, import.meta.url).href;
});

/**
 * Carga (lazy, cacheada) las 4 imágenes del fondo.
 * Resuelve con los `HTMLImageElement` en orden de capa (fondo → frente).
 * Si una falla, rechaza; el engine mantiene el fallback oscuro.
 *
 * @param {() => HTMLImageElement} [createImage] factory inyectable (tests)
 * @returns {Promise<HTMLImageElement[]>}
 */
export function loadParallaxLayers(createImage = () => new Image()) {
    if (!loadParallaxLayers._promise) {
        const loads = PARALLAX_LAYER_URLS.map((url) => new Promise((resolve, reject) => {
            const img = createImage();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', () => reject(new Error(`No se pudo cargar la capa parallax: ${url}`)));
            img.src = url;
        }));

        loadParallaxLayers._promise = Promise.all(loads);
    }

    return loadParallaxLayers._promise;
}
