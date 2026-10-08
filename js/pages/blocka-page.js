// js/pages/blocka-page.js

import Header from '../components/organisms/Header.js';
import Breadcrumbs from '../components/molecules/Breadcrumbs.js';
import Footer from '../components/organisms/FatFooter.js';

import { blockaBreadcrumbs } from '../data/breadcrumbData.js';
import { BlockaController } from '../controllers/BlockaController.js';

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

    // Inicializa el controlador enviándole el contenedor principal
    const controller = new BlockaController(gameFrame);
    controller.init();
});