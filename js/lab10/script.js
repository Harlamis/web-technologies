if (!localStorage.getItem('usersDB')) {
    localStorage.setItem('usersDB', JSON.stringify({}));
}

let allUsers = []; 
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const ITEMS_PER_PAGE = 30;

let appState = {
    search: '',
    sort: '',
    gender: 'all',
    page: 1
};

const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');

const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');

const searchInput = document.getElementById('search-input');
const genderRadios = document.querySelectorAll('input[name="gender"]');
const sortBtns = document.querySelectorAll('.sort-btn');
const resetBtn = document.getElementById('reset-filters');

const cardsContainer = document.getElementById('cards-container');
const paginationContainer = document.getElementById('pagination-container');
const resultsCount = document.getElementById('results-count');
const errorMsg = document.getElementById('error-msg');

showRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
    loginForm.reset();
    loginError.classList.add('hidden');
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    registerForm.reset();
    registerError.classList.add('hidden');
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const usersDB = JSON.parse(localStorage.getItem('usersDB'));
    
    if (usersDB[data.username]) {
        registerError.textContent = 'Користувач з таким іменем вже існує!';
        registerError.classList.remove('hidden');
        return;
    }
    
    usersDB[data.username] = data.password;
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
    
    localStorage.setItem('currentUser', data.username);
    checkAuth();
    
    registerForm.reset();
    registerError.classList.add('hidden');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const usersDB = JSON.parse(localStorage.getItem('usersDB'));
    
    if (!usersDB[data.username] || usersDB[data.username] !== data.password) {
        loginError.textContent = 'Невірне ім\'я або пароль!';
        loginError.classList.remove('hidden');
        return;
    }
    
    localStorage.setItem('currentUser', data.username);
    checkAuth();
    
    loginForm.reset();
    loginError.classList.add('hidden');
});

const checkAuth = () => {
    const user = localStorage.getItem('currentUser');
    if (user) {
        authScreen.classList.add('hidden');
        appScreen.classList.remove('hidden');
        userDisplay.textContent = user;
        initApp();
    } else {
        authScreen.classList.remove('hidden');
        appScreen.classList.add('hidden');
    }
};

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    checkAuth();
});

const debounce = (fn, ms) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), ms);
    };
};

const fetchUsers = async () => {
    try {
        const res = await fetch('https://randomuser.me/api/?results=150&seed=lab10');
        if (!res.ok) throw new Error('Помилка сервера. Спробуйте пізніше.');
        const data = await res.json();
        allUsers = data.results;
        errorMsg.classList.add('hidden');
        applyStateAndRender();
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove('hidden');
    }
};

const filterUsers = (users, state) => {
    return users.filter(user => {
        const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
        const matchesSearch = fullName.includes(state.search.toLowerCase());
        const matchesGender = state.gender === 'all' || user.gender === state.gender;
        return matchesSearch && matchesGender;
    });
};

const sortUsers = (users, sortType) => {
    const copy = [...users];
    switch (sortType) {
        case 'name-asc': return copy.sort((a, b) => a.name.first.localeCompare(b.name.first));
        case 'name-desc': return copy.sort((a, b) => b.name.first.localeCompare(a.name.first));
        case 'age-asc': return copy.sort((a, b) => a.dob.age - b.dob.age);
        case 'age-desc': return copy.sort((a, b) => b.dob.age - a.dob.age);
        default: return copy;
    }
};

const paginateUsers = (users, page, perPage) => {
    const start = (page - 1) * perPage;
    return users.slice(start, start + perPage);
};

const syncUrlWithState = () => {
    const url = new URL(window.location);
    if (appState.search) url.searchParams.set('search', appState.search);
    else url.searchParams.delete('search');
    
    if (appState.gender !== 'all') url.searchParams.set('gender', appState.gender);
    else url.searchParams.delete('gender');
    
    if (appState.sort) url.searchParams.set('sort', appState.sort);
    else url.searchParams.delete('sort');

    if (appState.page > 1) url.searchParams.set('page', appState.page);
    else url.searchParams.delete('page');

    window.history.pushState(appState, '', url);
};

const readStateFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    appState.search = params.get('search') || '';
    appState.gender = params.get('gender') || 'all';
    appState.sort = params.get('sort') || '';
    appState.page = parseInt(params.get('page')) || 1;
    
    searchInput.value = appState.search;
    const targetRadio = document.querySelector(`input[name="gender"][value="${appState.gender}"]`);
    if (targetRadio) targetRadio.checked = true;
};

const renderCards = (users) => {
    if (users.length === 0) {
        cardsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Нікого не знайдено 😔</p>';
        return;
    }

    const html = users.map(user => {
        const isFav = favorites.includes(user.login.uuid);
        const bgClass = user.gender === 'female' ? 'female' : '';
        return `
            <div class="card">
                <div class="card-header ${bgClass}"></div>
                <button class="fav-btn" data-id="${user.login.uuid}">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <img src="${user.picture.large}" alt="${user.name.first}" class="card-img">
                <div class="card-info">
                    <h3>${user.name.first} ${user.name.last}</h3>
                    <p><strong>Вік:</strong> ${user.dob.age} років</p>
                    <p><strong>Телефон:</strong> ${user.phone}</p>
                    <p><strong>Місто:</strong> ${user.location.city}</p>
                    <p><strong>Email:</strong> ${user.email.substring(0, 15)}...</p>
                </div>
            </div>
        `;
    }).join('');
    
    cardsContainer.innerHTML = html;
};

const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    let html = '';
    
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === appState.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    paginationContainer.innerHTML = html;
};

const applyStateAndRender = () => {
    let processedUsers = filterUsers(allUsers, appState);
    processedUsers = sortUsers(processedUsers, appState.sort);
    
    const totalPages = Math.ceil(processedUsers.length / ITEMS_PER_PAGE);
    if (appState.page > totalPages && totalPages > 0) appState.page = totalPages;

    const paginated = paginateUsers(processedUsers, appState.page, ITEMS_PER_PAGE);
    
    resultsCount.textContent = processedUsers.length;
    renderCards(paginated);
    renderPagination(processedUsers.length);
    syncUrlWithState();
};

searchInput.addEventListener('input', debounce((e) => {
    appState.search = e.target.value;
    appState.page = 1;
    applyStateAndRender();
}, 300));

genderRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        appState.gender = e.target.value;
        appState.page = 1;
        applyStateAndRender();
    });
});

sortBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        appState.sort = e.target.dataset.sort;
        applyStateAndRender();
    });
});

resetBtn.addEventListener('click', () => {
    appState = { search: '', sort: '', gender: 'all', page: 1 };
    searchInput.value = '';
    const allRadio = document.querySelector('input[name="gender"][value="all"]');
    if (allRadio) allRadio.checked = true;
    applyStateAndRender();
});

paginationContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('page-btn')) {
        appState.page = parseInt(e.target.dataset.page);
        applyStateAndRender();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

cardsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;
    
    const id = btn.dataset.id;
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        btn.textContent = '🤍';
    } else {
        favorites.push(id);
        btn.textContent = '❤️';
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
});

window.addEventListener('popstate', (e) => {
    if (e.state) {
        appState = e.state;
        searchInput.value = appState.search;
        const targetRadio = document.querySelector(`input[name="gender"][value="${appState.gender}"]`);
        if (targetRadio) targetRadio.checked = true;
        applyStateAndRender();
    }
});

const initApp = () => {
    if (allUsers.length === 0) {
        readStateFromUrl();
        fetchUsers();
    }
};

checkAuth();