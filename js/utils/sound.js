const completeSound = new Audio("../assets/sounds/introHome.mp3");

// Escucha el primer clic o toque en la pantalla para desbloquear el permiso de audio
const unlockAudio = () => {
    completeSound.muted = true;
    completeSound.play()
        .then(() => {
            completeSound.pause();
            completeSound.currentTime = 0;
            completeSound.muted = false;
        })
        .catch(() => {});
};

document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });

export function playCompletionSound() {
    // 1. Verificamos si ya se reprodujo en esta pestaña/sesión
    if (sessionStorage.getItem("hasPlayedWelcomeSound")) {
        return;
    }

    // 2. Guardamos la marca en sessionStorage para no repetirlo
    sessionStorage.setItem("hasPlayedWelcomeSound", "true");

    // 3. Intentamos reproducir el sonido
    completeSound.currentTime = 0;
    completeSound.muted = false;

    completeSound.play().catch((err) => {
        console.warn("Autoplay omitido (el usuario no interactuó con la página antes de terminar la carga).", err);
    });
}