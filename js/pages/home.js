
import GameCard from '../components/molecules/GameCard.js';
import { games } from '../data/games.js'; // Ajustá la ruta a donde guardaste el array
import Loader from '../components/organisms/Loader.js';

    document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("DOMContentLoaded", () => {
        const appContainer = document.getElementById("app");

        const pantallaDeCarga = Loader();

        appContainer.appendChild(pantallaDeCarga);
    });

    const grid = document.getElementById("juegos-container");


    games.slice(0, 10).forEach(juego => {
        const tarjeta = GameCard(juego);
        grid.appendChild(tarjeta);
    });
});