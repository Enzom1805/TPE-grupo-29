import CategoryCarousel from '../components/organisms/CategoryGameCarousel.js';
import HeroCarousel from '../components/organisms/HeroGameCarousel.js';
import Breadcrumbs from '../components/molecules/Breadcrumbs.js';
import { homeBreadcrumbs } from '../data/breadcrumbData.js';
import Footer from '../components/organisms/FatFooter.js';
import Header from '../components/organisms/Header.js';
import { games } from '../data/games.js';
import Loader from "../components/organisms/Loader.js";

document.addEventListener("DOMContentLoaded", () => {

    // Acá instanciamos el Loader
    const loader = Loader(() => {
        console.log("Carga de la Home completada.");
    });

    document.body.appendChild(loader);

    const appContainer = document.getElementById("app") || document.body;

    const header = Header();
    document.body.prepend(header);
    const breadcrumbs = Breadcrumbs(homeBreadcrumbs);
    appContainer.appendChild(breadcrumbs);

    // 1. Creamos la función para redirigir a la página del juego
    const redirectToGame = () => {
        window.location.href = "game.html"; // Redirige a game.html
    };

    const farLeftGame = games.find(game => game.id === 5);
    const leftGame = games.find(game => game.id === 3);
    const centerGame = games.find(game => game.id === 2); // Batman Peg Solitaire
    const rightGame = games.find(game => game.id === 1);
    const farRightGame = games.find(game => game.id === 6);

    // 2. Le asignamos redirectToGame al botón de Batman Peg Solitaire
    if (centerGame && centerGame.button) {
        centerGame.button.addEventListener('click', redirectToGame);
    }

    const heroGamesArray = [farLeftGame, leftGame, centerGame, rightGame, farRightGame];

    const heroSection = HeroCarousel(heroGamesArray);
    appContainer.appendChild(heroSection);

    // Filtramos los juegos por categoría
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

    // Los inyectamos en la pantalla
    appContainer.appendChild(carruselAccion);
    appContainer.appendChild(carruselAventura);
    appContainer.appendChild(carruselPelea);
    appContainer.appendChild(carruselDeportes);
    appContainer.appendChild(carruselEstrategia);

    const footerSection = Footer();
    appContainer.appendChild(footerSection);
});