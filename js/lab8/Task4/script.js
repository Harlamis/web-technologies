const editBtn = document.getElementById('edit-btn');
const statusText = document.getElementById('status-text');
const grid = document.getElementById('grid');
let isEditing = false;
let draggedItem = null;
let placeholder = document.createElement('div');

placeholder.className = 'card placeholder';

const toggleEditMode = () => {
    isEditing = !isEditing;
    const cards = document.querySelectorAll('.card:not(.placeholder)');
    
    if (isEditing) {
        editBtn.textContent = 'Готово';
        statusText.textContent = 'Перетягуйте картки або натискайте × щоб видалити';
        grid.classList.add('edit-mode');
        cards.forEach(card => card.setAttribute('draggable', 'true'));
    } else {
        editBtn.textContent = 'Редагувати';
        statusText.textContent = 'Натисніть «Редагувати» для керування картками';
        grid.classList.remove('edit-mode');
        cards.forEach(card => card.setAttribute('draggable', 'false'));
    }
};

editBtn.addEventListener('click', toggleEditMode);

grid.addEventListener('click', (e) => {
    if (isEditing && e.target.classList.contains('delete-btn')) {
        const card = e.target.closest('.card');
        if (card) card.remove();
    }
});

grid.addEventListener('dragstart', (e) => {
    if (!isEditing) {
        e.preventDefault();
        return;
    }
    
    draggedItem = e.target.closest('.card');
    if (!draggedItem) return;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');

    setTimeout(() => {
        draggedItem.style.display = 'none';
        grid.insertBefore(placeholder, draggedItem);
    }, 0);
});

grid.addEventListener('dragover', (e) => {
    if (!isEditing || !draggedItem) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const targetCard = e.target.closest('.card:not(.placeholder)');
    if (targetCard && targetCard !== draggedItem) {
        const rect = targetCard.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        const midY = rect.top + rect.height / 2;
        
        if (e.clientY < midY || (e.clientY >= midY && e.clientX < midX)) {
            grid.insertBefore(placeholder, targetCard);
        } else {
            grid.insertBefore(placeholder, targetCard.nextSibling);
        }
    }
});

grid.addEventListener('dragend', (e) => {
    if (!isEditing || !draggedItem) return;
    
    draggedItem.style.display = '';
    grid.insertBefore(draggedItem, placeholder);
    if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
    draggedItem = null;
});

grid.addEventListener('drop', (e) => {
    e.preventDefault();
});