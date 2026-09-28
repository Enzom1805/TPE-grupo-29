import CategoryCarousel from '../components/organisms/CategoryGameCarousel.js';
import { games } from '../data/games.js';

document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app");

    // Limpiamos el contenedor (por si dejamos el div de prueba anterior)
    appContainer.innerHTML = '';

    // Filtramos los juegos por categoría
    const juegosAccion = games.filter(game => game.category === "Acción");
    const juegosAventura = games.filter(game => game.category === "Aventura");
    const juegosPelea = games.filter(game => game.category === "Pelea");

    // Instanciamos los carruseles (Organismos)
    const carruselAccion = CategoryCarousel("Juegos de Accion", juegosAccion);
    const carruselAventura = CategoryCarousel("Juegos de Aventura", juegosAventura);
    const carruselPelea = CategoryCarousel("Juegos de Pelea", juegosPelea);

    // Los inyectamos en la pantalla
    appContainer.appendChild(carruselAccion);
    appContainer.appendChild(carruselAventura);
    appContainer.appendChild(carruselPelea);
});