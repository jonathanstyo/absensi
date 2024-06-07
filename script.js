let loggedIn = false;
let username = '';
let logHistory = [];

async function getCurrentTime() {
    const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Jakarta');
    const data = await response.json();
    return new Date(data.datetime);
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

async function updateClock() {
    const clockElement = document.getElementById('clock');
    const currentTime = await getCurrentTime();
    clockElement.textContent = formatTime(currentTime);
}

function updateLogHistory(action, status) {
    const logTableBody = document.getElementById('logTable').getElementsByTagName('tbody')[0];
    const newRow = logTableBody.insertRow();
    const timeCell = newRow.insertCell(0);
    const actionCell = newRow.insertCell(1);
    const statusCell = newRow.insertCell(2);

    const currentTime = new Date();
    timeCell.textContent = formatTime(currentTime);
    actionCell.textContent = action;
    statusCell.textContent = status;

    logHistory.push({ time: formatTime(currentTime), action, status });
}

async function checkIn() {
    const currentTime = await getCurrentTime();
    const formattedTime = formatTime(currentTime).slice(0, 5);
    const message = document.getElementById('message');
    let status;

    if (formattedTime > '08:10') {
        message.textContent = 'Telat';
        status = 'Telat';
    } else {
        message.textContent = 'Check-in Successful';
        status = 'Tepat Waktu';
    }

    updateLogHistory('Check In', status);

    document.getElementById('checkInButton').style.display = 'none';
    document.getElementById('checkOutButton').style.display = 'block';
}

async function checkOut() {
    const currentTime = await getCurrentTime();
    const formattedTime = formatTime(currentTime).slice(0, 5);
    const message = document.getElementById('message');
    let status;

    if (formattedTime < '17:00') {
        message.textContent = 'Pulang duluan';
        status = 'Pulang Duluan';
    } else {
        message.textContent = 'Check-out Successful';
        status = 'Tepat Waktu';
    }

    updateLogHistory('Check Out', status);

    document.getElementById('checkInButton').style.display = 'block';
    document.getElementById('checkOutButton').style.display = 'none';
}

function login() {
    username = document.getElementById('username').value;
    if (username) {
        loggedIn = true;
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        document.getElementById('message').textContent = `Welcome, ${username}`;
    } else {
        alert('Please enter a username');
    }
}

// Update the clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call to set the clock immediately
