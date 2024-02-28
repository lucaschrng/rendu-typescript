interface Task {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

class TaskManager {
  constructor(private _tasks: Task[]) {
  }

  get tasks(): Task[] {
    return this._tasks;
  }

  addTask(task: Task): void {
    if (task.title === '') {
      throw new Error('Title is required');
    }
    if (task.description === '') {
      throw new Error('Description is required');
    }
    if (task.dueDate === '') {
      throw new Error('Due date is required');
    }
    this._tasks.push(task);
  }

  editTask(index: number, task: Task): void {
    this._tasks[index] = task;
  }

  deleteTask(index: number): void {
    this._tasks.splice(index, 1);
  }

  filterTasks(priority: "all" | "low" | "medium" | "high", dueDate?: string): Task[] {
    let filteredTasks: Task[] = this._tasks;

    if (priority !== 'all') {
      filteredTasks = filteredTasks.filter((task: Task) => {
        return task.priority === priority;
      });
    }

    if (dueDate) {
      filteredTasks = filteredTasks.filter((task: Task) => {
        return task.dueDate === dueDate;
      });
    }

    return filteredTasks;
  }
}

// Get tasks from local storage

const getTasks = (): Task[] => {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Display tasks

const displayTasks = (tasks: Task[]): void => {
  const tasksDiv: HTMLDivElement = document.querySelector('#tasks');
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

const searchInput: HTMLInputElement = document.querySelector('#searchInput');
const searchButton: HTMLButtonElement = document.querySelector('#searchButton');

searchButton.addEventListener('click', () => {
  const tasks: Task[] = getTasks();
  const filteredTasks: Task[] = tasks.filter((task: Task) => {
    return task.title.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  displayTasks(filteredTasks);
});

// Add task

const taskForm: HTMLFormElement = document.querySelector('#taskForm');
const taskTitle: HTMLInputElement = document.querySelector('#taskTitle');
const taskDescription: HTMLTextAreaElement = document.querySelector('#taskDescription');
const taskDueDate: HTMLInputElement = document.querySelector('#taskDueDate');
const taskPriority: HTMLSelectElement = document.querySelector('#taskPriority');

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

// Filter tasks

const filterForm: HTMLFormElement = document.querySelector('#filterForm');
const filterPriority: HTMLSelectElement = document.querySelector('#filterPriority');
const filterDate: HTMLInputElement = document.querySelector('#filterDate');

filterForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const taskManager = new TaskManager(getTasks());
  const filteredTasks: Task[] = taskManager.filterTasks(filterPriority.value as "all" | "low" | "medium" | "high", filterDate.value);

  displayTasks(filteredTasks);
});

// Delete task

const deleteTask = (index: number): void => {
  const taskManager = new TaskManager(getTasks());
  taskManager.deleteTask(index);
  localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
  displayTasks(taskManager.tasks);
}

// Edit task

const editTask = (index: number): void => {
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

const cancelEdit = (): void => {
  const taskManager = new TaskManager(getTasks());
  displayTasks(taskManager.tasks);
}

const updateTask = (event: Event, index: number): void => {
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