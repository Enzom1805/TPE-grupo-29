import Header from '../components/organisms/Header.js';
import GameFrame from '../components/organisms/GameFrame.js';
import HowToPlay from '../components/organisms/HowToPlay.js';
import Community from '../components/organisms/Community.js';
import CategoryCarousel from '../components/organisms/CategoryGameCarousel.js'; // Reutilizamos el mismo componente
import Breadcrumbs from '../components/molecules/Breadcrumbs.js';
import Footer from '../components/organisms/FatFooter.js';

// Importación de datos estáticos
import { gameBreadcrumbs } from '../data/breadcrumbData.js';
import { commentsData } from '../data/comments.js';
import { games } from '../data/games.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app') || document.body;

    // 1. Instanciamos los componentes principales
    const header = Header();
    const breadcrumbs = Breadcrumbs(gameBreadcrumbs);
    const gameArea = GameFrame();
    const howToPlaySection = HowToPlay();
    const communitySection = Community({
        gameTitle: "The Batman Peg Solitaire",
        comments: commentsData
    });

    // 2. Filtramos para "Juegos Sugeridos" (excluyendo Batman Peg Solitaire ID: 2)
    const suggestedGames = games.filter(game => game.id !== 2);

    // Reutilizamos CategoryCarousel pasándole la categoría
    const suggestedCarousel = CategoryCarousel("Juegos Sugeridos", suggestedGames);
    suggestedCarousel.classList.add("category-carousel--vertical");

    // 3. Contenedor inferior (Foro + Carrusel Sugeridos)
    const bottomContainer = document.createElement("div");
    bottomContainer.className = "game-bottom-container";

    const leftCol = document.createElement("div");
    leftCol.className = "game-bottom-container__left";
    leftCol.appendChild(communitySection);

    const rightCol = document.createElement("div");
    rightCol.className = "game-bottom-container__right";
    rightCol.appendChild(suggestedCarousel); // Inyectamos el carrusel directamente

    bottomContainer.append(leftCol, rightCol);

    const footer = Footer();

    // 4. Renderizado en orden
    app.appendChild(header);
    app.appendChild(breadcrumbs);
    app.appendChild(gameArea);
    app.appendChild(howToPlaySection);
    app.appendChild(bottomContainer);
    app.appendChild(footer);
});