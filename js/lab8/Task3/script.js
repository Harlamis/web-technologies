const tasks = document.querySelectorAll('.task');
const columns = document.querySelectorAll('.column-body');

tasks.forEach(task => {
    task.addEventListener('dragstart', (e) => {
        task.classList.add('dragging');
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
    });
});

columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        column.classList.add('dragover');
    });

    column.addEventListener('dragleave', () => {
        column.classList.remove('dragover');
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('dragover');
        const taskId = e.dataTransfer.getData('text/plain');
        const draggableElement = document.getElementById(taskId);
        if (draggableElement) {
            column.appendChild(draggableElement);
        }
    });
});