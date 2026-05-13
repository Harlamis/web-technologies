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
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

const countrySelect = document.getElementById('country');
const citySelect = document.getElementById('city');

const cities = {
    ukraine: ["Kyiv", "Lviv", "Odesa", "Chernivtsi"],
    poland: ["Warsaw", "Krakow", "Gdansk"]
};

countrySelect.addEventListener('change', function() {
    citySelect.innerHTML = '<option value="">Select city...</option>';
    const selectedCountry = this.value;
    
    if (selectedCountry) {
        citySelect.disabled = false;
        cities[selectedCountry].forEach(city => {
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

signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;

    const fName = document.getElementById('firstName');
    const lName = document.getElementById('lastName');
    
    if(fName.value.length < 3 || fName.value.length > 15) {
        showError(fName, 'Must be between 3 and 15 characters.');
        isValid = false;
    } else { showSuccess(fName); }

    if(lName.value.length < 3 || lName.value.length > 15) {
        showError(lName, 'Must be between 3 and 15 characters.');
        isValid = false;
    } else { showSuccess(lName); }

    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email (e.g. test@gmail.com).');
        isValid = false;
    } else { showSuccess(email); }

    const pass = document.getElementById('reg-password');
    const confPass = document.getElementById('confirm-password');
    
    if(pass.value.length < 6) {
        showError(pass, 'Password must be at least 6 characters.');
        isValid = false;
    } else { showSuccess(pass); }

    if(confPass.value !== pass.value || confPass.value === '') {
        showError(confPass, 'Passwords do not match.');
        isValid = false;
    } else { showSuccess(confPass); }

    const phone = document.getElementById('phone');
    const phoneRegex = /^\+380\d{9}$/;
    if(!phoneRegex.test(phone.value)) {
        showError(phone, 'Phone must start with +380 and contain 12 digits total.');
        isValid = false;
    } else { showSuccess(phone); }

    const dob = document.getElementById('dob');
    if(!dob.value) {
        showError(dob, 'Please select your date of birth.');
        isValid = false;
    } else {
        const birthDate = new Date(dob.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (birthDate > today) {
            showError(dob, 'Date cannot be in the future.');
            isValid = false;
        } else if (age < 12) {
            showError(dob, 'You must be at least 12 years old.');
            isValid = false;
        } else {
            showSuccess(dob);
        }
    }

    const sex = document.getElementById('sex');
    if(sex.value === '') { showError(sex, 'Please select your sex.'); isValid = false; } else { showSuccess(sex); }

    const countrySelectVal = document.getElementById('country');
    if(countrySelectVal.value === '') { showError(countrySelectVal, 'Please select a country.'); isValid = false; } else { showSuccess(countrySelectVal); }
    
    const citySelectVal = document.getElementById('city');
    if(citySelectVal.value === '') { showError(citySelectVal, 'Please select a city.'); isValid = false; } else { showSuccess(citySelectVal); }

    if(isValid) {
        this.reset();
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('success', 'error'));
        citySelect.disabled = true;
        
        const successDiv = document.getElementById('signup-success');
        successDiv.innerText = "Успішно зареєстровано!";
        setTimeout(() => successDiv.innerText = '', 3000);
    }
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    const username = document.getElementById('login-username');
    if(username.value.trim() === '') {
        showError(username, 'Username is required.');
        isValid = false;
    } else { showSuccess(username); }

    const loginPass = document.getElementById('login-password');
    if(loginPass.value.length < 6) {
        showError(loginPass, 'Password must be at least 6 characters.');
        isValid = false;
    } else { showSuccess(loginPass); }

    if(isValid) {
        this.reset();
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('success', 'error'));
        
        const successDiv = document.getElementById('login-success');
        successDiv.innerText = "Успішний вхід!";
        setTimeout(() => successDiv.innerText = '', 3000);
    }
}); 