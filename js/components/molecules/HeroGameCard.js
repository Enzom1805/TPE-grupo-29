import Button from '../atoms/Button.js';

export default function HeroCard(game) {
    const article = document.createElement("article");
    article.className = "hero-card";

    // Imagen de fondo
    const bkg = document.createElement("div");
    bkg.className = "hero-card__bg";
    bkg.style.backgroundImage = `url('${game.image}')`;
    article.appendChild(bkg);

    // Contenedor de información
    const info = document.createElement("div");
    info.className = "hero-card__info";

    const title = document.createElement("h2");
    title.className = "hero-card__title";
    title.textContent = game.title;

    // Contenedor Meta (flex: space-between)
    const meta = document.createElement("div");
    meta.className = "hero-card__meta";

    // Agrupamos Categoría y Año a la izquierda
    const tags = document.createElement("div");
    tags.className = "hero-card__tags";

    const category = document.createElement("span");
    category.className = "hero-card__category";
    category.textContent = game.category;

    const age = document.createElement("span");
    age.className = "hero-card__age";
    age.textContent = game.age;

    tags.appendChild(category);
    tags.appendChild(age);

    // Instanciamos el botón
    const playBtn = Button("Jugar", "button", "play", "large");
    playBtn.classList.add("hero-card__play");

    // SI ES EL JUEGO ID 2 (Batman Peg Solitaire), LE ASIGNAMOS LA REDIRECCIÓN
    if (game.id === 2) {
        playBtn.addEventListener("click", () => {
            window.location.href = "game.html";
        });
    }

    meta.appendChild(tags);
    meta.appendChild(playBtn);

    info.appendChild(title);
    info.appendChild(meta);

    article.appendChild(info);

    return article;
}