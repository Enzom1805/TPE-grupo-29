/**
 * Mini framework de aserciones vanilla (sin dependencias externas).
 * Cada módulo de tests exporta un array de casos: { name, fn }.
 * fn recibe el objeto `t` y debe lanzar Error si algo falla.
 */

export function assert(cond, message = "aserción fallida") {
    if (!cond) throw new Error(message);
}

export function assertEquals(actual, expected, message = "") {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a !== e) {
        throw new Error(`${message} — esperado ${e}, obtenido ${a}`);
    }
}

export function assertThrows(fn, message = "se esperaba un error") {
    try {
        fn();
    } catch (err) {
        return;
    }
    throw new Error(message);
}
