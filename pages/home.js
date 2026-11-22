import CategoryCarousel from '../shared/ui/organisms/CategoryGameCarousel.js';
import HeroCarousel from '../shared/ui/organisms/HeroGameCarousel.js';
import Breadcrumbs from '../shared/ui/molecules/Breadcrumbs.js';
import { homeBreadcrumbs } from '../shared/data/breadcrumbData.js';
import Footer from '../shared/ui/organisms/FatFooter.js';
import Header from '../shared/ui/organisms/Header.js';
import { games } from '../shared/data/games.js';
import Loader from "../shared/ui/organisms/Loader.js";

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

    const farLeftGame = games.find(game => game.id === 5);
    const leftGame = games.find(game => game.id === 3);
    const centerGame = games.find(game => game.id === 2); // Batman Peg Solitaire
    const rightGame = games.find(game => game.id === 50); // EchoBat
    const farRightGame = games.find(game => game.id === 6);

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