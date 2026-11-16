import Button from '../atoms/Button.js';
import HamburgerMenu from "../molecules/HamburgerMenu.js";
import UserMenu from '../molecules/UserMenu.js';

export default function Header() {
    const header = document.createElement('header');
    header.className = 'organism-header';

    // --- ZONA IZQUIERDA: Menú y Logo ---
    const leftGroup = document.createElement('div');
    leftGroup.className = 'header__left';

    const menuDropdown = HamburgerMenu();

    // Cambiado a etiqueta <a> semántica para el Logo
    const logoLink = document.createElement('a');
    logoLink.className = 'header__logo';
    logoLink.href = 'home.html';
    logoLink.setAttribute('aria-label', 'Kingly Games - Ir al inicio');

    const logoBox = document.createElement('div');
    logoBox.className = 'header__logo-box';
    const crownIcon = document.createElement('i');
    crownIcon.className = 'icon icon-crown';
    crownIcon.setAttribute('aria-hidden', 'true');
    logoBox.appendChild(crownIcon);

    const logoText = document.createElement('span');
    logoText.className = 'header__logo-text';
    logoText.innerHTML = 'Kingly<br>Games';

    logoLink.append(logoBox, logoText);
    leftGroup.append(menuDropdown, logoLink);

    // --- ZONA CENTRAL: Buscador ---
    const centerGroup = document.createElement('div');
    centerGroup.className = 'header__center';

    const searchContainer = document.createElement('div');
    searchContainer.className = 'header__search';

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'Buscar un juego...';
    searchInput.className = 'header__search-input';
    searchInput.setAttribute('aria-label', 'Buscar un juego');

    const searchIcon = document.createElement('i');
    searchIcon.className = 'icon icon-search header__search-icon';
    searchIcon.setAttribute('aria-hidden', 'true');

    searchContainer.append(searchInput, searchIcon);
    centerGroup.appendChild(searchContainer);

    // --- ZONA DERECHA: Acciones ---
    const rightGroup = document.createElement('div');
    rightGroup.className = 'header__right';

    const myGamesBtn = Button("Mis juegos", "button", "primary", "medium");
    myGamesBtn.classList.add("header__btn-mis-juegos");

    const userDropdown = UserMenu();

    rightGroup.append(myGamesBtn, userDropdown);

    header.append(leftGroup, centerGroup, rightGroup);

    return header;
}