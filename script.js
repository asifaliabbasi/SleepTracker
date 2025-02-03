let startTime, endTime, sleepData = [], timerInterval;

// Handle User Login
document.getElementById('login-btn').addEventListener('click', function() {
    let username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('greeting').innerText = `Welcome, ${username}!`;
        document.getElementById('login-section').style.display = 'none';
    }
});

// Auto-fill login if user already logged in
window.onload = function() {
    let storedUser = localStorage.getItem('username');
    if (storedUser) {
        document.getElementById('greeting').innerText = `Welcome back, ${storedUser}!`;
        document.getElementById('login-section').style.display = 'none';
    }

    let storedData = localStorage.getItem('sleepData');
    if (storedData) {
        sleepData = JSON.parse(storedData);
        updateChart();
    }
};

// Sleep Tracking with Timer
document.getElementById('startSleep').addEventListener('click', function() {
    startTime = new Date();
    this.disabled = true;
    document.getElementById('stopSleep').disabled = false;
    document.getElementById('resetSleep').disabled = false;

    // Start live timer
    timerInterval = setInterval(updateLiveTimer, 1000);
});

document.getElementById('stopSleep').addEventListener('click', function() {
    endTime = new Date();
    let duration = (endTime - startTime) / 1000 / 60 / 60; // Convert to hours
    document.getElementById('sleepDuration').innerText = `You slept for ${duration.toFixed(2)} hours.`;

    // Stop live timer
    clearInterval(timerInterval);
    document.getElementById('liveTimer').innerText = "00:00:00";

    // Store sleep data
    let date = new Date().toLocaleDateString();
    sleepData.push({ date, duration: duration.toFixed(2) });
    localStorage.setItem('sleepData', JSON.stringify(sleepData));

    updateChart();
    generateAIAdvice(duration);

    this.disabled = true;
    document.getElementById('startSleep').disabled = false;
    document.getElementById('resetSleep').disabled = true;
});

// Reset Timer
document.getElementById('resetSleep').addEventListener('click', function() {
    // Reset the timer and UI
    clearInterval(timerInterval);
    document.getElementById('liveTimer').innerText = "00:00:00";
    document.getElementById('sleepDuration').innerText = "Sleep duration will appear here.";

    // Enable the start button and disable others
    document.getElementById('startSleep').disabled = false;
    document.getElementById('stopSleep').disabled = true;
    document.getElementById('resetSleep').disabled = true;
});

// Live Timer Function
function updateLiveTimer() {
    let elapsedTime = Math.floor((new Date() - startTime) / 1000); // Get elapsed seconds
    let hours = Math.floor(elapsedTime / 3600);
    let minutes = Math.floor((elapsedTime % 3600) / 60);
    let seconds = elapsedTime % 60;
    
    document.getElementById('liveTimer').innerText = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
}

// Helper function to format time
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Update Chart.js Graph
function updateChart() {
    let ctx = document.getElementById('sleepChart').getContext('2d');
    let labels = sleepData.map(d => d.date);
    let data = sleepData.map(d => d.duration);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sleep Duration (hours)',
                data: data,
                borderColor: '#4CAF50',
                fill: false
            }]
        }
    });
}

// AI Sleep Recommendation
function generateAIAdvice(sleepHours) {
    let advice = sleepHours < 6 ? "Try to get at least 7 hours of sleep for better health." : "Great job! Keep it up!";
    document.getElementById('sleepAdvice').innerText = advice;
}