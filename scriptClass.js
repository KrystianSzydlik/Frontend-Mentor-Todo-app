// Klasa odpowiedzialna za renderowanie całej listy
class TodoListRenderer {
  static renderTodoList() {
    const todoList = document.createElement('ul');
    todoList.id = 'todo-list';
    todoList.className = 'todo-list';
    document.querySelector('.todo-wrapper').appendChild(todoList);
    return todoList;
  }
}

// Klasa odpowiedzialna za renderowanie pojedynczego todo
class TodoRenderer {
  static createTodo(todo) {
    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';
    todoItem.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-item-checkbox';
    checkbox.checked = todo.isChecked;

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.description;

    todoItem.appendChild(checkbox);
    todoItem.appendChild(span);

    return todoItem;
  }
}

// Główna klasa zarządzająca listą todos
class TodoList {
  constructor() {
    this.todos = [];
    this.todoList = TodoListRenderer.renderTodoList();
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.todoList.addEventListener(
      'change',
      this.handleTodoChange.bind(this)
    );
    document
      .querySelector('.filter-all')
      .addEventListener('click', () => this.filterAll());
    document
      .querySelector('.filter-active')
      .addEventListener('click', () => this.filterActive());
    document
      .querySelector('.filter-completed')
      .addEventListener('click', () => this.filterCompleted());
    document
      .querySelector('.clear-completed')
      .addEventListener('click', () => this.deleteCompleted());
  }

  addTodo(todo) {
    this.todos.push(todo);
    const todoElement = TodoRenderer.createTodo(todo);
    this.todoList.appendChild(todoElement);
  }

  removeFromList(id) {
    // Usuwanie z tablicy todos za pomocą filter
    this.todos = this.todos.filter((todo) => todo.id !== id);
    // Usuwanie elementu DOM
    const todoElement = this.todoList.querySelector(
      `[data-id="${id}"]`
    );
    if (todoElement) {
      todoElement.remove();
    }
  }

  handleTodoChange(event) {
    const checkbox = event.target;
    if (checkbox.matches('.todo-item-checkbox')) {
      const todoItem = checkbox.closest('.todo-item');
      const todoId = todoItem.dataset.id;
      const todo = this.todos.find((t) => t.id === todoId);

      if (todo) {
        todo.isChecked = checkbox.checked;
        this.updateTodoDisplay(todoItem, checkbox.checked);
      }
    }
  }

  updateTodoDisplay(todoItem, isChecked) {
    const checkbox = todoItem.querySelector('.todo-item-checkbox');
    const todoSpan = todoItem.querySelector('.todo-text');

    checkbox.classList.toggle(
      'todo-item-checkbox-completed',
      isChecked
    );
    todoSpan.classList.toggle('todo-text-completed', isChecked);
    todoItem.classList.toggle('completed', isChecked);
  }
  // getTodoElement osobna metoda
  filterAll() {
    this.todos.forEach((todo) => {
      const todoElement = this.todoList.querySelector(
        `[data-id="${todo.id}"]`
      );
      if (todoElement) {
        todoElement.style.display = 'flex';
      }
    });
  }

  filterActive() {
    this.todos.forEach((todo) => {
      const todoElement = this.todoList.querySelector(
        `[data-id="${todo.id}"]`
      );
      if (todoElement) {
        todoElement.style.display = todo.isChecked ? 'none' : 'flex';
      }
    });
  }

  filterCompleted() {
    this.todos.forEach((todo) => {
      const todoElement = this.todoList.querySelector(
        `[data-id="${todo.id}"]`
      );
      if (todoElement) {
        todoElement.style.display = todo.isChecked ? 'flex' : 'none';
      }
    });
  }

  deleteCompleted() {
    const completedTodos = this.todos.filter(
      (todo) => todo.isChecked
    );
    completedTodos.forEach((todo) => this.removeFromList(todo.id));
  }
}

// Klasa reprezentująca pojedyncze todo
class Todo {
  constructor(description) {
    this.id = UUIDgenerator.generateUUID();
    this.description = description;
    this.isChecked = false;
  }
}

// Klasa pomocnicza
class UUIDgenerator {
  static generateUUID() {
    return crypto.randomUUID();
  }
}

// Klasa aplikacji
class TodoApp {
  constructor() {
    this.todoList = new TodoList();
    this.formSubmission = document.getElementById('todo-form');
    this.todoInput = document.getElementById('new-todo-input');

    this.formSubmission.addEventListener(
      'submit',
      this.handleSubmit.bind(this)
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
    const newTodo = new Todo(todoText);
    this.todoList.addTodo(newTodo);
  }
}

const todoApp = new TodoApp();
