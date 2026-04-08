'use strict';

let products = [];
let currentFilter = null;
let currentSort = null;

const els = {
    totalPrice: document.getElementById('js-total-price'),
    productList: document.getElementById('js-product-list'),
    emptyState: document.getElementById('js-empty-state'),
    filterContainer: document.getElementById('js-filter-container'),
    addBtn: document.getElementById('js-add-btn'),
    resetFilterBtn: document.getElementById('js-reset-filter'),
    resetSortBtn: document.getElementById('js-reset-sort'),
    sortBtns: document.querySelectorAll('.sort-btn'),
    modal: document.getElementById('js-modal'),
    modalTitle: document.getElementById('js-modal-title'),
    form: document.getElementById('js-product-form'),
    closeModalBtn: document.getElementById('js-close-modal'),
    snackbar: document.getElementById('js-snackbar'),
    
    inputs: {
        id: document.getElementById('js-product-id'),
        name: document.getElementById('js-product-name'),
        price: document.getElementById('js-product-price'),
        category: document.getElementById('js-product-category'),
        image: document.getElementById('js-product-image')
    }
};

const generateId = () => Math.random().toString(36).substr(2, 9);
const getCurrentDate = () => new Date().toISOString();
const formatPrice = (price) => `${Number(price).toFixed(2)} ₴`;

const calculateTotalPrice = (items) => items.reduce((sum, item) => sum + Number(item.price), 0);
const getCategories = (items) => [...new Set(items.map(item => item.category))];

const filterProducts = (items, category) => category ? items.filter(item => item.category === category) : items;

const sortProducts = (items, sortBy) => {
    if (!sortBy) return items;
    return [...items].sort((a, b) => {
        if (sortBy === 'price') return Number(a.price) - Number(b.price);
        return new Date(b[sortBy]) - new Date(a[sortBy]);
    });
};

const addProduct = (productData) => {
    const newProduct = {
        id: generateId(),
        name: productData.name,
        price: productData.price,
        category: productData.category,
        image: productData.image,
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate()
    };
    products = [...products, newProduct];
    return newProduct;
};

const updateProduct = (productId, productData) => {
    products = products.map(product => 
        product.id === productId ? { 
            ...product, 
            ...productData, 
            updatedAt: getCurrentDate() 
        } : product
    );
    return products.find(product => product.id === productId);
};

const deleteProduct = (productId) => {
    const target = products.find(product => product.id === productId);
    products = products.filter(product => product.id !== productId);
    return target;
};

const showSnackbar = (message) => {
    els.snackbar.textContent = message;
    els.snackbar.className = "snackbar show";
    setTimeout(() => { els.snackbar.className = els.snackbar.className.replace("show", ""); }, 3000);
};

const toggleModal = (show = true, editMode = false) => {
    els.modal.classList.toggle('active', show);
    if (!show) els.form.reset();
    els.modalTitle.textContent = editMode ? 'Редагувати товар' : 'Додати товар';
};

const updateUIFiltersAndSort = () => {
    const categories = getCategories(products);
    els.filterContainer.innerHTML = '';
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${currentFilter === category ? 'active' : ''}`;
        btn.textContent = category;
        btn.addEventListener('click', () => {
            currentFilter = category;
            updateUIFiltersAndSort();
            refreshProductList();
        });
        els.filterContainer.appendChild(btn);
    });

    els.sortBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === currentSort);
    });
};

const createProductCard = (product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <div class="product-id">ID: ${product.id}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">${formatPrice(product.price)}</div>
            <div class="product-category">${product.category}</div>
            <div class="product-actions">
                <button class="edit-btn">Редагувати</button>
                <button class="delete-btn">Видалити</button>
            </div>
        </div>
    `;

    card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(product));
    card.querySelector('.delete-btn').addEventListener('click', () => deleteProductWithAnimation(product.id, card));

    return card;
};

const getFilteredAndSortedProducts = () => sortProducts(filterProducts(products, currentFilter), currentSort);

const refreshProductList = () => {
    const processedProducts = getFilteredAndSortedProducts();
    
    els.productList.innerHTML = '';
    
    if (processedProducts.length === 0) {
        els.productList.appendChild(els.emptyState);
        els.emptyState.style.display = 'block';
    } else {
        els.emptyState.style.display = 'none';
        processedProducts.forEach(product => {
            els.productList.appendChild(createProductCard(product));
        });
    }

    els.totalPrice.textContent = formatPrice(calculateTotalPrice(processedProducts));
};

const openEditModal = (product) => {
    els.inputs.id.value = product.id;
    els.inputs.name.value = product.name;
    els.inputs.price.value = product.price;
    els.inputs.category.value = product.category;
    els.inputs.image.value = product.image;
    toggleModal(true, true);
};

const deleteProductWithAnimation = (productId, cardElement) => {
    cardElement.classList.add('removing');
    cardElement.addEventListener('animationend', () => {
        const deleted = deleteProduct(productId);
        if (deleted) {
            showSnackbar(`Товар видалено: ${deleted.name}`);
            updateUIFiltersAndSort();
            refreshProductList();
        }
    });
};

const handleFormSubmit = (e) => {
    e.preventDefault();
    const productData = {
        name: els.inputs.name.value.trim(),
        price: Number(els.inputs.price.value),
        category: els.inputs.category.value.trim(),
        image: els.inputs.image.value.trim()
    };
    
    const id = els.inputs.id.value;
    
    if (id) {
        updateProduct(id, productData);
        showSnackbar(`Оновлено: ID ${id} - ${productData.name}`);
    } else {
        addProduct(productData);
        showSnackbar('Новий товар успішно додано!');
    }
    
    toggleModal(false);
    updateUIFiltersAndSort();
    refreshProductList();
};

const initApp = () => {
    els.addBtn.addEventListener('click', () => {
        els.inputs.id.value = '';
        toggleModal(true, false);
    });
    
    els.closeModalBtn.addEventListener('click', () => toggleModal(false));
    els.form.addEventListener('submit', handleFormSubmit);
    
    els.resetFilterBtn.addEventListener('click', () => {
        currentFilter = null;
        updateUIFiltersAndSort();
        refreshProductList();
    });

    els.resetSortBtn.addEventListener('click', () => {
        currentSort = null;
        updateUIFiltersAndSort();
        refreshProductList();
    });

    els.sortBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentSort = e.target.dataset.sort;
            updateUIFiltersAndSort();
            refreshProductList();
        });
    });

    products = [
        { id: generateId(), name: "Ноутбук Lenovo", price: 25000, category: "Електроніка", image: "https://via.placeholder.com/250", createdAt: getCurrentDate(), updatedAt: getCurrentDate() },
        { id: generateId(), name: "Мишка Logitech", price: 800, category: "Аксесуари", image: "https://via.placeholder.com/250", createdAt: getCurrentDate(), updatedAt: getCurrentDate() },
        { id: generateId(), name: "Стіл офісний", price: 4500, category: "Меблі", image: "https://via.placeholder.com/250", createdAt: getCurrentDate(), updatedAt: getCurrentDate() }
    ];

    updateUIFiltersAndSort();
    refreshProductList();
};

document.addEventListener('DOMContentLoaded', initApp);