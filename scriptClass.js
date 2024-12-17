class TodoApp {
  constructor() {
    // Inicjalizacja elementów DOM
    this.formSubmission = document.getElementById('todo-form');
    this.todoInput = document.getElementById('new-todo-input');
    this.todoList = document.getElementById('todo-list');
    this.filterAllBtn = document.querySelector('.filter-all');
    this.filterActiveBtn = document.querySelector('.filter-active');
    this.filterCompletedBtn = document.querySelector(
      '.filter-completed'
    );
    this.clearCompletedBtn = document.querySelector(
      '.clear-completed'
    );

    // Bindowanie metod
    this.handleSubmit = this.handleSubmit.bind(this);
    this.todoListChangeHandle = this.todoListChangeHandle.bind(this);
    this.filterAll = this.filterAll.bind(this);
    this.filterActive = this.filterActive.bind(this);
    this.filterCompleted = this.filterCompleted.bind(this);
    this.deleteCompleted = this.deleteCompleted.bind(this);

    this.addEventListeners();
  }
  addEventListeners() {
    // Dodawanie event listenerów
    this.formSubmission.addEventListener('submit', this.handleSubmit);
    this.todoList.addEventListener(
      'change',
      this.todoListChangeHandle
    );
    this.filterAllBtn.addEventListener('click', this.filterAll);
    this.filterActiveBtn.addEventListener('click', this.filterActive);
    this.filterCompletedBtn.addEventListener(
      'click',
      this.filterCompleted
    );
    this.clearCompletedBtn.addEventListener(
      'click',
      this.deleteCompleted
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    const todoText = this.todoInput.value.trim();
    if (todoText.length > 0) {
      this.addTodo(todoText);
      this.todoInput.value = '';
    }
  }

  addTodo(todoText) {
    const newTodo = document.createElement('li');
    newTodo.className = 'todo-item';

    const newTodoCheckbox = document.createElement('input');
    newTodoCheckbox.type = 'checkbox';
    newTodoCheckbox.className = 'todo-item-checkbox';

    const newTodoSpan = document.createElement('span');
    newTodoSpan.className = 'todo-text';
    newTodoSpan.textContent = todoText;

    this.todoList.appendChild(newTodo);
    newTodo.appendChild(newTodoCheckbox);
    newTodo.appendChild(newTodoSpan);
  }

  isCheckbox(element) {
    return element.matches('.todo-item-checkbox');
  }

  toggleCompleted(checkbox, todoSpan, todoItem) {
    checkbox.classList.toggle('todo-item-checkbox-completed');
    todoSpan.classList.toggle('todo-text-completed');
    todoItem.classList.toggle('completed');
  }

  returnAllItems() {
    return document.querySelectorAll('.todo-item');
  }

  filterAll() {
    this.returnAllItems().forEach(
      (item) => (item.style.display = 'flex')
    );
  }

  filterActive() {
    this.returnAllItems().forEach((item) => {
      const checkbox = item.querySelector('.todo-item-checkbox');
      item.style.display = checkbox.classList.contains(
        'todo-item-checkbox-completed'
      )
        ? 'none'
        : 'flex';
    });
  }

  filterCompleted() {
    this.returnAllItems().forEach((item) => {
      const checkbox = item.querySelector('.todo-item-checkbox');
      item.style.display = checkbox.classList.contains(
        'todo-item-checkbox-completed'
      )
        ? 'flex'
        : 'none';
    });
  }

  todoListChangeHandle(event) {
    const checkbox = event.target;
    const todoItem = checkbox.closest('.todo-item');
    const todoSpan = checkbox.nextElementSibling;

    if (this.isCheckbox(checkbox)) {
      this.toggleCompleted(checkbox, todoSpan, todoItem);
    }
  }
  deleteCompleted() {
    const completedItems = Array.from(this.returnAllItems()).filter(
      (item) => item.classList.contains('completed')
    );
    completedItems.forEach((item) => item.remove());
  }
}
const todoApp = new TodoApp();
