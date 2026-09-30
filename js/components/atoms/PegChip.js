export default function PegChip(initialState = 'filled') {
    const peg = document.createElement('button');

    // Asignamos la clase base y el estado inicial (hole, filled o selected)
    peg.className = `atom-peg atom-peg--${initialState}`;

    // Contenedor para el ícono del murciélago (puedes usar tu clase de fuente de íconos o una imagen)
    const icon = document.createElement('i');
    // Si usás una imagen en lugar de un ícono font, cambialo por un <img>
    icon.className = 'icon-bat atom-peg__icon';

    peg.appendChild(icon);

    // Lógica visual temporal para probar la interacción (Mockup)
    peg.addEventListener('click', () => {
        if (peg.classList.contains('atom-peg--filled')) {
            peg.classList.replace('atom-peg--filled', 'atom-peg--selected');
        } else if (peg.classList.contains('atom-peg--selected')) {
            peg.classList.replace('atom-peg--selected', 'atom-peg--filled');
        }
    });

    return peg;
}