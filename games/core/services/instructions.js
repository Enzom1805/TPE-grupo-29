
import { gameInstructions } from "../data/gameInstructions.js";

/**
 * Obtiene las instrucciones asociadas a un videojuego según su ID.
 * @param {number|string} gameId - Identificador único del videojuego.
 * @returns {Object|null} - Objeto de instrucciones o null si no se encuentran.
 */
export function getInstructionsByGameId(gameId) {
    if (gameId === undefined || gameId === null) {
        return null;
    }

    const numericId = Number(gameId);
    return gameInstructions[numericId] || null;
}