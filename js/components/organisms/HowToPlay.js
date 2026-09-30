export default function HowToPlay() {
    const section = document.createElement("section");
    section.className = "how-to-play";

    // 1. Header (Icono + Título)
    const header = document.createElement("div");
    header.className = "how-to-play__header";

    const icon = document.createElement("span");
    icon.className = "how-to-play__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "i";

    const title = document.createElement("h2");
    title.className = "how-to-play__title";
    title.textContent = "¿Cómo jugar a The Batman Peg Solitaire?";

    header.append(icon, title);

    // 2. Línea divisora
    const divider = document.createElement("hr");
    divider.className = "how-to-play__divider";

    // 3. Contenedor del contenido
    const content = document.createElement("div");
    content.className = "how-to-play__content";

    // Parrafo 1 (con <strong> interno)
    const p1 = document.createElement("p");
    const strongGameTitle = document.createElement("strong");
    strongGameTitle.textContent = "The Batman Peg Solitaire";

    p1.append(
        "¡Pon a prueba tu ingenio con ",
        strongGameTitle,
        ", un clásico juego de estrategia donde cada movimiento cuenta! Tu objetivo será eliminar las fichas del tablero realizando saltos sobre las fichas adyacentes, hasta conseguir que quede una sola ficha."
    );

    // Parrafo 2
    const p2 = document.createElement("p");
    p2.textContent = "La mecánica es sencilla, pero requiere planificación. Deberás mover una ficha saltando por encima de otra hacia una casilla vacía; la ficha saltada desaparecerá.";

    // Parrafo 3 (Destacado)
    const p3 = document.createElement("p");
    p3.className = "how-to-play__highlight";
    p3.textContent = "¡Piensa tus movimientos con anticipación para no quedarte sin opciones!";

    // Subtítulo
    const subtitle = document.createElement("h3");
    subtitle.className = "how-to-play__subtitle";
    subtitle.textContent = "¿Cuáles son las características principales de The Batman Peg Solitaire?";

    // Lista de viñetas
    const list = document.createElement("ul");
    list.className = "how-to-play__list";

    const itemsText = [
        "Salta sobre las fichas adyacentes para eliminarlas.",
        "Planifica tus movimientos para evitar quedarte bloqueado.",
        "Intenta terminar el tablero con una única ficha.",
        "Utiliza estratégicamente los espacios libres y la zona central."
    ];

    itemsText.forEach((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        list.appendChild(item);
    });

    // Parrafo 4
    const p4 = document.createElement("p");
    p4.textContent = "Procura mantener despejada la zona central y evita realizar movimientos al azar. Trabaja progresivamente desde los extremos hacia el centro y piensa siempre en los siguientes movimientos antes de realizar un salto. ¡Una buena planificación será la clave para resolver el tablero!";

    // 4. Bloque Multimedia (Imagen + Video en la misma línea)
    const mediaContainer = document.createElement("div");
    mediaContainer.className = "how-to-play__media";

    const image = document.createElement("img");
    image.className = "how-to-play__media-item";
    image.src = "../assets/images/batman-peg-tuto.png";
    image.alt = "Tutorial visual de The Batman Peg Solitaire";

    const video = document.createElement("video");
    video.className = "how-to-play__media-item";
    video.src = "../assets/videos/Batman-peg-video.mp4";
    video.controls = true;
    video.autoplay = false;
    video.muted = true;
    video.loop = false;
    video.playsInline = false;

    mediaContainer.append(video, image);

    // Insertamos los párrafos y la sección de medios
    content.append(p1, p2, p3, subtitle, list, p4, mediaContainer);

    // Ensamblamos la sección completa
    section.append(header, divider, content);

    return section;
}