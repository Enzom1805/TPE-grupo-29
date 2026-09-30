import Button from '../atoms/Button.js';
import helpMenu from "../../utils/helpmenu.js";

export default function HelpButton() {
    const container = document.createElement('div');
    container.className = 'help-section';

    const title = document.createElement('span');
    title.className = 'help-section__title';
    title.textContent = 'NECESITAS AYUDA?';

    const helpBtn = document.createElement('button');
    helpBtn.className = 'atom-button--help';

    const helpIcon = document.createElement('img');
    helpIcon.src = '../../assets/icons/help.svg';
    helpIcon.alt = 'Ayuda';

    helpBtn.appendChild(helpIcon);

    const modalBox = document.createElement('div');
    modalBox.className = 'help-section__modal';

    const p1 = document.createElement('p');
    p1.textContent = 'El Peg Solitaire, también llamado Damas chinas, es un juego de suerte y habilidad. Quite las clavijas saltando sobre ellas, al igual que las damas, hasta que solo quede una clavija en el centro del tablero.'

    const p2 = document.createElement('p');
    p2.textContent = 'Tu objetivo es eliminar todas las clavijas menos una. Para despejar una clavija, salte sobre ella y colóquela en un espacio vacío. Haga clic en una clavija para seleccionarla y luego haga clic en un espacio vacío para realizar un salto.'

    // Movemos el título dentro del modal para que solo se vea al abrirlo
    modalBox.prepend(title);
    modalBox.append(p1, p2);

    // Pasamos la clase activa que coincide con el CSS
    helpMenu(helpBtn, modalBox, 'help-section__modal--active');

    // El título ("NECESITAS AYUDA?") va afuera, junto al botón y al modal oculto
    container.append(title, helpBtn, modalBox);

    return container;

}
