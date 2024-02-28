import {Task} from './Task.js';
import {TaskManager} from './TaskManager.js';

// Get tasks from local storage

export const getTasks = (): Task[] => {
  return JSON.parse(localStorage.getItem('tasks') || "[]") || [];
}

// Display tasks

export const displayTasks = (tasks: Task[]): void => {
  const tasksDiv: HTMLDivElement | null = document.querySelector('#tasks');

  if (!tasksDiv) return;
  tasksDiv.innerHTML = '';

  tasks.forEach((task: Task, index: number) => {
    const taskDiv: HTMLDivElement = document.createElement('div');
    taskDiv.classList.add('task', task.priority);
    taskDiv.innerHTML = `
      <h3>${task.title} <span>– Priorité ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span></h3>
      <p>Date d'échéance: ${task.dueDate}</p>
      <p>${task.description}</p>
      <button type="button" onclick="deleteTask(${index})">Supprimer</button>
      <button class="edit-btn" onclick="editTask(${index})">Modifier</button>
    `;
    tasksDiv.appendChild(taskDiv);
  });
}

displayTasks(getTasks());

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

if (taskForm && taskTitle && taskDescription && taskDueDate && taskPriority) {
  taskForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    const taskManager = new TaskManager(getTasks());
    try {
      taskManager.addTask({
        title: taskTitle.value,
        description: taskDescription.value,
        dueDate: taskDueDate.value,
        priority: taskPriority.value as "low" | "medium" | "high"
      });

      localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
      displayTasks(taskManager.tasks);

      taskForm.reset();
    } catch (e) {
      alert(e);
    }
  });
}

// Filter tasks

const filterForm: HTMLFormElement | null = document.querySelector('#filterForm');
const filterPriority: HTMLSelectElement | null = document.querySelector('#filterPriority');
const filterDate: HTMLInputElement | null = document.querySelector('#filterDate');

if (filterForm && filterPriority && filterDate) {
  filterForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    const taskManager = new TaskManager(getTasks());
    const filteredTasks: Task[] = taskManager.filterTasks(filterPriority.value as "all" | "low" | "medium" | "high", filterDate.value);

    displayTasks(filteredTasks);
  });
}

// Delete task

export const deleteTask = (index: number): void => {
  const taskManager = new TaskManager(getTasks());
  taskManager.deleteTask(index);
  localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
  displayTasks(taskManager.tasks);
}

// Edit task

export const editTask = (index: number): void => {
  const taskManager = new TaskManager(getTasks());
  const task: Task = taskManager.tasks[index];

  const taskDivs: NodeListOf<HTMLDivElement> = document.querySelectorAll('.task');
  const taskDiv: HTMLDivElement = taskDivs[index];

  taskDiv.innerHTML = `
    <h2>Modifier une Tâche</h2>
    <form id="editTaskForm" onsubmit="updateTask(event, ${index})">
      <input type="text" id="taskTitle" placeholder="Titre de la tâche" value="${task.title}">
      <textarea id="taskDescription" placeholder="Description de la tâche">${task.description}</textarea>
      <input type="date" id="taskDueDate" value="${task.dueDate}">
      <select id="taskPriority">
        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Faible</option>
        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Moyenne</option>
        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Haute</option>
      </select>
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
  event.preventDefault();

  const taskManager = new TaskManager(getTasks());
  const task: Task = {
    title: (document.querySelector('#editTaskForm #taskTitle') as HTMLInputElement).value,
    description: (document.querySelector('#editTaskForm #taskDescription') as HTMLTextAreaElement).value,
    dueDate: (document.querySelector('#editTaskForm #taskDueDate') as HTMLInputElement).value,
    priority: (document.querySelector('#editTaskForm #taskPriority') as HTMLSelectElement).value as "low" | "medium" | "high"
  };
  taskManager.editTask(index, task);
  localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
  displayTasks(taskManager.tasks);
}