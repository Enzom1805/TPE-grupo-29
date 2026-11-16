import Dropdown from "../../utils/dropdown.js";
import Button from "../atoms/Button.js";

export default function UserMenu() {
    // 1. El Trigger
    const profileBox = document.createElement('div');
    profileBox.className = 'header__profile-box';
    const userIcon = document.createElement('i');
    userIcon.className = 'icon icon-user';
    profileBox.appendChild(userIcon);

    // 2. El contenido
    const menuContent = document.createElement('div');
    menuContent.className = 'user-menu-content';

    // Saludo superior
    const greeting = document.createElement('h4');
    greeting.className = 'user-menu__greeting';
    greeting.textContent = 'Hola usuario Premium!';

    // Lista de enlaces
    const list = document.createElement('ul');
    list.className = 'user-menu__list';


    const createMenuItem = (text) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'user-menu__link';
        a.textContent = text;
        li.appendChild(a);
        return li;
    };

    list.append(
        createMenuItem('Perfil'),
        createMenuItem('Administrar Suscripcion'),
        createMenuItem('Ajustes')
    );

    const footerAction = document.createElement('div');
    footerAction.className = 'user-menu__footer';

    const redirectToLogin = () => {
        window.location.href = "login.html";
    };

    const logoutBtn = Button("Cerrar Sesion", "button", "primary", "medium");
    logoutBtn.addEventListener('click', redirectToLogin);
    footerAction.appendChild(logoutBtn);


    menuContent.append(greeting, list, footerAction);

    return Dropdown(profileBox, menuContent, 'right');
}