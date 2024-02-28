import { TaskManager } from './TaskManager.js';
// Get tasks from local storage
export const getTasks = () => {
    return JSON.parse(localStorage.getItem('tasks') || "[]") || [];
};
// Display tasks
export const displayTasks = (tasks) => {
    const tasksDiv = document.querySelector('#tasks');
    if (!tasksDiv)
        return;
    tasksDiv.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
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
};
displayTasks(getTasks());
// Search feature
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
if (searchButton && searchInput) {
    searchButton.addEventListener('click', () => {
        const tasks = getTasks();
        const filteredTasks = tasks.filter((task) => {
            return task.title.toLowerCase().includes(searchInput.value.toLowerCase());
        });
        displayTasks(filteredTasks);
    });
}
// Add task
const taskForm = document.querySelector('#taskForm');
const taskTitle = document.querySelector('#taskTitle');
const taskDescription = document.querySelector('#taskDescription');
const taskDueDate = document.querySelector('#taskDueDate');
const taskPriority = document.querySelector('#taskPriority');
if (taskForm && taskTitle && taskDescription && taskDueDate && taskPriority) {
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskManager = new TaskManager(getTasks());
        try {
            taskManager.addTask({
                title: taskTitle.value,
                description: taskDescription.value,
                dueDate: taskDueDate.value,
                priority: taskPriority.value
            });
            localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
            displayTasks(taskManager.tasks);
            taskForm.reset();
        }
        catch (e) {
            alert(e);
        }
    });
}
// Filter tasks
const filterForm = document.querySelector('#filterForm');
const filterPriority = document.querySelector('#filterPriority');
const filterDate = document.querySelector('#filterDate');
if (filterForm && filterPriority && filterDate) {
    filterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskManager = new TaskManager(getTasks());
        const filteredTasks = taskManager.filterTasks(filterPriority.value, filterDate.value);
        displayTasks(filteredTasks);
    });
}
// Delete task
export const deleteTask = (index) => {
    const taskManager = new TaskManager(getTasks());
    taskManager.deleteTask(index);
    localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
    displayTasks(taskManager.tasks);
};
// Edit task
export const editTask = (index) => {
    const taskManager = new TaskManager(getTasks());
    const task = taskManager.tasks[index];
    const taskDivs = document.querySelectorAll('.task');
    const taskDiv = taskDivs[index];
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
};
export const cancelEdit = () => {
    const taskManager = new TaskManager(getTasks());
    displayTasks(taskManager.tasks);
};
export const updateTask = (event, index) => {
    event.preventDefault();
    const taskManager = new TaskManager(getTasks());
    const task = {
        title: document.querySelector('#editTaskForm #taskTitle').value,
        description: document.querySelector('#editTaskForm #taskDescription').value,
        dueDate: document.querySelector('#editTaskForm #taskDueDate').value,
        priority: document.querySelector('#editTaskForm #taskPriority').value
    };
    taskManager.editTask(index, task);
    localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
    displayTasks(taskManager.tasks);
};
