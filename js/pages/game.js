import Community from '../components/organisms/Community.js';
import { commentsData } from '../data/comments.js';

document.addEventListener("DOMContentLoaded", () => {
    // Buscamos el contenedor principal de la página de detalle del juego
    const mainContainer = document.querySelector("main") || document.body;

    // Instanciamos la comunidad con la data de comentarios
    const communitySection = Community({
        gameTitle: "The Batman Peg Solitaire",
        comments: commentsData
    });

    // Se inyecta exactamente al final de la página
    mainContainer.appendChild(communitySection);
});