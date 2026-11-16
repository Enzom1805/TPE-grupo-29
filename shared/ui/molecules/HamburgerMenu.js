import Dropdown from "../../utils/dropdown.js";

export default function HamburgerMenu() {
    const menuBtn = document.createElement('nav');
    menuBtn.className = 'icon icon-menu header__menu-icon';

    const menuContent = document.createElement('div');
    menuContent.className = 'hamburger-menu-content';
    const list = document.createElement('ul');
    list.className = 'hamburger-menu__list';

    // 1. Estructura de datos con las rutas asociadas a cada opción
    const menuItems = [
        { label: 'Inicio', href: 'home.html' },
        { label: 'Novedades', href: 'home.html#novedades' },
        { label: 'Categorias:', isTitle: true },
        { label: 'Acción', href: 'home.html#accion' },
        { label: 'Deportes', href: 'home.html#deportes' },
        { label: 'Estrategia', href: 'home.html#estrategia' },
        { label: 'Aventura', href: 'home.html#aventura' },
        { label: 'Pelea', href: 'home.html#pelea' }
    ];

    // 2. Funcion que crea los ítems con asignación de href
    const createMenuItem = ({ label, href, isTitle = false }) => {
        const li = document.createElement('li');

        if (isTitle) {
            li.className = 'hamburger-menu__title';
            li.textContent = label;
        } else {
            const a = document.createElement('a');
            a.href = href || '#';
            a.className = 'hamburger-menu__link';
            a.textContent = label;
            li.appendChild(a);
        }

        return li;
    };

    // 3. Generacion dinámica de la lista
    menuItems.forEach(item => {
        list.appendChild(createMenuItem(item));
    });

    menuContent.appendChild(list);
    return Dropdown(menuBtn, menuContent, 'left');
}