/**
 * EchoBatController: controller principal del juego (id 31).
 *
 * Responsabilidades (SRP): componer el DOM del viewport, administrar el estado
 * de partida, el loop con delta-time normalizado y el ciclo de vida.
 * La detección de colisiones está delegada por completo al ColliderSystem.
 */

import { BatPlayer } from '../engine/BatPlayer.js';
import { CavePillar } from '../engine/CavePillar.js';
import { ParallaxBackground } from '../engine/ParallaxBackground.js';
import { MothEntity } from '../engine/entities/MothEntity.js';
import { SpiderEntity } from '../engine/entities/SpiderEntity.js';
import { MathUtils } from '../engine/MathUtils.js';
import { ColliderSystem } from '../engine/collider/ColliderSystem.js';
import { InputHandler } from './InputHandler.js';
import { HudBar } from '../components/HudBar.js';
import { GameOverlay } from '../components/GameOverlay.js';
import { ECHOBAT_CONFIG, gapHeightForScore } from '../data/config.js';

export class EchoBatController {
    /**
     * @param {HTMLElement} container nodo donde se monta el juego
     */
    constructor(container) {
        this.container = container;

        this.width = ECHOBAT_CONFIG.width;
        this.height = ECHOBAT_CONFIG.height;
        this.baseSpeed = ECHOBAT_CONFIG.baseSpeed;
        this.maxCooldownFrames = ECHOBAT_CONFIG.sonar.cooldownFrames;

        // Estado de partida
        this.isRunning = false;
        this.score = 0;
        this.lives = ECHOBAT_CONFIG.lives;
        this.gameTimeSeconds = 0;
        this.highScore = parseInt(localStorage.getItem(ECHOBAT_CONFIG.storageKey) || '0', 10);
        this.sonarCooldownFrames = 0;

        // Recursos de ciclo de vida (liberados en destroy)
        this.animFrameId = null;
        this.timerInterval = null;
        this.lastTime = 0;
        this._keyStartHandler = null;

        // Espaciado horizontal aleatorio hasta el próximo pilar (requisito 6a)
        this.nextSpacing = this._randomSpacing();

        // Mundo
        this.parallaxBg = new ParallaxBackground(this.width, this.height);
        this.player = null;
        this.pillars = [];
        this.entities = [];

        this._buildDOM();
        this.input = new InputHandler();
    }

    // ======================================================
    // COMPOSICIÓN DEL DOM (viewport del juego)
    // ======================================================

    _buildDOM() {
        this.root = document.createElement('div');
        this.root.className = 'echobat';

        const frame = document.createElement('div');
        frame.className = 'echobat__frame';
        this.frame = frame;

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'echobat__canvas';
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');

        this.hud = HudBar();
        this.overlay = GameOverlay();

        // Hint de controles (esquina inferior izquierda, como el original)
        const hint = document.createElement('div');
        hint.className = 'echobat__hint';
        const kbd = document.createElement('kbd');
        kbd.className = 'echobat__hint-key';
        kbd.textContent = 'SHIFT';
        const hintText = document.createElement('span');
        hintText.textContent = 'Ecolocalizar cueva (Cono 3s)';
        hint.append(kbd, hintText);

        frame.append(this.canvas, this.hud.element, hint, this.overlay.element);
        this.root.appendChild(frame);
        this.container.appendChild(this.root);

        this.overlay.setScores(this.highScore, 0);
        this.hud.setLives(this.lives);
        this.hud.setSonar(0, this.maxCooldownFrames);
    }

    // ======================================================
    // CICLO DE VIDA
    // ======================================================

    init() {
        this.input.attach();
        this.overlay.onStart(() => this.start());

        // Iniciar también con Espacio/Enter cuando el juego no corre (como el original)
        this._keyStartHandler = (e) => {
            if (!this.isRunning && (e.code === 'Space' || e.code === 'Enter')) {
                this.start();
            }
        };
        window.addEventListener('keydown', this._keyStartHandler);
    }

    destroy() {
        this._stopLoop();
        this.input.detach();
        if (this._keyStartHandler) {
            window.removeEventListener('keydown', this._keyStartHandler);
            this._keyStartHandler = null;
        }
        if (this.root && this.root.parentNode === this.container) {
            this.container.removeChild(this.root);
        }
        this.container.innerHTML = '';
    }

    _stopLoop() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // ======================================================
    // PARTIDA
    // ======================================================

