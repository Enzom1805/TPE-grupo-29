import Header from '../components/organisms/Header.js';
import GameFrame from '../components/organisms/GameFrame.js';
import HowToPlay from '../components/organisms/HowToPlay.js';
import Community from '../components/organisms/Community.js';
import CategoryCarousel from '../components/organisms/CategoryGameCarousel.js';
import Breadcrumbs from '../components/molecules/Breadcrumbs.js';
import Footer from '../components/organisms/FatFooter.js';

import { gameBreadcrumbs } from '../data/breadcrumbData.js';
import { commentsData } from '../data/comments.js';
import { games } from '../data/games.js';
import { getInstructionsByGameId } from '../services/instructions.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app') || document.body;

    // 1. LECTURA DE LA URL Y BÚSQUEDA DEL JUEGO
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    // ID por defecto (2 = Batman) si se ingresa sin parámetros
    const gameId = idParam ? parseInt(idParam, 10) : 2;
    const selectedGame = games.find(game => game.id === gameId);

    if (!selectedGame) {
        app.innerHTML = "<h1 style='color:white; text-align:center; padding: 2rem;'>Error: El juego solicitado no existe.</h1>";
        return;
    }

    // 2. ACTUALIZACIÓN DINÁMICA DEL TÍTULO DE PESTAÑA Y BREADCRUMBS
    document.title = `${selectedGame.title} | Kingly Games`;

    const dynamicBreadcrumbs = [...gameBreadcrumbs];
    if (dynamicBreadcrumbs.length > 0) {
        dynamicBreadcrumbs[dynamicBreadcrumbs.length - 1].name = selectedGame.title;
    }

    const header = Header();
    const breadcrumbs = Breadcrumbs(dynamicBreadcrumbs);

    // 3. CONTENEDOR PRINCIPAL DEL JUEGO
    const gameMainContainer = document.createElement('div');
    gameMainContainer.className = 'game-main-container';

    const gameArea = GameFrame(selectedGame);
    gameMainContainer.appendChild(gameArea);

    // 4. SIDEBAR CONDICIONAL (Únicamente para Batman Peg Solitaire ID=2)
    if (selectedGame.id === 2) {
        const sidebarContainer = document.createElement('div');
        sidebarContainer.className = 'game-main-container__sidebar';

        const sidebarImg = document.createElement('img');
        sidebarImg.src = '../assets/images/game-stats-info.jpg';
        sidebarImg.alt = `Métricas de ${selectedGame.title}`;
        sidebarImg.className = 'game-main-container__sidebar-img';

        sidebarContainer.appendChild(sidebarImg);
        gameMainContainer.appendChild(sidebarContainer);
    } else {
        // Extiende el marco al 100% del ancho para los demás juegos
        gameMainContainer.classList.add('game-main-container--full-width');
    }

    // 5. INSTRUCCIONES Y COMUNIDAD DINÁMICAS
    const gameInstructions = getInstructionsByGameId(selectedGame.id);
    const howToPlaySection = HowToPlay(selectedGame, gameInstructions);

    const communitySection = Community({
        gameTitle: selectedGame.title,
        comments: commentsData
    });

    // 6. CARRUSEL DE JUEGOS SUGERIDOS
    const suggestedGames = games.filter(game => game.id !== selectedGame.id);
    const suggestedCarousel = CategoryCarousel("Juegos Sugeridos", suggestedGames);
    suggestedCarousel.classList.add("category-carousel--vertical");

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

    // RENDERIZADO FINAL AL DOM
    app.appendChild(header);
    app.appendChild(breadcrumbs);
    app.appendChild(gameMainContainer);
    app.appendChild(howToPlaySection);
    app.appendChild(bottomContainer);
    app.appendChild(footer);
});