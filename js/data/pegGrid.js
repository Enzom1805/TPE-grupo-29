export const gridLayout = [
    // Mapa lógico del tablero expandido (9x7)
    // 0 = Fuera del tablero, 1 = Ficha (filled), 2 = Hueco (hole)
    0, 0, 0, 1, 1, 1, 0, 0, 0,
    0, 0, 0, 1, 1, 1, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 2, 1, 1, 1, 1, // El centro empieza vacío
    1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 1, 1, 1, 0, 0, 0,
    0, 0, 0, 1, 1, 1, 0, 0, 0
];