/**
 * @param {Object} game - Instancia del modelo Game (contiene id, title, etc.).
 * @param {Object|null} instructions - Objeto con las instrucciones específicas del juego.
 * @returns {HTMLElement} Elemento <section> con el contenido renderizado.
 */
export default function HowToPlay(game, instructions) {
    const section = document.createElement("section");
    section.className = "how-to-play";

    // Manejo de error si no existe la instancia del juego
    if (!game) {
        const errorMessage = document.createElement("p");
        errorMessage.className = "how-to-play__error";
        errorMessage.textContent = "Error: No se ha seleccionado un videojuego válido.";
        section.appendChild(errorMessage);
        return section;
    }

    // 1. Header (Icono + Título dinámico)
    const header = document.createElement("div");
    header.className = "how-to-play__header";

    const icon = document.createElement("span");
    icon.className = "how-to-play__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "i";

    const title = document.createElement("h2");
    title.className = "how-to-play__title";
    title.textContent = `¿Cómo jugar a ${game.title}?`;

    header.append(icon, title);

    // 2. Línea divisora
    const divider = document.createElement("hr");
    divider.className = "how-to-play__divider";

    // 3. Contenedor del contenido
    const content = document.createElement("div");
    content.className = "how-to-play__content";

    // Si el juego existe pero no posee un registro de instrucciones detalladas
    if (!instructions) {
        const fallbackMessage = document.createElement("p");
        fallbackMessage.className = "how-to-play__empty";
        fallbackMessage.textContent = `Próximamente agregaremos la guía paso a paso para ${game.title}. ¡Sigue explorando sus modos de juego!`;
        content.appendChild(fallbackMessage);
        section.append(header, divider, content);
        return section;
    }

    // Parrafo 1: Intro
    if (instructions.intro) {
        const p1 = document.createElement("p");
        const strongTitle = document.createElement("strong");
        strongTitle.textContent = game.title;

        p1.append(strongTitle, " — ", instructions.intro);
        content.appendChild(p1);
    }

    // Parrafo 2: Descripción
    if (instructions.description) {
        const p2 = document.createElement("p");
        p2.textContent = instructions.description;
        content.appendChild(p2);
    }

    // Parrafo 3: Destacado (Highlight)
    if (instructions.highlight) {
        const p3 = document.createElement("p");
        p3.className = "how-to-play__highlight";
        p3.textContent = instructions.highlight;
        content.appendChild(p3);
    }

    // Subtítulo condicional
    if (instructions.subtitle) {
        const subtitle = document.createElement("h3");
        subtitle.className = "how-to-play__subtitle";
        subtitle.textContent = instructions.subtitle;
        content.appendChild(subtitle);
    }

    // Lista de características / Reglas
    if (Array.isArray(instructions.features) && instructions.features.length > 0) {
        const list = document.createElement("ul");
        list.className = "how-to-play__list";

        instructions.features.forEach((featureText) => {
            if (featureText) {
                const item = document.createElement("li");
                item.textContent = featureText;
                list.appendChild(item);
            }
        });

        content.appendChild(list);
    }

    // Parrafo 4: Consejos / Tips
    if (instructions.tips) {
        const pTips = document.createElement("p");
        pTips.textContent = instructions.tips;
        content.appendChild(pTips);
    }

    // 4. Bloque Multimedia Condicional (Imagen y/o Video)
    const hasImage = Boolean(instructions.media?.image?.src);
    const hasVideo = Boolean(instructions.media?.video?.src);

    if (hasImage || hasVideo) {
        const mediaContainer = document.createElement("div");
        mediaContainer.className = "how-to-play__media";

        // Renderizado del video si está disponible
        if (hasVideo) {
            const video = document.createElement("video");
            video.className = "how-to-play__media-item";
            video.src = instructions.media.video.src;
            video.controls = true;
            video.autoplay = false;
            video.muted = true;
            video.loop = false;
            video.playsInline = true;
            mediaContainer.appendChild(video);
        }

        // Renderizado de la imagen si está disponible
        if (hasImage) {
            const image = document.createElement("img");
            image.className = "how-to-play__media-item";
            image.src = instructions.media.image.src;
            image.alt = instructions.media.image.alt || `Guía tutorial de ${game.title}`;
            mediaContainer.appendChild(image);
        }

        content.appendChild(mediaContainer);
    }

    // Ensamblamos la sección completa
    section.append(header, divider, content);

    return section;
}