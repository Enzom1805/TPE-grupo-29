import { playCompletionSound } from "../../utils/sound.js";

export default function Loader() {
    const container = document.createElement("div");
    container.className = "loader-container";

    const iconContainer = document.createElement("div");
    iconContainer.className = "loader-icon-container";

    const infoWrapper = document.createElement("div");
    infoWrapper.className = "loader-info-wrapper";

    const title = document.createElement("h1");
    title.className = "loader-title";
    title.textContent = "Kingly Games";

    const text = document.createElement("p");
    text.className = "loader-text";
    text.textContent = "0%";

    infoWrapper.appendChild(title);
    infoWrapper.appendChild(text);

    container.appendChild(iconContainer);
    container.appendChild(infoWrapper);

    let stop1, stop2;

    fetch("../assets/icons/crown.svg")
        .then((res) => res.text())
        .then((svgText) => {
            iconContainer.innerHTML = svgText;
            const svg = iconContainer.querySelector("svg");
            if (!svg) return;

            svg.classList.add("loader-icon");

            const svgNS = "http://www.w3.org/2000/svg";
            let defs = svg.querySelector("defs");
            if (!defs) {
                defs = document.createElementNS(svgNS, "defs");
                svg.insertBefore(defs, svg.firstChild);
            }

            const gradient = document.createElementNS(svgNS, "linearGradient");
            gradient.setAttribute("id", "crown-fill-gradient");
            gradient.setAttribute("x1", "0%");
            gradient.setAttribute("y1", "0%");
            gradient.setAttribute("x2", "100%");
            gradient.setAttribute("y2", "0%");

            stop1 = document.createElementNS(svgNS, "stop");
            stop1.setAttribute("offset", "0%");
            stop1.classList.add("stop-fill");

            stop2 = document.createElementNS(svgNS, "stop");
            stop2.setAttribute("offset", "0%");
            stop2.classList.add("stop-bg");

            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            defs.appendChild(gradient);
        })
        .catch((err) => console.error("Error al cargar crown.svg:", err));

    let progress = 0;
    const intervalTime = 50;
    const totalTime = 5000;
    const increment = 100 / (totalTime / intervalTime);

    const loadingInterval = setInterval(() => {
        progress += increment;

        if (progress >= 100) {
            clearInterval(loadingInterval);

            text.textContent = "100%";
            if (stop1 && stop2) {
                stop1.setAttribute("offset", "100%");
                stop2.setAttribute("offset", "100%");
            }

            // Dispara la transición de bienvenida (sale porcentaje, entra título)
            container.classList.add("is-complete");

            // Reproduce el sonido exactamente al mismo tiempo que sale el título
            playCompletionSound();

            // Pausa de 1.2s para mostrar el título antes de ocultar y remover el loader
            setTimeout(() => {
                container.classList.add("is-hidden");
                setTimeout(() => {
                    container.remove();
                }, 500);
            }, 810);
        } else {
            const currentProgress = Math.floor(progress);
            text.textContent = `${currentProgress}%`;

            if (stop1 && stop2) {
                stop1.setAttribute("offset", `${currentProgress}%`);
                stop2.setAttribute("offset", `${currentProgress}%`);
            }
        }
    }, intervalTime);

    return container;
}