import { assert, assertEquals } from "./assert.js";
import Game from "../shared/models/Game.js";
import User from "../shared/models/User.js";
import Subscription from "../shared/models/Subscription.js";

export default [
    {
        name: "Game: isFree/isPremium según accessLevel (contrato en minúscula)",
        fn: () => {
            // NOTA: el contrato del modelo usa "premium"/"free" en minúscula.
            // data/games.js pasa "Premium"/"Free" en mayúscula: bug preexistente documentado,
            // NO se corrige en la migración (los tests prueban el contrato del modelo).
            const free = new Game(1, "T", "Acción", 1991, "free", "img.png");
            const premium = new Game(2, "T", "Acción", 1991, "premium", "img.png");
            assert(free.isFree() === true, "free es free");
            assert(premium.isPremium() === true, "Premium es premium");
            assert(premium.isFree() === false, "premium no es free");
        }
    },
    {
        name: "Subscription: detección de plan premium",
        fn: () => {
            assert(new Subscription("premium", 10).isPremium() === true, "premium detectado");
            assert(new Subscription("free", 0).isFree() === true, "free detectado");
        }
    },
    {
        name: "User: canPlay respeta juego free y usuario premium",
        fn: () => {
            const freeGame = new Game(1, "F", "Acción", 1991, "free", "img.png");
            const premiumGame = new Game(2, "P", "Puzzle", 2026, "Premium", "img.png");
            const freeUser = new User(1, "Nico", "n@m.com", new Subscription("free", 0));
            const premiumUser = new User(2, "Ada", "a@m.com", new Subscription("premium", 10));
            assert(freeUser.canPlay(freeGame) === true, "usuario free juega juego free");
            assert(freeUser.canPlay(premiumGame) === false, "usuario free NO juega premium");
            assert(premiumUser.canPlay(premiumGame) === true, "premium juega premium");
        }
    }
];
