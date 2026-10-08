// js/controllers/BlockaController.js

import { BLOCKA_CONFIG, getRandomImage } from '../data/blocka-data.js';
import { BlockaEngine } from '../engine/BlockaEngine.js';
import { BlockaPlayer } from '../components/organisms/BlockaPlayer.js';
import { LevelCompleteModal } from '../components/molecules/LevelCompleteModal.js';
import { LevelSelectorModal } from '../components/molecules/LevelSelectorModal.js';

export class BlockaController {
    constructor(container) {
        this.container = container;
        this.engine = new BlockaEngine();
        this.currentLevelIndex = 0;
        this.currentImageSrc = null;
    }

    async init() {
        await this.loadGameLevel(this.currentLevelIndex, false);
    }

    async loadGameLevel(levelIndex, keepSameImage = false) {
        this.currentLevelIndex = levelIndex;
        const levelConfig = BLOCKA_CONFIG.levels[levelIndex];

        if (!keepSameImage || !this.currentImageSrc) {
            this.currentImageSrc = getRandomImage();
        }

        this.container.innerHTML = `<p class="blocka-loading-text">Cargando ${levelConfig.name}...</p>`;

        try {
            await this.engine.loadLevel(levelConfig, this.currentImageSrc);
            this.container.innerHTML = '';

            const playerView = BlockaPlayer(this.engine, levelConfig, ({ time, moves }) => {
                this.handleLevelWin(levelConfig, this.currentImageSrc, time, moves);
            });

            this.setupSidebarButtons(playerView);

            this.container.appendChild(playerView);
        } catch (error) {
            console.error(error);
            this.container.innerHTML = `<p class="blocka-error-text">Error al cargar el nivel.</p>`;
        }
    }

    setupSidebarButtons(playerView) {
        const difficultyBtn = playerView.querySelector('.btn-blocka-difficulty');
        if (difficultyBtn) {
            difficultyBtn.onclick = () => this.openLevelSelector();
        }
    }

    openLevelSelector() {
        const modal = LevelSelectorModal({
            levels: BLOCKA_CONFIG.levels,
            currentLevelIndex: this.currentLevelIndex,
            onSelectLevel: (selectedIndex) => {
                this.loadGameLevel(selectedIndex, true);
            }
        });
        this.container.appendChild(modal);
    }

    handleLevelWin(levelConfig, imageUrl, time, moves) {
        const isLastLevel = this.currentLevelIndex === BLOCKA_CONFIG.levels.length - 1;

        const modal = LevelCompleteModal({
            levelName: levelConfig.name,
            time,
            moves,
            isLastLevel,
            imageUrl,
            onNextLevel: () => {
                const nextIndex = isLastLevel ? 0 : this.currentLevelIndex + 1;
                this.loadGameLevel(nextIndex, false);
            },
            onMenu: () => {
                this.openLevelSelector();
            }
        });

        this.container.appendChild(modal);
    }
}