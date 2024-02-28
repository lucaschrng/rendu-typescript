import {Task} from './Task.js';
import {TaskManager} from './TaskManager.js';
import {Category} from "./Category";

// Get tasks from local storage

export const getTasks = (): Task[] => {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', '[]');
    return [];
  } else {
    return JSON.parse(localStorage.getItem('tasks') || "[]");  }
}

// Display tasks

export const displayTasks = (tasks: Task[]): void => {
  const tasksDiv: HTMLDivElement | null = document.querySelector('#tasks');
  const taskManager = new TaskManager(getTasks());

  if (!tasksDiv) return;
  tasksDiv.innerHTML = '';

  tasks.forEach((task: Task, index: number) => {
    const taskIndex = taskManager.tasks.findIndex((t: Task) => t.id === task.id);
    const taskDiv: HTMLDivElement = document.createElement('div');
    taskDiv.classList.add('task', task.priority);
    taskDiv.innerHTML = `
      <h3>${task.title} <span>– Priorité ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span></h3>
      <p>Date d'échéance: ${task.dueDate}</p>
      <p>${task.description}</p>
      <p>Catégorie: ${task.category || "Sans catégorie"}</p>
      <button type="button" onclick="deleteTask(${task.id})">Supprimer</button>
      <button class="edit-btn" onclick="editTask(${index}, ${taskIndex})">Modifier</button>
    `;
    tasksDiv.appendChild(taskDiv);
  });
}

// Search feature

const searchInput: HTMLInputElement | null = document.querySelector('#searchInput');
const searchButton: HTMLButtonElement | null = document.querySelector('#searchButton');

if (searchButton && searchInput) {
  searchButton.addEventListener('click', () => {
    const tasks: Task[] = getTasks();
    const filteredTasks: Task[] = tasks.filter((task: Task) => {
      return task.title.toLowerCase().includes(searchInput.value.toLowerCase());
    });
    displayTasks(filteredTasks);
  });
}

// Add task

const taskForm: HTMLFormElement | null = document.querySelector('#taskForm');
const taskTitle: HTMLInputElement | null = document.querySelector('#taskTitle');
const taskDescription: HTMLTextAreaElement | null = document.querySelector('#taskDescription');
const taskDueDate: HTMLInputElement | null = document.querySelector('#taskDueDate');
const taskPriority: HTMLSelectElement | null = document.querySelector('#taskPriority');
const taskCategory: HTMLSelectElement | null = document.querySelector('#taskCategory');

if (taskForm && taskTitle && taskDescription && taskDueDate && taskPriority) {
  taskForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    const taskManager = new TaskManager(getTasks());
    try {
      const task = {
        id: Math.floor(Math.random() * 999999999999999),
        title: taskTitle.value,
        description: taskDescription.value,
        dueDate: taskDueDate.value,
        priority: taskPriority.value as "low" | "medium" | "high",
        category: taskCategory ? taskCategory.value : ''
      }

      localStorage.getItem('categories') || localStorage.setItem('categories', '[]');

      taskManager.addTask(task);

      localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
      displayTasks(taskManager.tasks);
      displayCategories();

      taskForm.reset();
    } catch (e) {
      console.error(e);
      alert(e);
    }
  });
}

// Filter tasks

const filterForm: HTMLFormElement | null = document.querySelector('#filterForm');
const filterPriority: HTMLSelectElement | null = document.querySelector('#filterPriority');
const filterDate: HTMLInputElement | null = document.querySelector('#filterDate');
const filterCategory: HTMLSelectElement | null = document.querySelector('#filterCategory');

if (filterForm && filterPriority && filterDate) {
  filterForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    const taskManager = new TaskManager(getTasks());
    const filteredTasks: Task[] = taskManager.filterTasks(filterPriority.value as "all" | "low" | "medium" | "high", filterDate.value, filterCategory ? parseInt(filterCategory.value) : -1);

    displayTasks(filteredTasks);
  });
}

// Delete task

