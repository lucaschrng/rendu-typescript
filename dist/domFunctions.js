import { TaskManager } from './TaskManager.js';
// Get tasks from local storage
export const getTasks = () => {
    if (!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', '[]');
        return [];
    }
    else {
        return JSON.parse(localStorage.getItem('tasks') || "[]");
    }
};
// Display tasks
export const displayTasks = (tasks) => {
    const tasksDiv = document.querySelector('#tasks');
    const taskManager = new TaskManager(getTasks());
    if (!tasksDiv)
        return;
    tasksDiv.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskIndex = taskManager.tasks.findIndex((t) => t.id === task.id);
        const taskDiv = document.createElement('div');
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
};
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
const taskCategory = document.querySelector('#taskCategory');
if (taskForm && taskTitle && taskDescription && taskDueDate && taskPriority) {
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskManager = new TaskManager(getTasks());
        try {
            const task = {
                id: Math.floor(Math.random() * 999999999999999),
                title: taskTitle.value,
                description: taskDescription.value,
                dueDate: taskDueDate.value,
                priority: taskPriority.value,
                category: taskCategory ? taskCategory.value : ''
            };
            localStorage.getItem('categories') || localStorage.setItem('categories', '[]');
            taskManager.addTask(task);
            localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
            displayTasks(taskManager.tasks);
            displayCategories();
            taskForm.reset();
        }
        catch (e) {
            console.error(e);
            alert(e);
        }
    });
}
// Filter tasks
const filterForm = document.querySelector('#filterForm');
const filterPriority = document.querySelector('#filterPriority');
const filterDate = document.querySelector('#filterDate');
const filterCategory = document.querySelector('#filterCategory');
if (filterForm && filterPriority && filterDate) {
    filterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskManager = new TaskManager(getTasks());
        const filteredTasks = taskManager.filterTasks(filterPriority.value, filterDate.value, filterCategory ? parseInt(filterCategory.value) : -1);
        displayTasks(filteredTasks);
    });
}
// Delete task
export const deleteTask = (taskId) => {
    const taskManager = new TaskManager(getTasks());
    taskManager.deleteTask(taskId);
    localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
    displayTasks(taskManager.tasks);
};
// Edit task
export const editTask = (divIndex, taskIndex) => {
    const taskManager = new TaskManager(getTasks());
    const taskDivs = document.querySelectorAll('.task');
    const taskDiv = taskDivs[divIndex];
    const task = taskManager.tasks[taskIndex];
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
};
export const cancelEdit = () => {
    const taskManager = new TaskManager(getTasks());
    displayTasks(taskManager.tasks);
};
export const updateTask = (event, index) => {
    const taskTitle = document.querySelector('#editTaskForm #taskTitle');
    const taskDescription = document.querySelector('#editTaskForm #taskDescription');
    const taskDueDate = document.querySelector('#editTaskForm #taskDueDate');
    const taskPriority = document.querySelector('#editTaskForm #taskPriority');
    const taskCategory = document.querySelector('#editTaskForm #taskCategory');
    const taskIndex = document.querySelector('#editTaskForm #taskIndex');
    event.preventDefault();
    if (!taskTitle || !taskDescription || !taskDueDate || !taskPriority)
        return;
    const taskManager = new TaskManager(getTasks());
    const task = {
        id: taskIndex ? parseInt(taskIndex.value) : Math.floor(Math.random() * 999999999999999),
        title: taskTitle.value,
        description: taskDescription.value,
        dueDate: taskDueDate.value,
        priority: taskPriority.value,
        category: taskCategory.value
    };
    taskManager.editTask(task.id, task);
    localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
    displayTasks(taskManager.tasks);
    displayCategories();
};
// Display categories
export const displayCategories = () => {
    const taskCategoriesDiv = document.querySelector('#taskCategories');
    const categories = JSON.parse(localStorage.getItem('categories') || "[]");
    const categoryInput = document.querySelector('#taskCategory');
    if (!taskCategoriesDiv)
        return;
    taskCategoriesDiv.innerHTML = '';
    categories.forEach((category) => {
        const categoryButton = document.createElement('button');
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
    const filterCategory = document.querySelector('#filterCategory');
    if (filterCategory) {
        filterCategory.innerHTML = `
        <option value="all">Toutes</option>
        ${categories.map((category) => `<option value="${category.id}">${category.name}</option>`).join('')}
        `;
    }
};
