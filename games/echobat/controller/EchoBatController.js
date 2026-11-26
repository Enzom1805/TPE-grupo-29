/**
 * EchoBatController: controller principal del juego (id 50).
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
import { PauseOverlay } from '../components/PauseOverlay.js';
import { BAT_SHEET_SPEC } from '../data/bat-sheet.js';
import { ECHOBAT_CONFIG, gapHeightForScore, scrollSpeedForScore } from '../data/config.js';

/**
 * ¿Puede (re)iniciarse la partida por teclado (Espacio/Enter) en este instante?
 *
 * Reglas:
 *  - El juego no debe estar corriendo (menú o game over).
 *  - Un key repeat (tecla retenida) nunca inicia la partida.
 *  - Tras un game over, debe haber pasado el período de gracia: si el jugador
 *    muere con Space presionado, los repeats/toques inmediatos no deben
 *    reiniciar la partida sin dejar ver el cartel de puntaje.
 *
 * Función pura para poder testearla sin DOM.
 *
 * @param {boolean} isRunning ¿hay una partida en curso?
 * @param {number|null} gameOverAt timestamp del último game over (null si nunca)
 * @param {number} now timestamp actual (performance.now())
 * @param {boolean} repeat ¿es un evento keydown de tipo repeat?
 * @returns {boolean}
 */
