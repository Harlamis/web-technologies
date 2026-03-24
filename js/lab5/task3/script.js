let clockDiv = document.getElementById('clock');
let countdownDisplay = document.getElementById('countdown-display');
let calendarDisplay = document.getElementById('calendar-display');
let birthdayCountdown = document.getElementById('birthday-countdown');

function updateClock() {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    clockDiv.textContent = hours + ':' + minutes + ':' + seconds;
}

setInterval(updateClock, 1000);
updateClock();

document.getElementById('start-countdown').addEventListener('click', () => {
    let target = new Date(document.getElementById('target-date').value);
    let interval = setInterval(() => {
        let now = new Date();
        let diff = target - now;
        if (diff <= 0) {
            countdownDisplay.textContent = 'Time is up!';
            clearInterval(interval);
        } else {
            let days = Math.floor(diff / (1000 * 60 * 60 * 24));
            let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((diff % (1000 * 60)) / 1000);
            countdownDisplay.textContent = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
        }
    }, 1000);
});

document.getElementById('show-calendar').addEventListener('click', () => {
    let month = parseInt(document.getElementById('month').value) - 1;
    let year = parseInt(document.getElementById('year').value);
    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarDisplay.innerHTML = '';
    for (let i = 0; i < firstDay; i++) {
        let div = document.createElement('div');
        calendarDisplay.appendChild(div);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        let div = document.createElement('div');
        div.className = 'day';
        div.textContent = day;
        calendarDisplay.appendChild(div);
    }
});

document.getElementById('set-birthday').addEventListener('click', () => {
    let birthday = new Date(document.getElementById('birthday').value);
    let now = new Date();
    let nextBirthday = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate());
    if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    let diff = nextBirthday - now;
    let months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    let days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);
    birthdayCountdown.textContent = months + ' months, ' + days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
});