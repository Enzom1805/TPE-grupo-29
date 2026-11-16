/**
 * Manifest de juegos instalados.
 *
 * Este archivo es el ÚNICO punto de composición que conoce qué juegos existen.
 * Para incorporar un juego nuevo:
 *   1. Crear games/<juego>/ con su index.js que exporta el contrato
 *      { id, mount(container), destroy?() }.
 *   2. Agregar su import y registro acá.
 *
 * El viewport y el resto de la plataforma solo consumen getGameById().
 */

import pegSolitaire from './peg-solitaire/index.js';
import blocka from './blocka/index.js';

import { registerGame } from './core/game-registry.js';

[pegSolitaire, blocka].forEach(entry => registerGame(entry));

export { getGameById, getRegisteredGameIds } from './core/game-registry.js';
