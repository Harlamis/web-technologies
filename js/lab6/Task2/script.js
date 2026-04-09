'use strict';

const els = {
  form: document.getElementById('js-todo-form'),
  input: document.getElementById('js-task-input'),
  list: document.getElementById('js-task-list'),
  emptyState: document.getElementById('js-empty-state'),
  sortBtns: document.querySelectorAll('.sort-btn'),
  resetSortBtn: document.getElementById('js-reset-sort'),
};

let state = {
  tasks: [],
  sortBy: null,
};

const generateId = () => Math.random().toString(36).substr(2, 9);
const getCurrentDate = () => new Date().toISOString();
const formatDate = (isoString) => new Date(isoString).toLocaleString('uk-UA');

const createTask = (text) => ({
  id: generateId(),
  text,
  isDone: false,
  createdAt: getCurrentDate(),
  updatedAt: getCurrentDate(),
});

const addTask = (tasks, text) => [...tasks, createTask(text)];

const removeTask = (tasks, id) => tasks.filter((task) => task.id !== id);

const toggleTaskStatus = (tasks, id) =>
  tasks.map((task) =>
    task.id === id
      ? { ...task, isDone: !task.isDone, updatedAt: getCurrentDate() }
      : task
  );

const editTaskText = (tasks, id, newText) =>
  tasks.map((task) =>
    task.id === id && task.text !== newText
      ? { ...task, text: newText, updatedAt: getCurrentDate() }
      : task
  );

const sortTasks = (tasks, criterion) => {
  if (!criterion) return tasks;
  return [...tasks].sort((a, b) => {
    if (criterion === 'status')
      return a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1;
    return new Date(b[criterion]) - new Date(a[criterion]);
  });
};

const updateState = (newState) => {
  state = { ...state, ...newState };
  render();
};

const createTaskElement = (task) => {
  const li = document.createElement('li');
  li.className = `task-item ${task.isDone ? 'done' : ''}`;
  li.dataset.id = task.id;

  li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.isDone ? 'checked' : ''}>
        <div class="task-content">
            <div class="task-text" ${!task.isDone ? 'contenteditable="true"' : ''}>${task.text}</div>
            <div class="task-meta">Створено: ${formatDate(task.createdAt)} | Оновлено: ${formatDate(task.updatedAt)}</div>
        </div>
        <button class="btn delete-btn">Видалити</button>
    `;

  const checkbox = li.querySelector('.task-checkbox');
  const deleteBtn = li.querySelector('.delete-btn');
  const textNode = li.querySelector('.task-text');

  checkbox.addEventListener('change', () => {
    updateState({ tasks: toggleTaskStatus(state.tasks, task.id) });
  });

  deleteBtn.addEventListener('click', () => {
    li.classList.add('removing');
    li.addEventListener('animationend', () => {
      updateState({ tasks: removeTask(state.tasks, task.id) });
    });
  });

  if (!task.isDone) {
    textNode.addEventListener('blur', (e) => {
      const newText = e.target.textContent.trim();
      if (newText && newText !== task.text) {
        updateState({ tasks: editTaskText(state.tasks, task.id, newText) });
      } else {
        e.target.textContent = task.text;
      }
    });

    textNode.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        textNode.blur();
      }
    });
  }

  return li;
};

const render = () => {
  els.list.innerHTML = '';

  const processedTasks = sortTasks(state.tasks, state.sortBy);

  if (processedTasks.length === 0) {
    els.emptyState.style.display = 'block';
  } else {
    els.emptyState.style.display = 'none';
    processedTasks.forEach((task) => {
      els.list.appendChild(createTaskElement(task));
    });
  }

  els.sortBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.sort === state.sortBy);
  });
};

const initApp = () => {
  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.input.value.trim();
    if (text) {
      updateState({ tasks: addTask(state.tasks, text) });
      els.input.value = '';
    }
  });

  els.sortBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      updateState({ sortBy: e.target.dataset.sort });
    });
  });

  els.resetSortBtn.addEventListener('click', () => {
    updateState({ sortBy: null });
  });

  updateState({
    tasks: [
      createTask('Something'),
      createTask('Прочитати про Pure Functions'),
    ],
  });
};

document.addEventListener('DOMContentLoaded', initApp);
