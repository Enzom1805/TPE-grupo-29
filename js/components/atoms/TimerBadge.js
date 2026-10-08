/** Muestra el tiempo transcurrido o la cuenta regresiva formateada (MM:SS). **/

export function TimerBadge() {
    const container = document.createElement('div');
    container.className = 'atom-timer-badge';

    const icon = document.createElement('span');
    icon.className = 'atom-timer-badge__icon';
    icon.textContent = '⏱️';

    const value = document.createElement('span');
    value.className = 'atom-timer-badge__value';
    value.textContent = '00:00';

    container.appendChild(icon);
    container.appendChild(value);

    let secondsElapsed = 0;
    let timerInterval = null;

    const updateDisplay = () => {
        const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
        const secs = String(secondsElapsed % 60).padStart(2, '0');
        value.textContent = `${mins}:${secs}`;
    };

    const start = () => {
        stop();
        secondsElapsed = 0;
        updateDisplay();
        timerInterval = setInterval(() => {
            secondsElapsed++;
            updateDisplay();
        }, 1000);
    };

    const stop = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    };

    const reset = () => {
        start();
    };

    const addSeconds = (seconds) => {
        secondsElapsed += seconds;
        updateDisplay();
    };

    const getTimeFormatted = () => value.textContent;

    return {
        element: container,
        start,
        stop,
        reset,
        addSeconds,
        getTimeFormatted
    };
}