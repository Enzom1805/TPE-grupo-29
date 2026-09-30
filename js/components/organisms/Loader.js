export default function Loader(onComplete) {

    const container = document.createElement("div");
    container.className = "loader-container";

    const spinner = document.createElement("div");
    spinner.className = "loader-spinner";

    const text = document.createElement("p");
    text.className = "loader-text";
    text.textContent = "0%";

    container.appendChild(spinner);
    container.appendChild(text);

    let progress = 0;
    const intervalTime = 50;
    const totalTime = 5000;
    const increment = 100 / (totalTime / intervalTime);

    const loadingInterval = setInterval(() => {

        progress += increment;

        if (progress >= 100) {

            progress = 100;
            clearInterval(loadingInterval);

            text.textContent = "100%";

            container.style.opacity = "0";

            setTimeout(() => {

                container.remove();

                // Cuando termina el Loader
                if (onComplete) {
                    onComplete();
                }

            }, 500);

        } else {

            text.textContent = `${Math.floor(progress)}%`;

        }

    }, intervalTime);

    return container;
}