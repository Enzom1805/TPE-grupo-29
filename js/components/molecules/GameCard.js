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

    const catAge = document.createElement("span");
    catAge.textContent = `${game.category} \u00A0\u00A0 ${game.age}`;

    const playBtn = Button("Jugar", "button", "play", "small");
    playBtn.classList.add("game-card__play");

    // Lógica condicional para el color del botón según el nivel de acceso
    if (game.accessLevel === "Premium") {
        playBtn.classList.add("game-card__play--premium");
        title.classList.add("game-card__title--premium");
        catAge.classList.add("game-card__text--premium");
    } else {
        playBtn.classList.add("game-card__play--free");
    }

    meta.appendChild(catAge);
    meta.appendChild(playBtn);

    info.appendChild(title);
    info.appendChild(meta);
    card.appendChild(info);

    // Etiqueta superior derecha (Corona o Gratis)
    const badge = document.createElement("div");
    badge.className = "game-card__badge";

    if (game.accessLevel === "Premium") {
        const crownIcon = document.createElement("i");
        crownIcon.className = "icon icon-crown";
        badge.appendChild(crownIcon);
    } else {
        badge.textContent = "Gratis";
    }

    card.appendChild(badge);

    return card;
}