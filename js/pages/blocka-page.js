// js/pages/blocka-page.js

import Header from '../../shared/ui/organisms/Header.js';
import Breadcrumbs from '../../shared/ui/molecules/Breadcrumbs.js';
import Footer from '../../shared/ui/organisms/FatFooter.js';

import { blockaBreadcrumbs } from '../../shared/data/breadcrumbData.js';
import { getGameById } from '../../games/index.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app') || document.body;

    const header = Header();
    const breadcrumbs = Breadcrumbs(blockaBreadcrumbs);
    const footer = Footer();

    const gameFrame = document.createElement('main');
    gameFrame.className = 'blocka-game-frame';
    gameFrame.style.position = 'relative';

    app.appendChild(header);
    app.appendChild(breadcrumbs);
    app.appendChild(gameFrame);
    app.appendChild(footer);

    // Inicializa el juego a través del contrato público del registry (id 3)
    const blockaEntry = getGameById(3);
    if (blockaEntry) {
        blockaEntry.mount(gameFrame);
    } else {
        console.error('blocka-page: el juego con id 3 no está registrado.');
    }
});