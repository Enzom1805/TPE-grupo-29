
import Button from '../atoms/Button.js';
import Dropdown from "../../utils/dropdown.js";


export default function HamburgerMenu(){

    const menuBtn = document.createElement('nav');
    menuBtn.className = 'icon icon-menu header__menu-icon';

    const menuContent = document.createElement('div');
    menuContent.className = 'hamburger-menu-content';
    const list = document.createElement('ul');
    list.className = 'hamburger-menu__list';

    const createMenuItem = (text, isTitle = false) => {
        const li = document.createElement('li');

        if (isTitle) {
            li.className = 'hamburger-menu__title';
            li.textContent = text;
        } else {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'hamburger-menu__link';
            a.textContent = text;
            li.appendChild(a);
        }

        return li;
    };

    list.append(
        createMenuItem('Inicio'),
        createMenuItem('Novedades'),
        createMenuItem('Categorias:', true), // Para que sea morado
        createMenuItem('Acción'),
        createMenuItem('Deportes'),
        createMenuItem('Estrategia'),
        createMenuItem('Aventura'),
        createMenuItem('Pelea')
    );

    menuContent.appendChild(list);
    return Dropdown(menuBtn, menuContent, 'left');
}