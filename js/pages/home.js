import CategoryCarousel from '../components/organisms/CategoryGameCarousel.js';
import HeroCarousel from '../components/organisms/HeroGameCarousel.js';
import { games } from '../data/games.js';

document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app");

    const farLeftGame = games.find(game => game.id === 5);

// Comix Zone (Izquierda)
    const leftGame = games.find(game => game.id === 3);

// Batman (Centro)
    const centerGame = games.find(game => game.id === 2);

// Battletoads (Derecha)
    const rightGame = games.find(game => game.id === 1);

// Premium extra para la derecha (ej: Castlevania, ID 6)
    const farRightGame = games.find(game => game.id === 6);

// 2. Armás un nuevo array con exactamente 5 posiciones en este orden estricto
    const heroGamesArray = [farLeftGame, leftGame, centerGame, rightGame, farRightGame];

// 3. Le pasás este array específico a tu carrusel
    const heroSection = HeroCarousel(heroGamesArray);
    // 4. Lo inyectamos PRIMERO para que quede arriba de todo
    appContainer.appendChild(heroSection);
    // ----------------------------

    // Filtramos los juegos por categoría (tu código actual)
    const juegosAccion = games.filter(game => game.category === "Acción");
    const juegosAventura = games.filter(game => game.category === "Aventura");
    const juegosPelea = games.filter(game => game.category === "Pelea");
    const juegosDeportes = games.filter(game => game.category === "Deportes");
    const juegosEstrategia = games.filter(game => game.category === "Estrategia");


    // Instanciamos los carruseles (Organismos)
    const carruselAccion = CategoryCarousel("Juegos de Accion", juegosAccion);
    const carruselAventura = CategoryCarousel("Juegos de Aventura", juegosAventura);
    const carruselPelea = CategoryCarousel("Juegos de Pelea", juegosPelea);
    const carruselDeportes = CategoryCarousel("Juegos de Deportes", juegosDeportes);
    const carruselEstrategia = CategoryCarousel("Juegos de Estrategia", juegosEstrategia);

    // Los inyectamos en la pantalla (van a quedar abajo del Principal)
    appContainer.appendChild(carruselAccion);
    appContainer.appendChild(carruselAventura);
    appContainer.appendChild(carruselPelea);
    appContainer.appendChild(carruselDeportes);
    appContainer.appendChild(carruselEstrategia);
});