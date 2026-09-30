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

    const logoDiv = document.createElement('div');
    logoDiv.className = 'header__logo';

    const redirectToHome = () => {
        window.location.href = "home.html";
    };

    const logoBox = document.createElement('div');
    logoBox.className = 'header__logo-box';
    const crownIcon = document.createElement('i');
    crownIcon.className = 'icon icon-crown';
    logoBox.appendChild(crownIcon);
    logoBox.addEventListener('click', (redirectToHome));



    const logoText = document.createElement('span');
    logoText.className = 'header__logo-text';
    // Para que "Kingly Games" quede en dos líneas
    logoText.innerHTML = 'Kingly<br>Games';
    logoText.addEventListener('click', (redirectToHome));



    logoDiv.append(logoBox, logoText);
    leftGroup.append(menuDropdown, logoDiv);

    // --- ZONA CENTRAL: Buscador ---
    const centerGroup = document.createElement('div');
    centerGroup.className = 'header__center';

    const searchContainer = document.createElement('div');
    searchContainer.className = 'header__search';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar un juego';
    searchInput.className = 'header__search-input';

    const searchIcon = document.createElement('i');
    searchIcon.className = 'icon icon-search header__search-icon';

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