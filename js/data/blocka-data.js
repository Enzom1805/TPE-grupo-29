/** Configuración de niveles, banco de imágenes y filtros **/
/** Meta-información (rutas, filtros por nivel, tiempos límite, id de nivel). **/
/** Justificación UX/UI --> Centraliza la configuración en un único punto sin hardcodear lógica en los componentes. **/
/** Manternibilidad --> Permite modificar la dificultad, agregar niveles o alterar reglas del juego modificando únicamente una estructura de datos JSON/JS.**/


export const BLOCKA_CONFIG = {
    // Banco de imágenes específico de la carpeta blocka
    imageBank: [
        '../assets/images/games/blocka/game_01_zelda.webp',
        '../assets/images/games/blocka/game_02_cyberpunk.webp',
        '../assets/images/games/blocka/game_03_mario.webp',
        '../assets/images/games/blocka/game_04_hollowknight.webp',
        '../assets/images/games/blocka/game_05_minecraft.webp',
        '../assets/images/games/blocka/game_06_godofwar.webp',
    ],

    // Configuración de Niveles (Entregable Punto 4)
    levels: [
        {
            id: 1,
            name: 'Nivel 1: Solo Rotación',
            cols: 2,
            rows: 2,
            filter: 'none'
        },
        {
            id: 2,
            name: 'Nivel 2: Escala de Grises',
            cols: 2,
            rows: 2,
            filter: 'grayscale(100%)'
        },
        {
            id: 3,
            name: 'Nivel 3: Brillo al 30%',
            cols: 3,
            rows: 3,
            filter: 'brightness(30%)'
        },
        {
            id: 4,
            name: 'Nivel 4: Modo Negativo',
            cols: 3,
            rows: 3,
            filter: 'invert(100%)'
        }
    ]
};

/**
 * Selecciona y retorna una imagen aleatoria del banco
 */
export function getRandomImage(bank = BLOCKA_CONFIG.imageBank) {
    const randomIndex = Math.floor(Math.random() * bank.length);
    return bank[randomIndex];
}