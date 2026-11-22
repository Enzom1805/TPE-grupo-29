import Button from '../atoms/Button.js';
import helpMenu from "../../utils/helpmenu.js";

export default function HelpButton(game) {
    const container = document.createElement('div');
    container.className = 'help-section';

    const title = document.createElement('span');
    title.className = 'help-section__title';
    title.textContent = 'NECESITAS AYUDA?';

    const helpBtn = document.createElement('button');
    helpBtn.className = 'atom-button--help';

    const helpIcon = document.createElement('img');
    helpIcon.src = '../assets/icons/help.svg';
    helpIcon.alt = 'Ayuda';

    helpBtn.appendChild(helpIcon);

    const modalBox = document.createElement('div');
    modalBox.className = 'help-section__modal';

    const helpTexts = game?.id === 50
        ? [
            'EchoBat es un scroller horizontal ambientado en una cueva oscura: tu murciélago vuela solo hacia adelante y vos controlás la altura. Cada impulso lo eleva y la gravedad lo baja, así que esquivá estalactitas y estalagmitas con aleteos cortos.',
            'Usá ESPACIO o la flecha Arriba para elevarte, D o la flecha Derecha para el dash y SHIFT para lanzar el sonar que revela los obstáculos durante 3 segundos. Pausás con P o ESC y pasás a pantalla completa con F. Esquivar pilares o atrapar luciérnagas recarga el sonar; tenés 3 vidas y una breve invulnerabilidad después de cada choque.'
        ]
        : [
            'El Peg Solitaire, también llamado Damas chinas, es un juego de suerte y habilidad. Quite las clavijas saltando sobre ellas, al igual que las damas, hasta que solo quede una clavija en el centro del tablero.',
            'Tu objetivo es eliminar todas las clavijas menos una. Para despejar una clavija, salte sobre ella y colóquela en un espacio vacío. Haga clic en una clavija para seleccionarla y luego haga clic en un espacio vacío para realizar un salto.'
        ];

    const p1 = document.createElement('p');
    p1.textContent = helpTexts[0];

    const p2 = document.createElement('p');
    p2.textContent = helpTexts[1];

    // Movemos el título dentro del modal para que solo se vea al abrirlo
    modalBox.prepend(title);
    modalBox.append(p1, p2);

    // Pasamos la clase activa que coincide con el CSS
    helpMenu(helpBtn, modalBox, 'help-section__modal--active');

    // El título ("NECESITAS AYUDA?") va afuera, junto al botón y al modal oculto
    container.append(title, helpBtn, modalBox);

    return container;

}