    start() {
        this._stopLoop();

        this.score = 0;
        this.lives = ECHOBAT_CONFIG.lives;
        this.gameTimeSeconds = 0;
        this.sonarCooldownFrames = 0;
        this.pillars = [];
        this.entities = [];
        this.player = new BatPlayer(ECHOBAT_CONFIG.player.x, this.height / 2);
        this.nextSpacing = this._randomSpacing();
        this.isRunning = true;

        this.hud.setLives(this.lives);
        this.hud.setScore(this.score);
        this.hud.setTime(0);
        this.overlay.hide();

        this.timerInterval = setInterval(() => {
            if (this.isRunning) {
                this.gameTimeSeconds++;
                this.hud.setTime(this.gameTimeSeconds);
            }
        }, 1000);

        this._spawnPillar(this.width + ECHOBAT_CONFIG.spawn.initialXOffset);

        this.lastTime = performance.now();
        this.animFrameId = requestAnimationFrame((timestamp) => this._loop(timestamp));
    }

    /**
     * Distancia horizontal al próximo pilar: aleatoria dentro del rango
     * configurado (requisito 6a del entregable: separación variable).
     */
    _randomSpacing() {
        const { spacingMin, spacingMax } = ECHOBAT_CONFIG.spawn;
        return MathUtils.randomRange(spacingMin, spacingMax);
    }

    _spawnPillar(xPosition) {
        this.pillars.push(new CavePillar(xPosition, this.height, gapHeightForScore(this.score)));

        const spawn = ECHOBAT_CONFIG.spawn;
        if (Math.random() < spawn.entityChance) {
            const entityY = MathUtils.randomRange(spawn.entityMarginTop, this.height - spawn.entityMarginBottom);
            if (Math.random() > spawn.mothThreshold) {
                this.entities.push(new MothEntity(xPosition + 90, entityY));
            } else {
                this.entities.push(new SpiderEntity(xPosition + 90, entityY));
            }
        }
    }

    _triggerEcholocate() {
        if (this.sonarCooldownFrames > 0) return;

        this.sonarCooldownFrames = this.maxCooldownFrames;
        this.player.triggerSonarAnimation();

        const batPositionX = this.player.pos.x;

        this.pillars.forEach(pillar => {
            if (pillar.x + pillar.width > batPositionX) {
                pillar.reveal();
            }
        });

        this.entities.forEach(entity => {
            if (entity.pos.x > batPositionX - 50) {
                entity.reveal();
            }
        });
    }

    // ======================================================
    // LOOP
    // ======================================================

    _loop(timestamp) {
        if (!this.isRunning) return;

        const elapsed = (timestamp && this.lastTime) ? (timestamp - this.lastTime) : 16.667;
        this.lastTime = timestamp || performance.now();
        let dt = elapsed / 16.667;
        if (isNaN(dt) || dt <= 0 || dt > 3) {
            dt = 1;
        }

        this._update(dt);
        this._render();

        this.animFrameId = requestAnimationFrame((t) => this._loop(t));
    }

