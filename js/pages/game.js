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

// NUEVO: Importamos el servicio que busca las instrucciones (de la respuesta anterior)
import { getInstructionsByGameId } from '../services/instructions.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app') || document.body;

    // 1. LEER LA URL Y BUSCAR EL JUEGO
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id'); // Obtiene el valor después de ?id=

    // Si no hay ID en la URL (por ejemplo si entras directo a game.html),
    // usamos el ID 2 (Batman) por defecto para que no se rompa la página.
    const gameId = idParam ? parseInt(idParam) : 2;

    // Buscamos toda la información de este juego
    const selectedGame = games.find(game => game.id === gameId);

    if (!selectedGame) {
        app.innerHTML = "<h1>Error: El juego no existe.</h1>";
        return; // Detenemos la ejecución si mandan un ID inválido
    }

    // 2. HACER DINÁMICOS LOS BREADCRUMBS (Opcional, pero recomendado)
    // Asumiendo que tu array gameBreadcrumbs tiene un último elemento que es el nombre del juego
    const dynamicBreadcrumbs = [...gameBreadcrumbs];
    dynamicBreadcrumbs[dynamicBreadcrumbs.length - 1].name = selectedGame.title;

    const header = Header();
    const breadcrumbs = Breadcrumbs(dynamicBreadcrumbs);

    // --- CONTENEDOR PRINCIPAL: JUEGO (IZQ) + SIDEBAR (DER) ---
    const gameMainContainer = document.createElement('div');
    gameMainContainer.className = 'game-main-container';

    // Componente del juego (GameFrame)
    const gameArea = GameFrame(selectedGame);
    gameMainContainer.appendChild(gameArea);

    // =========================================================
    // SOLUCIÓN: Sidebar dinámico según el juego
    // =========================================================
    if (selectedGame.id === 2) {
        // Solo inyectar la imagen de métricas si es Batman
        const sidebarContainer = document.createElement('div');
        sidebarContainer.className = 'game-main-container__sidebar';

        const sidebarImg = document.createElement('img');
        sidebarImg.src = '../assets/images/game-stats-info.jpg';
        sidebarImg.alt = `Métricas de ${selectedGame.title}`;
        sidebarImg.className = 'game-main-container__sidebar-img';

        sidebarContainer.appendChild(sidebarImg);
        gameMainContainer.appendChild(sidebarContainer);
    } else {
        // Para Blocka y otros juegos, le decimos al contenedor que
        // use todo el ancho disponible, ya que no habrá sidebar estático.
        gameMainContainer.classList.add('game-main-container--full-width');
    }

    const sidebarContainer = document.createElement('div');
    sidebarContainer.className = 'game-main-container__sidebar';

    const sidebarImg = document.createElement('img');
    sidebarImg.src = '../assets/images/game-stats-info.jpg';
    sidebarImg.alt = `Métricas de ${selectedGame.title}`;
    sidebarImg.className = 'game-main-container__sidebar-img';

    sidebarContainer.appendChild(sidebarImg);
    gameMainContainer.appendChild(gameArea);
    gameMainContainer.appendChild(sidebarContainer);

    // 3. INTEGRAR EL HOW TO PLAY DINÁMICO
    // Obtenemos las instrucciones específicas para este juego
    const gameInstructions = getInstructionsByGameId(selectedGame.id);

    // Pasamos el juego y las instrucciones al componente que rediseñamos
    const howToPlaySection = HowToPlay(selectedGame, gameInstructions);

    // 4. HACER DINÁMICA LA COMUNIDAD
    const communitySection = Community({
        gameTitle: selectedGame.title, // Ahora dice "Comunidad de Blocka Game" dinámicamente
        comments: commentsData // Idealmente aquí también filtrarías comentarios por gameId
    });

    // 5. JUEGOS SUGERIDOS DINÁMICOS
    // Filtramos para que no te sugiera el juego que ya estás jugando
    const suggestedGames = games.filter(game => game.id !== selectedGame.id);
    const suggestedCarousel = CategoryCarousel("Juegos Sugeridos", suggestedGames);
    suggestedCarousel.classList.add("category-carousel--vertical");

    // Contenedor inferior
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

    // Renderizado en orden
    app.appendChild(header);
    app.appendChild(breadcrumbs);
    app.appendChild(gameMainContainer);
    app.appendChild(howToPlaySection);
    app.appendChild(bottomContainer);
    app.appendChild(footer);
});