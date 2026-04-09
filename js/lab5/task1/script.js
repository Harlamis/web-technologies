document.addEventListener('DOMContentLoaded', function () {
  const bulbToggle = document.getElementById('bulb-toggle');
  const bulbTypeSelect = document.getElementById('bulb-type-select');
  const timeoutInput = document.getElementById('timeout-input');
  const statusDiv = document.getElementById('status');
  const bulbBody = document.querySelector('.bulb-body');
  const glow = document.querySelector('.glow');

  let isOn = false;
  let inactivityTimer = null;
  // let timeoutId = null;

  const bulbColors = {
    incandescent: '#ffeb3b',
    led: '#ffffff',
    fluorescent: '#e8f5e8',
  };

  function updateBulbColor() {
    if (isOn) {
      bulbBody.style.fill = bulbColors[bulbTypeSelect.value];
    } else {
      bulbBody.style.fill = '#f0f0f0';
    }
  }

  function turnOn() {
    isOn = true;
    bulbToggle.textContent = 'Turn Off';
    glow.style.opacity = '1';
    statusDiv.textContent = 'Bulb is on';
    updateBulbColor();
    startInactivityTimer();
  }

  function turnOff() {
    isOn = false;
    bulbToggle.textContent = 'Turn On';
    glow.style.opacity = '0';
    statusDiv.textContent = 'Bulb is off';
    updateBulbColor();
    clearTimers();
  }

  function startInactivityTimer() {
    clearTimers();
    const timeout = parseInt(timeoutInput.value) * 1000;
    if (timeout > 0) {
      inactivityTimer = setTimeout(() => {
        turnOff();
      }, timeout);
    }
  }

  function resetInactivityTimer() {
    if (isOn) {
      startInactivityTimer();
    }
  }

  function clearTimers() {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
    // if (timeoutId) {
    //     clearTimeout(timeoutId);
    //     timeoutId = null;
    // }
  }

  bulbToggle.addEventListener('click', function () {
    if (isOn) {
      turnOff();
    } else {
      turnOn();
    }
  });

  bulbTypeSelect.addEventListener('change', updateBulbColor);

  timeoutInput.addEventListener('input', function () {
    if (isOn) {
      startInactivityTimer();
    }
  });

  // Activity events to reset timer
  ['mousemove', 'keydown', 'click', 'scroll'].forEach((event) => {
    document.addEventListener(event, resetInactivityTimer, true);
  });

  // Initial setup
  updateBulbColor();
});