export const deleteTask = (taskId: number): void => {
  const taskManager = new TaskManager(getTasks());
  taskManager.deleteTask(taskId);
  localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
  displayTasks(taskManager.tasks);
}

// Edit task

export const editTask = (divIndex: number, taskIndex: number): void => {
  const taskManager = new TaskManager(getTasks());

  const taskDivs: NodeListOf<HTMLDivElement> = document.querySelectorAll('.task');
  const taskDiv: HTMLDivElement = taskDivs[divIndex];


  const task: Task = taskManager.tasks[taskIndex];

  taskDiv.innerHTML = `
    <h2>Modifier une Tâche</h2>
    <form id="editTaskForm" onsubmit="updateTask(event, ${taskIndex})">
      <input type="text" id="taskTitle" placeholder="Titre de la tâche" value="${task.title}">
      <textarea id="taskDescription" placeholder="Description de la tâche">${task.description}</textarea>
      <input type="date" id="taskDueDate" value="${task.dueDate}">
      <select id="taskPriority">
        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Faible</option>
        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Moyenne</option>
        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Haute</option>
      </select>
      <input type="text" id="taskCategory" placeholder="Catégorie de la tâche" value="${task.category ?? ""}">
      <input type="hidden" id="taskIndex" value="${task.id}">
      <button type="button" onclick="cancelEdit()">Annuler</button>
      <button type="submit">Modifier Tâche</button>
    </form>
  `;
}

export const cancelEdit = (): void => {
  const taskManager = new TaskManager(getTasks());
  displayTasks(taskManager.tasks);
}

export const updateTask = (event: Event, index: number): void => {
  const taskTitle: HTMLInputElement | null = document.querySelector('#editTaskForm #taskTitle');
  const taskDescription: HTMLTextAreaElement | null = document.querySelector('#editTaskForm #taskDescription');
  const taskDueDate: HTMLInputElement | null = document.querySelector('#editTaskForm #taskDueDate');
  const taskPriority: HTMLSelectElement | null = document.querySelector('#editTaskForm #taskPriority');
  const taskCategory: HTMLSelectElement | null = document.querySelector('#editTaskForm #taskCategory');
  const taskIndex: HTMLInputElement | null = document.querySelector('#editTaskForm #taskIndex');

  event.preventDefault();

  if (!taskTitle || !taskDescription || !taskDueDate || !taskPriority) return;
  const taskManager = new TaskManager(getTasks());
  const task: Task = {
    id: taskIndex ? parseInt(taskIndex.value) : Math.floor(Math.random() * 999999999999999),
    title: taskTitle.value,
    description: taskDescription.value,
    dueDate: taskDueDate.value,
    priority: taskPriority.value as "low" | "medium" | "high",
    category: taskCategory.value
  };
  taskManager.editTask(task.id, task);
  localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
  displayTasks(taskManager.tasks);
  displayCategories();
}

// Display categories

export const displayCategories = (): void => {
  const taskCategoriesDiv: HTMLDivElement | null = document.querySelector('#taskCategories');
  const categories: Category[] = JSON.parse(localStorage.getItem('categories') || "[]");
  const categoryInput: HTMLSelectElement | null = document.querySelector('#taskCategory');

  if (!taskCategoriesDiv) return;
  taskCategoriesDiv.innerHTML = '';

  categories.forEach((category: Category) => {
    const categoryButton: HTMLButtonElement = document.createElement('button');
    categoryButton.classList.add('category');
    categoryButton.textContent = category.name;
    categoryButton.type = 'button';
    categoryButton.onclick = () => {
      if (categoryInput) {
        categoryInput.value = category.name;
      }
    };

    taskCategoriesDiv.appendChild(categoryButton);
  });

  const filterCategory: HTMLSelectElement | null = document.querySelector('#filterCategory');
    if (filterCategory) {
        filterCategory.innerHTML = `
        <option value="all">Toutes</option>
        ${categories.map((category: Category) => `<option value="${category.id}">${category.name}</option>`).join('')}
        `;
    }
}