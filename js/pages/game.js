import Header from '../../shared/ui/organisms/Header.js';
import GameFrame from '../../games/core/game-frame.js';
import HowToPlay from '../../shared/ui/organisms/HowToPlay.js';
import Community from '../../features/community/components/Community.js';
import CategoryCarousel from '../../shared/ui/organisms/CategoryGameCarousel.js';
import Breadcrumbs from '../../shared/ui/molecules/Breadcrumbs.js';
import Footer from '../../shared/ui/organisms/FatFooter.js';

import { gameBreadcrumbs } from '../../shared/data/breadcrumbData.js';
import { commentsData } from '../../features/community/data/comments.js';
import { games } from '../../shared/data/games.js';
import { getInstructionsByGameId } from '../../games/core/services/instructions.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app') || document.body;

    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    const gameId = idParam ? parseInt(idParam, 10) : 2;
    const selectedGame = games.find(game => game.id === gameId);

    if (!selectedGame) {
        app.innerHTML = "<h1 style='color:white; text-align:center; padding: 2rem;'>Error: El juego solicitado no existe.</h1>";
        return;
    }

    document.title = `${selectedGame.title} | Kingly Games`;

    const dynamicBreadcrumbs = [...gameBreadcrumbs];
    if (dynamicBreadcrumbs.length > 0) {
        dynamicBreadcrumbs[dynamicBreadcrumbs.length - 1].label = selectedGame.title;
    }

    const header = Header();
    const breadcrumbs = Breadcrumbs(dynamicBreadcrumbs);

    // Contenedor a ancho completo para alojar el juego y sus métricas
    const gameMainContainer = document.createElement('div');
    gameMainContainer.className = 'game-main-container game-main-container--full-width';

    const gameArea = GameFrame(selectedGame);
    gameMainContainer.appendChild(gameArea);

    const gameInstructions = getInstructionsByGameId(selectedGame.id);
    const howToPlaySection = HowToPlay(selectedGame, gameInstructions);

    const communitySection = Community({
        gameTitle: selectedGame.title,
        comments: commentsData
    });

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

    app.appendChild(header);
    app.appendChild(breadcrumbs);
    app.appendChild(gameMainContainer);
    app.appendChild(howToPlaySection);
    app.appendChild(bottomContainer);
    app.appendChild(footer);
});