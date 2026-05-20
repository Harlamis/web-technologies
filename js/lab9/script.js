const tabSignup = document.getElementById('tab-signup');
const tabLogin = document.getElementById('tab-login');
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

tabSignup.addEventListener('click', () => {
  tabSignup.classList.add('active');
  tabLogin.classList.remove('active');
  signupForm.classList.replace('hidden-form', 'active-form');
  loginForm.classList.replace('active-form', 'hidden-form');
});

tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabSignup.classList.remove('active');
  loginForm.classList.replace('hidden-form', 'active-form');
  signupForm.classList.replace('active-form', 'hidden-form');
});

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

const countrySelect = document.getElementById('country');
const citySelect = document.getElementById('city');

const cities = {
  ukraine: ['Kyiv', 'Lviv', 'Odesa', 'Chernivtsi'],
  poland: ['Warsaw', 'Krakow', 'Gdansk'],
};

countrySelect.addEventListener('change', function () {
  citySelect.innerHTML = '<option value="">Select city...</option>';
  const selectedCountry = this.value;

  if (selectedCountry) {
    citySelect.disabled = false;
    cities[selectedCountry].forEach((city) => {
      const option = document.createElement('option');
      option.value = city.toLowerCase();
      option.textContent = city;
      citySelect.appendChild(option);
    });
  } else {
    citySelect.disabled = true;
  }
});

function showError(inputElement, message) {
  const formControl = inputElement.parentElement;
  formControl.classList.remove('success');
  formControl.classList.add('error');
  const small = formControl.querySelector('.error-text');
  small.innerText = message;
}

function showSuccess(inputElement) {
  const formControl = inputElement.parentElement;
  formControl.classList.remove('error');
  formControl.classList.add('success');
}

signupForm.addEventListener('submit', function (e) {
  e.preventDefault();

  let isValid = true;

  const fName = document.getElementById('firstName');
  const lName = document.getElementById('lastName');
  const email = document.getElementById('email');
  const pass = document.getElementById('reg-password');
  const confPass = document.getElementById('confirm-password');
  const phone = document.getElementById('phone');
  const dob = document.getElementById('dob');
  const sex = document.getElementById('sex');
  const country = document.getElementById('country');
  const city = document.getElementById('city');

  if (fName.value.length < 3 || fName.value.length > 15) {
    showError(fName, 'Must be between 3 and 15 characters.');
    isValid = false;
  } else {
    showSuccess(fName);
  }

  if (lName.value.length < 3 || lName.value.length > 15) {
    showError(lName, 'Must be between 3 and 15 characters.');
    isValid = false;
  } else {
    showSuccess(lName);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    showError(email, 'Please enter a valid email.');
    isValid = false;
  } else {
    showSuccess(email);
  }

  if (pass.value.length < 6) {
    showError(pass, 'Password must be at least 6 characters.');
    isValid = false;
  } else {
    showSuccess(pass);
  }

  if (confPass.value !== pass.value || confPass.value === '') {
    showError(confPass, 'Passwords do not match.');
    isValid = false;
  } else {
    showSuccess(confPass);
  }

  const phoneRegex = /^\+380\d{9}$/;
  if (!phoneRegex.test(phone.value)) {
    showError(phone, 'Phone must be like +380XXXXXXXXX.');
    isValid = false;
  } else {
    showSuccess(phone);
  }

  if (!dob.value) {
    showError(dob, 'Required.');
    isValid = false;
  } else {
    const birthDate = new Date(dob.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (birthDate > today) {
      showError(dob, 'Date cannot be in the future.');
      isValid = false;
    } else if (age < 12) {
      showError(dob, 'Must be at least 12 years old.');
      isValid = false;
    } else {
      showSuccess(dob);
    }
  }

  if (sex.value === '') {
    showError(sex, 'Required.');
    isValid = false;
  } else {
    showSuccess(sex);
  }
  if (country.value === '') {
    showError(country, 'Required.');
    isValid = false;
  } else {
    showSuccess(country);
  }
  if (city.value === '') {
    showError(city, 'Required.');
    isValid = false;
  } else {
    showSuccess(city);
  }

  if (isValid) {
    const newUser = {
      username: email.value,
      password: pass.value,
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    this.reset();
    document
      .querySelectorAll('.form-control')
      .forEach((el) => el.classList.remove('success', 'error'));
    citySelect.disabled = true;

    const successDiv = document.getElementById('signup-success');
    successDiv.innerText = 'Успішно зареєстровано та збережено!';
    setTimeout(() => (successDiv.innerText = ''), 3000);
  }
});

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let isValid = true;

  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');

  if (usernameInput.value.trim() === '') {
    showError(usernameInput, 'Username is required.');
    isValid = false;
  } else {
    showSuccess(usernameInput);
  }

  if (passwordInput.value.length < 6) {
    showError(passwordInput, 'Min 6 characters.');
    isValid = false;
  } else {
    showSuccess(passwordInput);
  }

  if (isValid) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userFound = users.find(
      (u) =>
        u.username === usernameInput.value && u.password === passwordInput.value
    );

    if (userFound) {
      this.reset();
      document
        .querySelectorAll('.form-control')
        .forEach((el) => el.classList.remove('success', 'error'));
      const successDiv = document.getElementById('login-success');
      successDiv.innerText = 'Успішний вхід!';
      setTimeout(() => (successDiv.innerText = ''), 3000);
    } else {
      showError(usernameInput, 'Невірний логін або пароль');
      showError(passwordInput, 'Невірний логін або пароль');
    }
  }
});
