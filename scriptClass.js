"use strict";
class TodoListAnchoring {
    static getTodoList() {
        const todoList = document.getElementById('todo-list');
        if (!todoList)
            throw new Error('Element .todo-list not found');
        return todoList;
    }
}
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
class TodoList {
    constructor() {
        this.todos = []; // or Array<Todo>;
        this.todoList = TodoListAnchoring.getTodoList();
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        this.todoList.addEventListener('change', this.handleTodoChange.bind(this));
        const filterAllBtn = document.querySelector('.filter-all');
        const filterActiveBtn = document.querySelector('.filter-active');
        const filterCompletedBtn = document.querySelector('.filter-completed');
        const clearCompletedBtn = document.querySelector('.clear-completed');
        if (!filterAllBtn)
            throw new Error('Button not found .filter-all');
        if (!filterActiveBtn)
            throw new Error('Button not found .filter-active');
        if (!filterCompletedBtn)
            throw new Error('Button not found .filter-completed');
        if (!clearCompletedBtn)
            throw new Error('Button not found .clear-completed');
        filterAllBtn.addEventListener('click', () => this.filterAll());
        filterActiveBtn.addEventListener('click', () => this.filterActive());
        filterCompletedBtn.addEventListener('click', () => this.filterCompleted());
        clearCompletedBtn.addEventListener('click', () => this.deleteCompleted());
    }
    addTodo(todo) {
        this.todos.push(todo);
        const todoElement = TodoRenderer.createTodo(todo);
        this.todoList.appendChild(todoElement);
        this.updateItemsCount();
    }
    removeFromList(id) {
        this.todos = this.todos.filter((todo) => todo.id !== id);
        const todoElement = this.todoList.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.remove();
        }
        this.updateItemsCount();
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
        checkbox.classList.toggle('todo-item-checkbox-completed', isChecked);
        todoSpan.classList.toggle('todo-text-completed', isChecked);
        todoItem.classList.toggle('completed', isChecked);
    }
    getTodoElement(id) {
        return this.todoList.querySelector(`[data-id="${id}"]`);
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
        const completedTodos = this.todos.filter((todo) => todo.isChecked);
        completedTodos.forEach((todo) => this.removeFromList(todo.id));
    }
    updateItemsCount() {
        const activeCount = this.todos.length;
        const itemsCountElement = document.querySelector('.items-count');
        if (itemsCountElement) {
            itemsCountElement.textContent = activeCount.toString();
        }
    }
}
class Todo {
    constructor(description) {
        this.id = UUIDgenerator.generateUUID();
        this.isChecked = false;
        this.description = description;
    }
}
class UUIDgenerator {
    static generateUUID() {
        return crypto.randomUUID();
    }
}
class TodoApp {
    constructor() {
        this.todoList = new TodoList();
        const form = document.getElementById('todo-form');
        const input = document.getElementById('new-todo-input');
        if (!form)
            throw new Error('Form element not found');
        if (!input)
            throw new Error('Input element not found');
        if (!(input instanceof HTMLInputElement))
            throw new Error('Element is not an input');
        //  Type assertion
        this.formSubmission = form;
        this.todoInput = input;
        this.formSubmission.addEventListener('submit', this.handleSubmit.bind(this));
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
class ToggleManager {
    constructor() {
        const themeToggleElement = document.querySelector('.toggle-light-dark-mode');
        if (!themeToggleElement ||
            !(themeToggleElement instanceof HTMLButtonElement)) {
            throw new Error('Theme toggle button not found or is not a button');
        }
        this.themeToggle = themeToggleElement;
        this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    }
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        this.updateThemeIcon();
    }
    updateThemeIcon() {
        const themeIcon = this.themeToggle.querySelector('img');
        if (!themeIcon)
            return;
        const isDarkTheme = document.body.classList.contains('dark-theme');
        themeIcon.src = isDarkTheme
            ? './images/icon-sun.svg'
            : './images/icon-moon.svg';
        themeIcon.alt = isDarkTheme ? 'sun icon' : 'moon icon';
    }
}
new ToggleManager();
// TODO Drag and Drop functionality