export function canStartByKey(isRunning, gameOverAt, now, repeat) {
    if (isRunning || repeat) return false;
    if (gameOverAt === null) return true; // primera partida desde el menú
    return now - gameOverAt >= ECHOBAT_CONFIG.gameOverRestartGraceMs;
}

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
        this.isPaused = false;
        this.score = 0;
        this.lives = ECHOBAT_CONFIG.lives;
        this.gameTimeSeconds = 0;
        this.highScore = parseInt(localStorage.getItem(ECHOBAT_CONFIG.storageKey) || '0', 10);
        this.sonarCooldownFrames = 0;

        // Velocidad de scroll actual (sube por escalones según el puntaje)
        this.scrollSpeed = this.baseSpeed;
        this._speedLevel = 0;

        // Dash (→ / D): cargas por pilares superados + estelas fantasma
        this.dashCharges = 0;
        this.pillarsSinceCharge = 0;
        this.ghosts = [];
        this._trailCounter = 0;

        // Recursos de ciclo de vida (liberados en destroy)
        this.animFrameId = null;
        this.timerInterval = null;
        this.lastTime = 0;
        this._keyStartHandler = null;
        /** Timestamp del último game over: protege el cartel del reinicio por teclado. */
        this._gameOverAt = null;
        /** Timeouts de limpieza de clases de evento (is-hit / is-dashing). */
        this._dashFlashTimeout = null;
        this._hitFlashTimeout = null;

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

        // Backing store fijo a 2x: el fondo AI se dibuja a 1600x900 nativo y
        // el pixel-art queda nítido incluso en pantallas 1x. Toda la lógica
        // sigue en coordenadas 800x450; el transform escala el contexto una
        // sola vez.
        this.renderScale = 2;
        this.canvas.width = this.width * this.renderScale;
        this.canvas.height = this.height * this.renderScale;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.setTransform(this.renderScale, 0, 0, this.renderScale, 0, 0);

        this.hud = HudBar();
        this.overlay = GameOverlay();
        this.pauseOverlay = PauseOverlay();

        // Hint de controles (esquina inferior izquierda, como el original)
        const hint = document.createElement('div');
        hint.className = 'echobat__hint';
        const kbd = document.createElement('kbd');
        kbd.className = 'echobat__hint-key';
        kbd.textContent = 'SHIFT';
        const hintText = document.createElement('span');
        hintText.textContent = 'Sonar (3s)';
        const kbdDash = document.createElement('kbd');
        kbdDash.className = 'echobat__hint-key echobat__hint-key--dash';
        kbdDash.textContent = 'D';
        const hintDash = document.createElement('span');
        hintDash.textContent = 'Dash';
        hint.append(kbd, hintText, kbdDash, hintDash);

        // Botón de pantalla completa (esquina inferior derecha)
        this.fsButton = document.createElement('button');
        this.fsButton.type = 'button';
        this.fsButton.className = 'echobat__fs-btn';
        this.fsButton.textContent = '⛶';
        this.fsButton.title = 'Pantalla completa (F)';
        this.fsButton.setAttribute('aria-label', 'Pantalla completa');

        // Aviso de aceleración de la cueva (evento: sube el escalón de velocidad)
        this.speedUpNotice = document.createElement('div');
        this.speedUpNotice.className = 'echobat__speedup echobat__speedup--hidden';
        this.speedUpNotice.textContent = '¡LA CUEVA SE ACELERA!';

        frame.append(
            this.canvas, this.hud.element, hint, this.fsButton,
            this.speedUpNotice, this.overlay.element, this.pauseOverlay.element
        );
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
        this.input.bindScrollLock(this.frame);
        this.overlay.onStart(() => this.start());

        // El fondo se carga mientras el overlay de inicio está visible.
        this.parallaxBg.load();

        // Pausa (P/Esc) y pantalla completa (F o botón ⛶)
        this.input.onPause(() => this._togglePause());
        this.input.onFullscreenToggle(() => this._toggleFullscreen());
        this.fsButton.addEventListener('click', () => this._toggleFullscreen());

        // Iniciar también con Espacio/Enter cuando el juego no corre (como el
        // original). canStartByKey filtra key repeats y respeta el período de
        // gracia tras el game over (un Space retenido no debe saltarse el cartel).
        this._keyStartHandler = (e) => {
            if (e.code !== 'Space' && e.code !== 'Enter') return;
            if (canStartByKey(this.isRunning, this._gameOverAt, performance.now(), e.repeat)) {
                this.start();
            }
        };
        window.addEventListener('keydown', this._keyStartHandler);
    }

    /**
     * Alterna pausa: congela update+render (el loop sigue, refrescando
     * lastTime para que al reanudar no haya salto) y detiene el tiempo de
     * partida. Solo actúa con partida en curso (no interfiere con menú/game over).
     */
    _togglePause() {
        if (!this.isRunning) return;
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.pauseOverlay.show();
        } else {
            this.pauseOverlay.hide();
        }
    }

    /** Alterna pantalla completa del frame (API nativa del navegador). */
    _toggleFullscreen() {
        if (document.fullscreenElement === this.frame) {
            document.exitFullscreen();
        } else if (this.frame.requestFullscreen) {
            this.frame.requestFullscreen();
        }
    }

    /**
     * Aviso visual cuando la cueva acelera (sube el escalón de velocidad):
     * reutiliza la animación scorePop como evento reactiva.
     */
    _flashSpeedUp() {
        this.speedUpNotice.classList.remove('echobat__speedup--hidden', 'is-popping');
        void this.speedUpNotice.offsetWidth;
        this.speedUpNotice.classList.add('is-popping');
        clearTimeout(this._speedUpTimeout);
        this._speedUpTimeout = setTimeout(() => {
            this.speedUpNotice.classList.add('echobat__speedup--hidden');
            this.speedUpNotice.classList.remove('is-popping');
        }, 2000);
    }

    destroy() {
        this._stopLoop();
        this.input.detach();
        this.parallaxBg.destroy();
        clearTimeout(this._speedUpTimeout);
        clearTimeout(this._dashFlashTimeout);
        clearTimeout(this._hitFlashTimeout);
        if (document.fullscreenElement === this.frame) {
            document.exitFullscreen().catch(() => {});
        }
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
        this._gameOverAt = null; // nueva partida: ya no hay gracia activa
        this.pillars = [];
        this.entities = [];
        this.player = new BatPlayer(ECHOBAT_CONFIG.player.x, this.height / 2);
        this.nextSpacing = this._randomSpacing();
        this.isRunning = true;
        this.isPaused = false;
        this.scrollSpeed = this.baseSpeed;
        this._speedLevel = 0;
        this.dashCharges = 0;
        this.pillarsSinceCharge = 0;
        this.ghosts = [];
        this.pauseOverlay.hide();
        this.hud.setDash(0, 0, ECHOBAT_CONFIG.dash.maxCharges);

        this.hud.setLives(this.lives);
        this.hud.setScore(this.score);
        this.hud.setTime(0);
        this.overlay.hide();

        this.timerInterval = setInterval(() => {
            // El tiempo de partida NO avanza durante la pausa
            if (this.isRunning && !this.isPaused) {
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

        // Pausa: se congela la simulación pero el loop sigue vivo, refrescando
        // lastTime para que al reanudar el delta no acumule el tiempo pausado.
        if (this.isPaused) {
            this.lastTime = timestamp || performance.now();
            this.animFrameId = requestAnimationFrame((t) => this._loop(t));
            return;
        }

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
        // Velocidad de scroll según puntaje: sube por escalones (con aviso)
        this.scrollSpeed = scrollSpeedForScore(this.score);
        const level = Math.round((this.scrollSpeed - this.baseSpeed) / ECHOBAT_CONFIG.difficulty.speedStepIncrease);
        if (level > this._speedLevel) {
            this._speedLevel = level;
            this._flashSpeedUp();
        }

        // Acciones de input (flags consumidas por frame)
        if (this.input.keys.jump) {
            this.player.flap();
            this.input.keys.jump = false;
        }
        if (this.input.keys.echolocate) {
            this._triggerEcholocate();
            this.input.keys.echolocate = false;
        }
        if (this.input.keys.dash) {
            this.input.keys.dash = false;
            if (this.dashCharges > 0 && !this.player.isDashing) {
                this._triggerDash();
            }
        }

        // Recarga del sonar
        if (this.sonarCooldownFrames > 0) {
            this.sonarCooldownFrames -= dt;
            if (this.sonarCooldownFrames < 0) this.sonarCooldownFrames = 0;
        }
        this.hud.setSonar(this.sonarCooldownFrames, this.maxCooldownFrames);

        // Parallax (4 capas, velocidad diferenciada) + mundo acelerado en dash
        const worldSpeed = this.player.isDashing
            ? this.scrollSpeed * ECHOBAT_CONFIG.dash.worldSpeedMult
            : this.scrollSpeed;
        this.parallaxBg.update(worldSpeed, dt);

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
            pillar.update(worldSpeed, dt);

            // Puntaje al superar el pilar + recarga instantánea de sonar
            if (!pillar.passed && pillar.x + pillar.width < this.player.pos.x) {
                pillar.passed = true;
                this.score += ECHOBAT_CONFIG.scorePerPillar;
                this.sonarCooldownFrames = 0;
                // Progreso de carga del dash: +1 carga cada N pilares
                this.pillarsSinceCharge++;
                if (this.pillarsSinceCharge >= ECHOBAT_CONFIG.dash.pillarsPerCharge) {
                    this.pillarsSinceCharge = 0;
                    if (this.dashCharges < ECHOBAT_CONFIG.dash.maxCharges) {
                        this.dashCharges++;
                    }
                }
                this.hud.setDash(this.pillarsSinceCharge, this.dashCharges, ECHOBAT_CONFIG.dash.maxCharges);
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
            entity.update(worldSpeed, dt);

            const entityCollider = entity.getCollider();
            if (entityCollider && ColliderSystem.collides(playerCollider, entityCollider)) {
                if (entity instanceof MothEntity) {
                    this.score += ECHOBAT_CONFIG.scorePerMoth;
                    this.sonarCooldownFrames = 0; // la luciérnaga recarga el sonar
                    this.player.triggerShrink(); // y achica temporalmente al murciélago
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

        // ---- Estelas fantasma del dash (siluetas cian que se desvanecen) ----
        if (this.player.isDashing) {
            this._trailCounter += dt;
            if (this._trailCounter >= ECHOBAT_CONFIG.dash.trailEveryFrames) {
                this._trailCounter = 0;
                this.ghosts.push({
                    frameIdx: BAT_SHEET_SPEC.dashFrame,
                    x: this.player.pos.x,
                    y: this.player.pos.y,
                    rotation: this.player.rotation,
                    scale: this.player.renderScale,
                    life: ECHOBAT_CONFIG.dash.trailMaxGhosts,
                    maxLife: ECHOBAT_CONFIG.dash.trailMaxGhosts
                });
                if (this.ghosts.length > ECHOBAT_CONFIG.dash.trailMaxGhosts) {
                    this.ghosts.shift();
                }
            }
        }
        for (let i = this.ghosts.length - 1; i >= 0; i--) {
            this.ghosts[i].life -= dt;
            if (this.ghosts[i].life <= 0) this.ghosts.splice(i, 1);
        }

        this.hud.setScore(this.score);
    }

    /**
     * Activa el dash: consume una carga, dispara la ráfaga del jugador y el
     * destello cian del frame (keyframe de evento CSS).
     */
    _triggerDash() {
        this.dashCharges--;
        this.player.triggerDash();
        this.hud.setDash(this.pillarsSinceCharge, this.dashCharges, ECHOBAT_CONFIG.dash.maxCharges);

        this.frame.classList.remove('is-dashing');
        void this.frame.offsetWidth; // fuerza reflow para reiniciar la animación
        this.frame.classList.add('is-dashing');
        clearTimeout(this._dashFlashTimeout);
        this._dashFlashTimeout = setTimeout(() => this.frame.classList.remove('is-dashing'), 450);
    }

    _handleLifeLoss() {
        this.player.triggerHitAnimation();
        this.player.invincibilityTimer = ECHOBAT_CONFIG.player.invincibilityFrames;
        this.lives--;
        this.hud.setLives(this.lives);

        // Animación keyframe de evento: sacudida de pantalla al recibir daño.
        // La clase se limpia al terminar (0.35s): si quedara pegada, quitar
        // is-dashing al terminar un dash re-aplicaría screenShake desde 0%
        // (la pantalla temblaría "sola" al dashear tras un golpe viejo).
        this.frame.classList.remove('is-hit');
        void this.frame.offsetWidth;
        this.frame.classList.add('is-hit');
        clearTimeout(this._hitFlashTimeout);
        this._hitFlashTimeout = setTimeout(() => this.frame.classList.remove('is-hit'), 350);

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

        // 5. Estelas fantasma del dash (debajo del murciélago, sobre la oscuridad)
        this.ghosts.forEach(ghost => this.player.drawGhost(this.ctx, ghost));

        // 6. Murciélago jugador
        this.player.draw(this.ctx);
    }

    gameOver() {
        this.isRunning = false;
        this.isPaused = false;
        this._stopLoop();
        this._gameOverAt = performance.now(); // arranca el período de gracia

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem(ECHOBAT_CONFIG.storageKey, this.highScore.toString());
        }

        this.pauseOverlay.hide();
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
