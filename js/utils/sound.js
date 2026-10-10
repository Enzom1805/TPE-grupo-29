// --- AUDIOS ---
const completeSound = new Audio("../assets/sounds/introHome.mp3");
const swipeRightSound = new Audio("../assets/sounds/SwipeRight.mp3");
const swipeLeftSound = new Audio("../assets/sounds/SwipeLeft.mp3");

// Precarga para asegurar reproducción instantánea
swipeRightSound.preload = "auto";
swipeLeftSound.preload = "auto";

// --- LOADER ---
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
    if (sessionStorage.getItem("hasPlayedWelcomeSound")) return;

    sessionStorage.setItem("hasPlayedWelcomeSound", "true");
    completeSound.currentTime = 0;
    completeSound.muted = false;

    completeSound.play().catch((err) => {
        console.warn("Autoplay omitido:", err);
    });
}

// --- EFECTOS DEL CARRUSEL ---
export function playSwipeRightSound() {
    swipeRightSound.currentTime = 0;
    swipeRightSound.play().catch(() => {});
}

export function playSwipeLeftSound() {
    swipeLeftSound.currentTime = 0;
    swipeLeftSound.play().catch(() => {});
}