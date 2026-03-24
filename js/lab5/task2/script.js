let red = document.getElementById('red');
let yellow = document.getElementById('yellow');
let green = document.getElementById('green');
let statusDiv = document.getElementById('status');
let nextBtn = document.getElementById('next');
let changeBtn = document.getElementById('change');

let timings = { red: 5000, yellow: 3000, green: 7000 };
let currentState = 'red';
let intervalId = null;
let timeoutId = null;

function setLight(state) {
    red.style.backgroundColor = 'gray';
    yellow.style.backgroundColor = 'gray';
    green.style.backgroundColor = 'gray';
    if (state === 'red') red.style.backgroundColor = 'red';
    if (state === 'yellow') yellow.style.backgroundColor = 'yellow';
    if (state === 'green') green.style.backgroundColor = 'green';
    if (state === 'blinking') {
        let blinkCount = 0;
        intervalId = setInterval(() => {
            yellow.style.backgroundColor = yellow.style.backgroundColor === 'yellow' ? 'gray' : 'yellow';
            blinkCount++;
            if (blinkCount >= 6) {
                clearInterval(intervalId);
                setLight('red');
                statusDiv.textContent = 'Red';
                startCycle();
            }
        }, 500);
    }
    statusDiv.textContent = state.charAt(0).toUpperCase() + state.slice(1);
}

function startCycle() {
    setLight('red');
    timeoutId = setTimeout(() => {
        setLight('yellow');
        timeoutId = setTimeout(() => {
            setLight('green');
            timeoutId = setTimeout(() => {
                setLight('blinking');
            }, timings.green);
        }, timings.yellow);
    }, timings.red);
}

changeBtn.addEventListener('click', () => {
    let newRed = prompt('Red duration (ms):', timings.red);
    let newYellow = prompt('Yellow duration (ms):', timings.yellow);
    let newGreen = prompt('Green duration (ms):', timings.green);
    if (newRed) timings.red = parseInt(newRed);
    if (newYellow) timings.yellow = parseInt(newYellow);
    if (newGreen) timings.green = parseInt(newGreen);
});

startCycle();