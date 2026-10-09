export const gameInstructions = {
    2: {
        gameId: 2,
        intro: "¡Pon a prueba tu ingenio con un clásico juego de estrategia donde cada movimiento cuenta! Tu objetivo será eliminar las fichas del tablero realizando saltos sobre las fichas adyacentes, hasta conseguir que quede una sola ficha.",
        description: "La mecánica es sencilla, pero requiere planificación. Deberás mover una ficha saltando por encima de otra hacia una casilla vacía; la ficha saltada desaparecerá.",
        highlight: "¡Piensa tus movimientos con anticipación para no quedarte sin opciones!",
        subtitle: "¿Cuáles son las características principales?",
        features: [
            "Salta sobre las fichas adyacentes para eliminarlas.",
            "Planifica tus movimientos para evitar quedarte bloqueado.",
            "Intenta terminar el tablero con una única ficha.",
            "Utiliza estratégicamente los espacios libres y la zona central."
        ],
        tips: "Procura mantener despejada la zona central y evita realizar movimientos al azar. Trabaja progresivamente desde los extremos hacia el centro y piensa siempre en los siguientes movimientos antes de realizar un salto. ¡Una buena planificación será la clave para resolver el tablero!",
        media: {
            image: {
                src: "../assets/images/batman-peg-tuto.png",
                alt: "Tutorial visual de posiciones en The Batman Peg Solitaire"
            },
            video: {
                src: "../assets/videos/Batman-peg-video.mp4"
            }
        }
    },
    3: {
        gameId: 3,
        intro: "¡Desafía tu mente con Blocka Game! Un juego de rompecabezas ágil donde debes encajar bloques geométricos en la cuadrícula para despejar líneas completas.",
        description: "Arrastra y ubica las piezas en el tablero de forma estratégica. Cada vez que completes una fila o columna entera, las fichas desaparecen liberando espacio.",
        highlight: "¡Mantén el tablero despejado para evitar quedarte sin movimientos válidos!",
        subtitle: "Reglas clave para dominar Blocka Game",
        features: [
            "Ubica las piezas sin límite de tiempo pero con espacio limitado.",
            "Completa filas o columnas completas para despejar la cuadrícula.",
            "Consigue combos eliminando múltiples líneas simultáneamente."
        ],
        tips: "Evita dejar huecos aislados de un solo bloque y reserva espacio en el centro para las piezas más grandes que puedan aparecer.",
        media: {
            image: {
                src: "../assets/images/blocka-tuto.webp",
                alt: "Guía visual de encaje de piezas en Blocka Game"
            }
        }
    }
};