    _update(dt) {
        // Acciones de input (flags consumidas por frame)
        if (this.input.keys.jump) {
            this.player.flap();
            this.input.keys.jump = false;
        }
        if (this.input.keys.echolocate) {
            this._triggerEcholocate();
            this.input.keys.echolocate = false;
        }

        // Recarga del sonar
        if (this.sonarCooldownFrames > 0) {
            this.sonarCooldownFrames -= dt;
            if (this.sonarCooldownFrames < 0) this.sonarCooldownFrames = 0;
        }
        this.hud.setSonar(this.sonarCooldownFrames, this.maxCooldownFrames);

        // Parallax (4 capas, velocidad diferenciada)
        this.parallaxBg.update(this.baseSpeed, dt);

        // Física del jugador
        this.player.update(this.height, dt);

        // Colisión con límites del mapa (techo y suelo) sin reiniciar nivel
        if (this.player.pos.y <= 0) {
            this.player.pos.y = 2;
            this.player.velocity = 1;
            if (this.player.invincibilityTimer <= 0) {
                this._handleLifeLoss();
            }
        } else if (this.player.pos.y + this.player.height >= this.height) {
            this.player.pos.y = this.height - this.player.height - 2;
            this.player.velocity = -3; // leve impulso hacia arriba para retomar el vuelo
            if (this.player.invincibilityTimer <= 0) {
                this._handleLifeLoss();
            }
        }

        // ---- Pilares: movimiento, puntaje y colisión vía ColliderSystem ----
        const playerCollider = this.player.getCollider();

        for (let i = this.pillars.length - 1; i >= 0; i--) {
            const pillar = this.pillars[i];
            pillar.update(this.baseSpeed, dt);

            // Puntaje al superar el pilar + recarga instantánea de sonar
            if (!pillar.passed && pillar.x + pillar.width < this.player.pos.x) {
                pillar.passed = true;
                this.score += ECHOBAT_CONFIG.scorePerPillar;
                this.sonarCooldownFrames = 0;
            }

            // Colisión con estalactita/estalagmita (trapecios reales, NO se elimina el terreno)
            if (playerCollider && pillar.getColliders().some(shape => ColliderSystem.collides(playerCollider, shape))) {
                if (this.player.invincibilityTimer <= 0) {
                    this._handleLifeLoss();
                }
            }

            if (pillar.x + pillar.width < -50) {
                this.pillars.splice(i, 1);
            }
        }

        // Spawning dinámico: distancia horizontal VARIABLE entre pilares
        const lastPillar = this.pillars[this.pillars.length - 1];
        if (!lastPillar || lastPillar.x <= this.width - this.nextSpacing) {
            this._spawnPillar(ECHOBAT_CONFIG.spawn.pillarX);
            this.nextSpacing = this._randomSpacing();
        }

        // ---- Entidades dinámicas: luciérnagas (premio) y arañas (peligro) ----
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const entity = this.entities[i];
            entity.update(this.baseSpeed, dt);

            const entityCollider = entity.getCollider();
            if (entityCollider && ColliderSystem.collides(playerCollider, entityCollider)) {
                if (entity instanceof MothEntity) {
                    this.score += ECHOBAT_CONFIG.scorePerMoth;
                    this.sonarCooldownFrames = 0; // la luciérnaga recarga el sonar
                } else if (entity instanceof SpiderEntity) {
                    if (this.player.invincibilityTimer <= 0) {
                        this._handleLifeLoss();
                    }
                }
                entity.markedForDeletion = true;
            }

            if (entity.markedForDeletion) {
                this.entities.splice(i, 1);
            }
        }

        this.hud.setScore(this.score);
    }

    _handleLifeLoss() {
        this.player.triggerHitAnimation();
        this.player.invincibilityTimer = ECHOBAT_CONFIG.player.invincibilityFrames;
        this.lives--;
        this.hud.setLives(this.lives);

        // Animación keyframe de evento: sacudida de pantalla al recibir daño
        this.frame.classList.remove('is-hit');
        void this.frame.offsetWidth;
        this.frame.classList.add('is-hit');

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    // ======================================================
    // RENDER
    // ======================================================

    _drawCaveDarknessOverlay() {
        this.ctx.save();

        const batX = this.player.pos.x + this.player.width / 2;
        const batY = this.player.pos.y + this.player.height / 2;

        const innerRadius = 45;
        const outerRadius = 320;

        const darknessGrad = this.ctx.createRadialGradient(
            batX, batY, innerRadius,
            batX, batY, outerRadius
        );

        darknessGrad.addColorStop(0, 'rgba(2, 6, 23, 0.25)');
        darknessGrad.addColorStop(0.5, 'rgba(2, 6, 23, 0.75)');
        darknessGrad.addColorStop(1, 'rgba(2, 6, 23, 0.96)');

        this.ctx.fillStyle = darknessGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.restore();
    }

    _render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Fondo parallax de 4 capas
        this.parallaxBg.draw(this.ctx);

        // 2. Estalactitas y estalagmitas
        this.pillars.forEach(pillar => pillar.draw(this.ctx));

        // 3. Luciérnagas y arañas
        this.entities.forEach(entity => entity.draw(this.ctx));

        // 4. Viñeta de oscuridad de la cueva
        this._drawCaveDarknessOverlay();

        // 5. Murciélago jugador
        this.player.draw(this.ctx);
    }

    gameOver() {
        this.isRunning = false;
        this._stopLoop();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem(ECHOBAT_CONFIG.storageKey, this.highScore.toString());
        }

        this.overlay.setTitle('¡VUELO TERMINADO!');
        this.overlay.setDescription(
            `Has sobrevivido <strong>${this.gameTimeSeconds}s</strong> en la penumbra ` +
            `acumulando <strong class="echobat__text-success">${this.score} pts</strong>.`
        );
        this.overlay.setScores(this.highScore, this.score);
        this.overlay.setButtonText('REINTENTAR VUELO');
        this.overlay.show();
    }
}
