import Button from '../atoms/Button.js';

export default function GameCard(game) {
    const card = document.createElement("article");
    card.className = "game-card";

    // Imagen de fondo ocupando toda la tarjeta
    const img = document.createElement("img");
    img.src = game.image;
    img.alt = game.title;
    img.className = "game-card__img";
    card.appendChild(img);

    // Overlay morado con la información (aparece en hover)
    const info = document.createElement("div");
    info.className = "game-card__info";

    const title = document.createElement("h3");
    title.className = "game-card__title";
    title.textContent = game.title;

    // Contenedor para "Categoría   Año    Jugar"
    const meta = document.createElement("div");
    meta.className = "game-card__meta";

    const textGroup = document.createElement("div");
    textGroup.className = "game-card__text-group";

    const categorySpan = document.createElement("span");
    categorySpan.textContent = game.category;

    const ageSpan = document.createElement("span");
    ageSpan.textContent = game.age;

    textGroup.appendChild(categorySpan);
    textGroup.appendChild(ageSpan);

    const playBtn = Button("Jugar", "button", "play", "small");
    playBtn.classList.add("game-card__play");


    meta.appendChild(textGroup);
    meta.appendChild(playBtn);
    info.appendChild(title);
    info.appendChild(meta);
    card.appendChild(info);

    const badge = document.createElement("div");
    // Agregamos la clase base del listón
    badge.className = "game-card__badge";

    // Modificador y texto según el nivel de acceso
    if (game.accessLevel === "Premium") {
        badge.classList.add("game-card__badge--premium");
        badge.textContent = "Premium";
    } else {
        badge.classList.add("game-card__badge--free");
        badge.textContent = "Gratis";
    }

    card.appendChild(badge);

    card.appendChild(badge);

    return card;
}