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

    // Contenedor para "Acción  2000    Jugar"
    const meta = document.createElement("div");
    meta.className = "game-card__meta";

    const catAge = document.createElement("span");
    // Usamos espacios indivisibles (\u00A0) para separar la categoría del año
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
        // Ícono de corona en SVG
        badge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`;
    } else {
        badge.textContent = "Gratis";
    }
    card.appendChild(badge);

    return card;
}