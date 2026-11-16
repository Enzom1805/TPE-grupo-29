import { assert, assertEquals } from "./assert.js";
import { registerGame, getGameById, getRegisteredGameIds } from "../games/core/game-registry.js";

export default [
    {
        name: "GameRegistry: rechaza entradas inválidas",
        fn: () => {
            assert(registerGame(null) === false, "null rechazado");
            assert(registerGame({ id: "x", mount() {} }) === false, "id no numérico rechazado");
            assert(registerGame({ id: 99 }) === false, "sin mount rechazado");
        }
    },
    {
        name: "GameRegistry: registra y resuelve por id",
        fn: () => {
            const fake = { id: 98, mount() { return document.createElement('div'); } };
            assert(registerGame(fake) === true, "registro exitoso");
            assertEquals(getGameById(98), fake, "resuelve la misma entrada");
        }
    },
    {
        name: "GameRegistry: ids duplicados no pisan la entrada original",
        fn: () => {
            const original = { id: 97, mount() {} };
            registerGame(original);
            assert(registerGame({ id: 97, mount() {} }) === false, "duplicado rechazado");
            assertEquals(getGameById(97), original, "conserva la original");
        }
    },
    {
        name: "GameRegistry: los juegos instalados (Peg id=2, Blocka id=3) cumplen el contrato",
        fn: () => {
            // Import diferido para evaluar el manifest dentro del caso
            return import("../games/index.js").then(mod => {
                const peg = mod.getGameById(2);
                const blocka = mod.getGameById(3);
                assert(peg !== undefined, "Peg Solitaire registrado");
                assert(blocka !== undefined, "Blocka registrado");
                assert(typeof peg.mount === "function", "peg.mount es función");
                assert(typeof blocka.mount === "function", "blocka.mount es función");
                const ids = mod.getRegisteredGameIds();
                assert(ids.includes(2) && ids.includes(3), "ids 2 y 3 presentes");
            });
        }
    }
];
