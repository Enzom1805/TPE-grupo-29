export function TimerBadge(options = {}) {
    const { maxTime = null, onTimeUp = null } = options;

    const container = document.createElement('div');
    container.className = 'atom-timer-badge';

    const icon = document.createElement('span');
    icon.className = 'atom-timer-badge__icon';
    icon.textContent = '⏱️';

    const value = document.createElement('span');
    value.className = 'atom-timer-badge__value';
    value.textContent = maxTime ? formatTime(maxTime) : '00:00';

    container.appendChild(icon);
    container.appendChild(value);

    let currentSeconds = maxTime || 0;
    let timerInterval = null;

    function formatTime(seconds) {
        const displaySecs = Math.max(0, seconds);
        const mins = String(Math.floor(displaySecs / 60)).padStart(2, '0');
        const secs = String(displaySecs % 60).padStart(2, '0');
        return `${mins}:${secs}`;
    }

    const updateDisplay = () => {
        value.textContent = formatTime(currentSeconds);

        if (maxTime !== null && currentSeconds <= 10 && currentSeconds > 0) {
            value.classList.add('atom-timer-badge__value--alert');
        } else {
            value.classList.remove('atom-timer-badge__value--alert');
        }
    };

    const start = () => {
        stop();
        currentSeconds = maxTime || 0;
        updateDisplay();

        timerInterval = setInterval(() => {
            if (maxTime !== null) {
                currentSeconds--;
                updateDisplay();
                if (currentSeconds <= 0) {
                    stop();
                    if (onTimeUp) onTimeUp();
                }
            } else {
                currentSeconds++;
                updateDisplay();
            }
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

    const applyPenalty = (seconds) => {
        if (maxTime !== null) {
            currentSeconds -= seconds;
            if (currentSeconds <= 0) {
                currentSeconds = 0;
                updateDisplay();
                stop();
                if (onTimeUp) onTimeUp();
            }
        } else {
            currentSeconds += seconds;
        }
        updateDisplay();
    };

    const getTimeFormatted = () => value.textContent;

    const getTimeSpentFormatted = () => {
        const timeSpent = maxTime !== null ? (maxTime - currentSeconds) : currentSeconds;
        return formatTime(timeSpent);
    };

    return {
        element: container,
        start,
        stop,
        reset,
        applyPenalty,
        getTimeFormatted,
        getTimeSpentFormatted
    };
}