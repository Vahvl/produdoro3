let timerInterval;
const alarmSound = document.getElementById("alarm-sound");
const THEMES = {
    default: {
        bgColor: "#f0f8ff",
        sidebarColor: "#333333",
        accent: "#04AA6D",
        accentHover: "#037a50"
    },
    darkblue: {
        bgColor: "#eaf2fb",        // much lighter blue background
        sidebarColor: "#16213a",   // much darker sidebar
        accent: "#3fa7ff",
        accentHover: "#2677b7"
    },
    swedbank: {
        bgColor: "#fff7f0",
        sidebarColor: "#ff8000",
        accent: "#ffb347",
        accentHover: "#ff9900"
    }
};

function getTheme() {
    return localStorage.getItem("theme") || "default";
}

function applyTheme() {
    const theme = THEMES[getTheme()] || THEMES.default;
    document.body.style.backgroundColor = theme.bgColor;
    const sidebarEl = document.querySelector("ul");
    if (sidebarEl) sidebarEl.style.backgroundColor = theme.sidebarColor;
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
        progressBar.style.backgroundColor = theme.sidebarColor;
    }

    // Lisa või uuenda dünaamiline stiil
    let styleTag = document.getElementById("sidebar-dynamic-style");
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "sidebar-dynamic-style";
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = `
        ul li a.active {
            background-color: ${theme.accent} !important;
            color: white !important;
        }
        ul li a:hover:not(.active) {
            background-color: ${theme.accentHover} !important;
            color: white !important;
        }
        .add-task-form button, #add-column-btn {
            background-color: ${theme.accent} !important;
        }
        .add-task-form button:hover, #add-column-btn:hover {
            background-color: ${theme.accentHover} !important;
        }
    `;
}

function isAudioEnabled() {
    const value = localStorage.getItem("audioEnabled");
    return value === "true";
}

function updateTimer(event) {
    event.preventDefault();
    const hours = parseInt(document.getElementById("tunnid").value) || 0;
    const minutes = parseInt(document.getElementById("minutid").value) || 0;
    const seconds = parseInt(document.getElementById("sekundid").value) || 0;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds ;
    localStorage.setItem("remainingTime", totalSeconds);
    startTimer(totalSeconds);
}

function startTimer(duration) {
    clearInterval(timerInterval);
    let remainingTime = duration;

    // Update the progress bar
    const progressBar = document.getElementById("progress-bar");

    timerInterval = setInterval(() => {
        if (remainingTime <= 0) {
            progressBar.style.width = "0%";
            clearInterval(timerInterval);

            clearInterval(progressBarInterval); // Stop progress bar updates
            if (isAudioEnabled()) {
                alarmSound.play();
            }
            localStorage.removeItem("remainingTime"); // Set progress bar to empty
            return;
        }

        remainingTime--;
        localStorage.setItem("remainingTime", remainingTime);
        updateTimerDisplay(remainingTime);
        // Update progress bar width
        const progressPercentage = (remainingTime / duration) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    document.getElementById("timer").textContent = `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function resumeTimer() {
    const remainingTime = parseInt(localStorage.getItem("remainingTime"));
    if (!isNaN(remainingTime) && remainingTime > 0) {
        startTimer(remainingTime);
        updateTimerDisplay(remainingTime);
    }
}

// Resume the timer when the page loads
document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    resumeTimer()
});