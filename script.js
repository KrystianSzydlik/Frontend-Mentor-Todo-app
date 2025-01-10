const formSubmission = document.getElementById('todo-form');
const todoInput = document.getElementById('new-todo-input');
const todoList = document.getElementById('todo-list');

const handleSubmit = (event) => {
  event.preventDefault();

  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    addTodo(todoText);
    todoInput.value = '';
  }
};

formSubmission.addEventListener('submit', handleSubmit);

function addTodo(todoText) {
  const newTodo = document.createElement('li');

  newTodo.className = 'todo-item';
  const newTodoCheckbox = document.createElement('input');
  newTodoCheckbox.type = 'checkbox';
  newTodoCheckbox.className = 'todo-item-checkbox';

  const newTodoSpan = document.createElement('span');
  newTodoSpan.className = 'todo-text';
  newTodoSpan.textContent = todoText;

  todoList.appendChild(newTodo);
  newTodo.appendChild(newTodoCheckbox);
  newTodo.appendChild(newTodoSpan);
}

function isCheckbox(element) {
  return element.matches('.todo-item-checkbox');
}
function toggleCompleted(checkbox, todoSpan, todoItem) {
  checkbox.classList.toggle('todo-item-checkbox-completed');
  todoSpan.classList.toggle('todo-text-completed');
  todoItem.classList.toggle('completed');
}
const todoListChangeHandle = (event) => {
  const element = event.target;

  if (isCheckbox(element)) {
    const checkbox = element;
    const todoItem = checkbox.closest('.todo-item');
    const todoSpan = checkbox.nextElementSibling;
    toggleCompleted(checkbox, todoSpan, todoItem);
  }
};

todoList.addEventListener('change', todoListChangeHandle);

const filterAllBtn = document.querySelector('.filter-all');
const filterActiveBtn = document.querySelector('.filter-active');
const filterCompletedBtn = document.querySelector(
  '.filter-completed'
);
const clearCompletedBtn = document.querySelector('.clear-completed');

filterAllBtn.addEventListener('click', filterAll);
filterActiveBtn.addEventListener('click', filterActive);
// filterCompletedBtn.addEventListener('click', filterCompleted);

clearCompletedBtn.addEventListener('click', deleteCompleted);

function filterCompleted() {
  allItems.forEach((item) => {
    const checkbox = item.querySelector('.todo-item-checkbox');
    item.style.display = checkbox.classList.contains(
      'todo-item-checkbox-completed'
    )
      ? 'flex'
      : 'none';
  });
}

function returnAllItems() {
  const allItems = document.querySelectorAll('.todo-item');
  return allItems;
}
function filterAll() {
  returnAllItems().forEach((item) => (item.style.display = 'flex'));
}

function filterActive() {
  returnAllItems().forEach((item) => {
    const checkbox = item.querySelector('.todo-item-checkbox');
    item.style.display = checkbox.classList.contains(
      'todo-item-checkbox-completed'
    )
      ? 'none'
      : 'flex';
  });
}
function filterCompleted() {
  returnAllItems().forEach((item) => {
    const checkbox = item.querySelector('.todo-item-checkbox');
    item.style.display = checkbox.classList.contains(
      'todo-item-checkbox-completed'
    )
      ? 'flex'
      : 'none';
  });
}

function deleteCompleted() {
  const completedItems = Array.from(returnAllItems()).filter((item) =>
    item.classList.contains('completed')
  );
  completedItems.forEach((item) => {
    item.remove();
  });
}
