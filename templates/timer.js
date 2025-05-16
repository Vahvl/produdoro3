let timerInterval;
let timeLeft = 0;
let timerWindow = null;

// Format time as HH:MM:SS
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Start the timer
function startTimer(hours, minutes, seconds) {
    timeLeft = hours * 3600 + minutes * 60 + seconds;
    localStorage.setItem('timeLeft', timeLeft);

    // Update the timer display
    updateTimerDisplay();

    // Start the countdown
    timerInterval = setInterval(() => {
        timeLeft--;
        localStorage.setItem('timeLeft', timeLeft);

        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (timerWindow && !timerWindow.closed) {
                timerWindow.close();
            }
        }
    }, 1000);
}

// Update the timer display on both the main page and popup
function updateTimerDisplay() {
    const timerDisplay = document.getElementById("timer");
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(timeLeft);
    }

    if (timerWindow && !timerWindow.closed) {
        const externalTimer = timerWindow.document.getElementById("external-timer");
        if (externalTimer) {
            externalTimer.textContent = formatTime(timeLeft);
        }
    }
}

// Open or reuse the timer window
function openTimerWindow() {
    if (!timerWindow || timerWindow.closed) {
        timerWindow = window.open("", "TimerWindow", "width=300,height=200");
        timerWindow.document.body.innerHTML = `
            <h1>Remaining Time</h1>
            <div id="external-timer">${formatTime(timeLeft)}</div>
        `;
    }
}

// Sync timer state from localStorage
function syncTimerState() {
    const storedTimeLeft = parseInt(localStorage.getItem('timeLeft'), 10);
    if (!isNaN(storedTimeLeft)) {
        timeLeft = storedTimeLeft;
        updateTimerDisplay();
    }
}

// Initialize the timer logic
function initializeTimer() {
    syncTimerState();
    if (timeLeft > 0 && !timerInterval) {
        startTimer(0, 0, timeLeft); // Resume the timer
    }
}

window.addEventListener('storage', syncTimerState);