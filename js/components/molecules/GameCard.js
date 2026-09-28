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

    const playBtn = document.createElement("span");
    playBtn.className = "game-card__play";
    playBtn.textContent = "Jugar";

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