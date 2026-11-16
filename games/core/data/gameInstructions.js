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
                src: "../games/peg-solitaire/assets/images/batman-peg-tuto.png",
                alt: "Tutorial visual de posiciones en The Batman Peg Solitaire"
            },
            video: {
                src: "../games/peg-solitaire/assets/videos/Batman-peg-video.mp4"
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
            "Consigue combos eliminando múltiples líneas simultáneamente.",
            "En caso de necesitar ayuda, no dudes en utilizar la ayudita, esta colocara automaticamente una pieza en la posicion ideal",
            "No abuses con las ayuditas, ya que aumentaran en 5 tu contador de segundos",
            "En caso de perderte mucho, prueba reiniciando el nivel para reorganizar el nivel actual"

        ],
        tips: "Evita dejar huecos aislados de un solo bloque y reserva espacio en el centro para las piezas más grandes que puedan aparecer.",


        media: {
            image: {
                src: "../games/blocka/assets/images/blocka.jpg",
                alt: "Guía visual de encaje de piezas en Blocka Game"
            },
            video: {
                src: "../games/blocka/assets/videos/Blocka-video.mp4"
            }
        }
    },
    50: {
        gameId: 50,
        intro: "¡Viví la vida de un murciélago en la penumbra! EchoBat es un scroller horizontal de vuelo: avanzás a velocidad constante por una cueva oscura y debés mantener el vuelo esquivando estalactitas y estalagmitas.",
        description: "El murciélago vuela solo hacia adelante: vos controlás la altura. Cada impulso lo eleva y la gravedad lo baja. La cueva está envuelta en oscuridad, pero tu instinto de ecolocalización te salva: lanzá un cono de sonar que revela los obstáculos escondidos durante 3 segundos.",
        highlight: "¡El sonar se recarga al instante cuando esquivás un pilar o atrapás una luciérnaga. Usalo con cabeza!",
        subtitle: "¿Cuáles son las características principales?",
        features: [
            "Impulso hacia arriba con ESPACIO o flecha Arriba para mantener el vuelo.",
            "Ecolocalización con SHIFT: cono de luz que revela la cueva durante 3 segundos.",
            "Luciérnagas: otorgan +50 puntos y recargan el sonar al instante.",
            "Arañas colgantes: restan una vida, ¡esquiválas o atravesálas con cuidado!",
            "El hueco entre estalactitas se hace cada vez más chico y varía de altura a medida que avanzás.",
            "La distancia entre obstáculos cambia constantemente: nada de memorizar patrones.",
            "Contás con 3 vidas y un periodo de invulnerabilidad tras cada choque: el vuelo continúa."
        ],
        tips: "Mantené el murciélago en el tercio medio de la pantalla y aleteá con toques cortos en vez de mantener presionado. Guardá el sonar para los tramos con huecos angostos y buscá las luciérnagas: además de sumar puntaje, dejan el sonar listo para la próxima emergencia.",
        media: {
            image: {
                src: "../games/echobat/assets/images/echobat-tuto.png",
                alt: "Captura de vuelo de EchoBat: murciélago, estalactitas y luciérnaga en la cueva"
            }
        }
    }
};