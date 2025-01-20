// Klasa odpowiedzialna za renderowanie całej listy
class TodoListRenderer {
  static renderTodoList(): HTMLUListElement {
    const todoList = document.createElement('ul');
    todoList.id = 'todo-list';
    todoList.className = 'todo-list';

    const wrapper = document.querySelector('.todo-wrapper');
    if (!wrapper) throw new Error('Element .todo-wrapper not found');

    wrapper.appendChild(todoList);
    return todoList;
  }
}

// Klasa odpowiedzialna za renderowanie pojedynczego todo
class TodoRenderer {
  static createTodo(todo: Todo) {
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
  private todos: Todo[] = []; // private todos: Array<Todo>;
  private todoList: HTMLUListElement;

  constructor() {
    this.todoList = TodoListRenderer.renderTodoList();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.todoList.addEventListener(
      'change',
      this.handleTodoChange.bind(this)
    );

    const filterAllBtn = document.querySelector('.filter-all');
    const filterActiveBtn = document.querySelector('.filter-active');
    const filterCompletedBtn = document.querySelector(
      '.filter-completed'
    );
    const clearCompletedBtn = document.querySelector(
      '.clear-completed'
    );

    if (!filterAllBtn)
      throw new Error('Nie znaleziono przycisku .filter-all');
    if (!filterActiveBtn)
      throw new Error('Nie znaleziono przycisku .filter-active');
    if (!filterCompletedBtn)
      throw new Error('Nie znaleziono przycisku .filter-completed');
    if (!clearCompletedBtn)
      throw new Error('Nie znaleziono przycisku .clear-completed');

    filterAllBtn.addEventListener('click', () => this.filterAll());
    filterActiveBtn.addEventListener('click', () =>
      this.filterActive()
    );
    filterCompletedBtn.addEventListener('click', () =>
      this.filterCompleted()
    );
    clearCompletedBtn.addEventListener('click', () =>
      this.deleteCompleted()
    );
  }

  addTodo(todo: Todo) {
    this.todos.push(todo);
    const todoElement = TodoRenderer.createTodo(todo);
    this.todoList.appendChild(todoElement);
  }

  removeFromList(id: string) {
    // Usuwanie z tablicy todos za pomocą filter
    this.todos = this.todos.filter((todo) => todo.id !== id);
    // Usuwanie elementu DOM
    const todoElement = this.todoList.querySelector<HTMLLIElement>(
      `[data-id="${id}"]`
    );
    if (todoElement) {
      todoElement.remove();
    }
  }

  handleTodoChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.matches('.todo-item-checkbox')) {
      const todoItem = checkbox.closest('.todo-item') as HTMLElement;
      const todoId = todoItem.dataset.id;
      const todo = this.todos.find((t) => t.id === todoId);

      if (todo) {
        todo.isChecked = checkbox.checked;
        this.updateTodoDisplay(todoItem, checkbox.checked);
      }
    }
  }

  updateTodoDisplay(todoItem: HTMLElement, isChecked: boolean) {
    const checkbox = todoItem.querySelector(
      '.todo-item-checkbox'
    ) as HTMLInputElement;
    const todoSpan = todoItem.querySelector(
      '.todo-text'
    ) as HTMLSpanElement;

    checkbox.classList.toggle(
      'todo-item-checkbox-completed',
      isChecked
    );
    todoSpan.classList.toggle('todo-text-completed', isChecked);
    todoItem.classList.toggle('completed', isChecked);
  }
  // getTodoElement osobna metoda
  private getTodoElement(id: string): HTMLLIElement | null {
    return this.todoList.querySelector<HTMLLIElement>(
      `[data-id="${id}"]`
    );
  }
  filterAll() {
    this.todos.forEach((todo) => {
      const todoElement = this.getTodoElement(todo.id);
      if (todoElement) {
        todoElement.style.display = 'flex';
      }
    });
  }

  filterActive() {
    this.todos.forEach((todo) => {
      const todoElement = this.getTodoElement(todo.id);
      if (todoElement) {
        todoElement.style.display = todo.isChecked ? 'none' : 'flex';
      }
    });
  }

  filterCompleted() {
    this.todos.forEach((todo) => {
      const todoElement = this.getTodoElement(todo.id);
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
  public id: string = UUIDgenerator.generateUUID();
  public description: string;
  public isChecked: boolean = false;

  constructor(description: string) {
    this.description = description;
  }
}

// Klasa pomocnicza
class UUIDgenerator {
  public static generateUUID() {
    return crypto.randomUUID();
  }
}

// Klasa aplikacji
class TodoApp {
  private todoList: TodoList = new TodoList();
  private formSubmission: HTMLFormElement;
  private todoInput: HTMLInputElement;
  constructor() {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('new-todo-input');

    if (!form) throw new Error('Form element not found');
    if (!input) throw new Error('Input element not found');
    if (!(input instanceof HTMLInputElement))
      throw new Error('Element is not an input');

    // Przypisanie do właściwości klasy ?? Type assertion
    this.formSubmission = form as HTMLFormElement;
    this.todoInput = input as HTMLInputElement;

    this.formSubmission.addEventListener(
      'submit',
      this.handleSubmit.bind(this)
    );
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const todoText = this.todoInput.value.trim();
    if (todoText.length > 0) {
      this.addTodo(todoText);
      this.todoInput.value = '';
    }
  }

  addTodo(todoText: string): void {
    const newTodo = new Todo(todoText);
    this.todoList.addTodo(newTodo);
  }
}

const todoApp = new TodoApp();
