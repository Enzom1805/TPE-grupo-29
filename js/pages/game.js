import Header from '../components/organisms/Header.js';
import GameFrame from '../components/organisms/GameFrame.js';
import HowToPlay from '../components/organisms/HowToPlay.js';
import Community from '../components/organisms/Community.js';
import CategoryCarousel from '../components/organisms/CategoryGameCarousel.js';
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

    // --- CONTENEDOR PRINCIPAL: JUEGO (IZQ) + SIDEBAR (DER) ---
    const gameMainContainer = document.createElement('div');
    gameMainContainer.className = 'game-main-container';

    // Componente del juego
    const gameArea = GameFrame();

    // Columna Derecha con la imagen
    const sidebarContainer = document.createElement('div');
    sidebarContainer.className = 'game-main-container__sidebar';

    const sidebarImg = document.createElement('img');
    sidebarImg.src = '../assets/images/game-stats-info.jpg'; // Colocá aquí la ruta a tu imagen
    sidebarImg.alt = 'Métricas y Acciones Rápidas del Juego';
    sidebarImg.className = 'game-main-container__sidebar-img';

    sidebarContainer.appendChild(sidebarImg);

    // Integramos ambas columnas en el contenedor principal del juego
    gameMainContainer.appendChild(gameArea);
    gameMainContainer.appendChild(sidebarContainer);

    // 2. Secciones inferiores
    const howToPlaySection = HowToPlay();
    const communitySection = Community({
        gameTitle: "The Batman Peg Solitaire",
        comments: commentsData
    });

    const suggestedGames = games.filter(game => game.id !== 2);
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
    rightCol.appendChild(suggestedCarousel);

    bottomContainer.append(leftCol, rightCol);

    const footer = Footer();

    // 4. Renderizado en orden
    app.appendChild(header);
    app.appendChild(breadcrumbs);
    app.appendChild(gameMainContainer); // <--- Reemplaza al gameArea individual
    app.appendChild(howToPlaySection);
    app.appendChild(bottomContainer);
    app.appendChild(footer);
});