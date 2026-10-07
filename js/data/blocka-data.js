/** Configuración de niveles, banco de imágenes y filtros **/
/** Meta-información (rutas, filtros por nivel, tiempos límite, id de nivel). **/
/** Justificación UX/UI --> Centraliza la configuración en un único punto sin hardcodear lógica en los componentes. **/
/** Manternibilidad --> Permite modificar la dificultad, agregar niveles o alterar reglas del juego modificando únicamente una estructura de datos JSON/JS.**/

export const BLOCKA_CONFIG = {
    imageBank: [
        './assets/images/games/blocka/landscape_01.webp',
        './assets/images/games/blocka/landscape_02.webp',
        './assets/images/games/blocka/abstract_01.webp',
        './assets/images/games/blocka/art_01.webp',
        './assets/images/games/blocka/nature_01.webp',
        './assets/images/games/blocka/city_01.webp'
    ],
    levels: [
        {
            levelNumber: 1,
            piecesCount: 4,
            filter: 'grayscale',
            maxTimeSeconds: null // Sin límite de tiempo
        },
        {
            levelNumber: 2,
            piecesCount: 4,
            filter: 'brightness',
            maxTimeSeconds: 120
        },
        {
            levelNumber: 3,
            piecesCount: 6,
            filter: 'negative',
            maxTimeSeconds: 90
        },
        {
            levelNumber: 4,
            piecesCount: 8,
            filter: 'mixed', // Filtro distinto por pieza
            maxTimeSeconds: 60
        }
    ]
};