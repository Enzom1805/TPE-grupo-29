export default function PegChip(initialState = 'filled') {
    const peg = document.createElement('button');

    // Asignamos la clase base y el estado inicial (hole, filled o selected)
    peg.className = `atom-peg atom-peg--${initialState}`;

    // Contenedor para el ícono de batman
    const icon = document.createElement('i');
    icon.className = 'icon-bat atom-peg__icon';

    peg.appendChild(icon);

    if (initialState === 'filled') {
        peg.className = 'atom-peg atom-peg--filled';

        // Creamos la imagen del murciélago
        const batIcon = document.createElement('img');
        batIcon.src = '../../assets/images/bat.png';
        batIcon.className = 'atom-peg__icon';
        batIcon.alt = 'Ficha de Batman';
        batIcon.draggable = false;

        peg.appendChild(batIcon);
    } else if (initialState === 'hole') {
        peg.className = 'atom-peg atom-peg--hole';
    }
    peg.addEventListener('click', () => {
        if (peg.classList.contains('atom-peg--filled')) {
            peg.classList.replace('atom-peg--filled', 'atom-peg--selected');
        } else if (peg.classList.contains('atom-peg--selected')) {
            peg.classList.replace('atom-peg--selected', 'atom-peg--filled');
        }
    });

    return peg;
}