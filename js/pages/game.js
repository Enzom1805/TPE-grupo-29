import Header from '../components/organisms/Header.js';
import GameFrame from '../components/organisms/GameFrame.js';
import Community from '../components/organisms/Community.js';
import { commentsData } from '../data/comments.js';
import Footer from '../components/organisms/FatFooter.js'; // Usar FatFooter (archivo existente)

document.addEventListener('DOMContentLoaded', () => {
    // Buscamos el contenedor principal (asumiendo que tenés un <div id="app"> o similar)
    // Si usás directamente el body, cambiá '#app' por document.body
    const app = document.getElementById('app') || document.body;

    // 1. Instanciamos los organismos
    const header = Header();
    const gameArea = GameFrame();
    const footer = Footer();
   

    // Instanciamos la comunidad con la data de comentarios
    const communitySection = Community({
        gameTitle: "The Batman Peg Solitaire",
        comments: commentsData
    });

      
    app.prepend(header);
    app.appendChild(gameArea);
    app.appendChild(communitySection)
    app.appendChild(footer);
});