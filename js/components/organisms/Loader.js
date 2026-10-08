export default function Loader() {
    const container = document.createElement("div");
    container.className = "loader-container";

    const spinner = document.createElement("div");
    spinner.className = "loader-spinner";

    // Contenedor principal de la barra (pista)
    const progressBar = document.createElement("div");
    progressBar.className = "loader-progress";

    // Elemento interno que se irá rellenando
    const progressFill = document.createElement("div");
    progressFill.className = "loader-progress-fill";
    progressBar.appendChild(progressFill);

    const text = document.createElement("p");
    text.className = "loader-text";
    text.textContent = "0%";

    container.appendChild(spinner);
    container.appendChild(progressBar);
    container.appendChild(text);

    let progress = 0;
    const intervalTime = 50;
    const totalTime = 5000;
    const increment = 100 / (totalTime / intervalTime);

    const loadingInterval = setInterval(() => {
        progress += increment;

        if (progress >= 100) {
            clearInterval(loadingInterval);

            text.textContent = "100%";
            progressFill.style.width = "100%";

            container.style.opacity = "0";

            setTimeout(() => {
                container.remove();
            }, 500);
        } else {
            const currentProgress = Math.floor(progress);
            text.textContent = `${currentProgress}%`;
            progressFill.style.width = `${currentProgress}%`;
        }
    }, intervalTime);

    return container;
}