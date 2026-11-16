import Link from '../atoms/Link.js';

/**
 * @param {Array<{label: string, href?: string}>} items - Lista de rutas
 * Ejemplo: [{ label: "Inicio", href: "home.html" }, { label: "Juegos", href: "home.html#juegos" }, { label: "Nombre del Juego" }]
 */
export default function Breadcrumbs(items = []) {
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "breadcrumb");
    nav.className = "molecule-breadcrumbs";

    const ol = document.createElement("ol");
    ol.className = "breadcrumbs__list";

    items.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "breadcrumbs__item";

        const isLast = index === items.length - 1;

        if (isLast || !item.href) {
            // Último elemento: indica la página actual y no lleva enlace
            const span = document.createElement("span");
            span.textContent = item.label;
            span.className = "breadcrumbs__current";
            span.setAttribute("aria-current", "page");
            li.appendChild(span);
        } else {
            // Elementos anteriores: reutiliza el átomo Link.js
            const link = Link(item.label, item.href);
            link.className = "breadcrumbs__link";
            li.appendChild(link);
        }

        ol.appendChild(li);
    });

    nav.appendChild(ol);
    return nav;
}