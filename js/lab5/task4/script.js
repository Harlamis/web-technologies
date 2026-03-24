let products = new Map();
let orders = new Set();
let productHistory = new WeakMap();
let visitedProducts = new WeakSet();

let prodList = document.getElementById('prod-list');
let orderList = document.getElementById('order-list');

function updateProdList() {
    prodList.innerHTML = '';
    for (let [id, prod] of products) {
        let li = document.createElement('li');
        li.textContent = id + ': ' + prod.name + ' - $' + prod.price + ' - Qty: ' + prod.quantity;
        prodList.appendChild(li);
    }
}

function updateOrderList() {
    orderList.innerHTML = '';
    for (let order of orders) {
        let li = document.createElement('li');
        li.textContent = 'Product ID: ' + order.prodId + ' - Qty: ' + order.qty;
        orderList.appendChild(li);
    }
}

document.getElementById('add-prod').addEventListener('click', () => {
    let id = document.getElementById('prod-id').value;
    let name = document.getElementById('prod-name').value;
    let price = parseFloat(document.getElementById('prod-price').value);
    let qty = parseInt(document.getElementById('prod-qty').value);
    if (id && name && price && qty) {
        products.set(id, { name, price, quantity: qty });
        productHistory.set(products.get(id), [{ action: 'added', time: new Date() }]);
        updateProdList();
    }
});

document.getElementById('del-prod').addEventListener('click', () => {
    let id = document.getElementById('del-id').value;
    if (products.has(id)) {
        products.delete(id);
        updateProdList();
    }
});

document.getElementById('update-prod').addEventListener('click', () => {
    let id = document.getElementById('update-id').value;
    let name = document.getElementById('update-name').value;
    let price = parseFloat(document.getElementById('update-price').value);
    let qty = parseInt(document.getElementById('update-qty').value);
    if (products.has(id)) {
        let prod = products.get(id);
        if (name) prod.name = name;
        if (price) prod.price = price;
        if (qty) prod.quantity = qty;
        let history = productHistory.get(prod) || [];
        history.push({ action: 'updated', time: new Date() });
        productHistory.set(prod, history);
        updateProdList();
    }
});

document.getElementById('search-prod').addEventListener('click', () => {
    let name = document.getElementById('search-name').value.toLowerCase();
    let results = [];
    for (let [id, prod] of products) {
        if (prod.name.toLowerCase().includes(name)) {
            results.push(id + ': ' + prod.name);
            visitedProducts.add(prod);
        }
    }
    alert('Found: ' + results.join(', '));
});

document.getElementById('add-order').addEventListener('click', () => {
    let prodId = document.getElementById('order-prod-id').value;
    let qty = parseInt(document.getElementById('order-qty').value);
    if (products.has(prodId) && products.get(prodId).quantity >= qty) {
        products.get(prodId).quantity -= qty;
        orders.add({ prodId, qty });
        updateProdList();
        updateOrderList();
    } else {
        alert('Not enough stock or product not found');
    }
});