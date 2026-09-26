// Importamos la función constructora del Loader
import Loader from '../components/organisms/Loader.js';

// Esperamos a que el HTML termine de cargar
document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app");

    // Ejecutamos la función que crea el div del loader, el spinner y el intervalo de 5 segundos
    const pantallaDeCarga = Loader();

    // Lo inyectamos físicamente en el contenedor principal
    appContainer.appendChild(pantallaDeCarga);
});