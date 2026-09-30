export default function Footer() {
    const footer = document.createElement('footer');
    footer.className = 'organism-footer';

    // Contenedor principal (Grid)
    const mainContainer = document.createElement('div');
    mainContainer.className = 'footer__main';

    // --- Columna 1: Marca y Redes ---
    const brandCol = document.createElement('div');
    brandCol.className = 'footer__brand-col';

    const logoContainer = document.createElement('div');
    logoContainer.className = 'footer__logo';

    const logoIconDiv = document.createElement('div');
    logoIconDiv.className = 'footer__logo-icon';

    const crownIcon = document.createElement('i');
    crownIcon.className = 'icon icon-crown';
    logoIconDiv.appendChild(crownIcon);

    const logoText = document.createElement('span');
    logoText.className = 'footer__logo-text';
    logoText.textContent = 'Kingly Games';

    logoContainer.append(logoIconDiv, logoText);

    const description = document.createElement('p');
    description.className = 'footer__description';
    // Mantenemos innerHTML acá solo por los saltos de línea (<br>)
    description.innerHTML = 'Tu pagina definitiva para<br>juegos online.<br>Sin descargas, Rapido y<br>Muchas horas de vicio.';

    const socials = document.createElement('div');
    socials.className = 'footer__socials';

    // Helper interno para crear átomos de redes sociales
    const createSocialLink = (iconClass) => {
        const a = document.createElement('a');
        a.href = '#';
        const icon = document.createElement('i');
        icon.className = `icon ${iconClass}`;
        a.appendChild(icon);
        return a;
    };

    socials.append(
        createSocialLink('icon-instagram'),
        createSocialLink('icon-facebook'),
        createSocialLink('icon-twitter')
    );

    brandCol.append(logoContainer, description, socials);

    // --- Helper para crear columnas de enlaces (Molécula temporal) ---
    const createNavColumn = (titleText, linksArray) => {
        const col = document.createElement('div');
        col.className = 'footer__nav-col';

        const title = document.createElement('h4');
        title.className = 'footer__title';
        title.textContent = titleText;

        const list = document.createElement('ul');
        list.className = 'footer__list';

        linksArray.forEach(linkText => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = linkText;
            li.appendChild(a);
            list.appendChild(li);
        });

        col.append(title, list);
        return col;
    };

    // Instanciamos las 3 columnas de navegación
    const catCol = createNavColumn('Categorias', ['Acción', 'Deportes', 'Estrategia', 'Aventura', 'Pelea']);
    const supportCol = createNavColumn('Soporte', ['Ayuda', 'Desarrolladores', 'Contacto', 'FAQ', 'Comunidad']);
    const legalCol = createNavColumn('Legal', ['Privacidad', 'Terminos de Servicio', 'Politica de Cookies', 'Accesibilidad']);

    // Ensamblamos el Grid principal
    mainContainer.append(brandCol, catCol, supportCol, legalCol);

    // --- Barra inferior ---
    const bottomBar = document.createElement('div');
    bottomBar.className = 'footer__bottom';

    const bottomText = document.createElement('p');
    bottomText.textContent = '© 2026 Kingly Games. Todos los derechos reservados.';
    bottomBar.appendChild(bottomText);

    // Ensamblamos el Footer final
    footer.append(mainContainer, bottomBar);

    return footer;
}