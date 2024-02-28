define("Task", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("TaskManager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TaskManager = void 0;
    var TaskManager = /** @class */ (function () {
        function TaskManager(_tasks) {
            this._tasks = _tasks;
        }
        Object.defineProperty(TaskManager.prototype, "tasks", {
            get: function () {
                return this._tasks;
            },
            enumerable: false,
            configurable: true
        });
        TaskManager.prototype.addTask = function (task) {
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
        };
        TaskManager.prototype.editTask = function (index, task) {
            this._tasks[index] = task;
        };
        TaskManager.prototype.deleteTask = function (index) {
            this._tasks.splice(index, 1);
        };
        TaskManager.prototype.filterTasks = function (priority, dueDate) {
            var filteredTasks = this._tasks;
            if (priority !== 'all') {
                filteredTasks = filteredTasks.filter(function (task) {
                    return task.priority === priority;
                });
            }
            if (dueDate) {
                filteredTasks = filteredTasks.filter(function (task) {
                    return task.dueDate === dueDate;
                });
            }
            return filteredTasks;
        };
        return TaskManager;
    }());
    exports.TaskManager = TaskManager;
});
define("domFunctions", ["require", "exports", "TaskManager"], function (require, exports, TaskManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateTask = exports.cancelEdit = exports.editTask = exports.deleteTask = exports.displayTasks = exports.getTasks = void 0;
    // Get tasks from local storage
    var getTasks = function () {
        return JSON.parse(localStorage.getItem('tasks') || "[]") || [];
    };
    exports.getTasks = getTasks;
    // Display tasks
    var displayTasks = function (tasks) {
        var tasksDiv = document.querySelector('#tasks');
        if (!tasksDiv)
            return;
        tasksDiv.innerHTML = '';
        tasks.forEach(function (task, index) {
            var taskDiv = document.createElement('div');
            taskDiv.classList.add('task', task.priority);
            taskDiv.innerHTML = "\n      <h3>".concat(task.title, " <span>\u2013 Priorit\u00E9 ").concat(task.priority.charAt(0).toUpperCase() + task.priority.slice(1), "</span></h3>\n      <p>Date d'\u00E9ch\u00E9ance: ").concat(task.dueDate, "</p>\n      <p>").concat(task.description, "</p>\n      <button type=\"button\" onclick=\"deleteTask(").concat(index, ")\">Supprimer</button>\n      <button class=\"edit-btn\" onclick=\"editTask(").concat(index, ")\">Modifier</button>\n    ");
            tasksDiv.appendChild(taskDiv);
        });
    };
    exports.displayTasks = displayTasks;
    (0, exports.displayTasks)((0, exports.getTasks)());
    // Search feature
    var searchInput = document.querySelector('#searchInput');
    var searchButton = document.querySelector('#searchButton');
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function () {
            var tasks = (0, exports.getTasks)();
            var filteredTasks = tasks.filter(function (task) {
                return task.title.toLowerCase().includes(searchInput.value.toLowerCase());
            });
            (0, exports.displayTasks)(filteredTasks);
        });
    }
    // Add task
    var taskForm = document.querySelector('#taskForm');
    var taskTitle = document.querySelector('#taskTitle');
    var taskDescription = document.querySelector('#taskDescription');
    var taskDueDate = document.querySelector('#taskDueDate');
    var taskPriority = document.querySelector('#taskPriority');
    if (taskForm && taskTitle && taskDescription && taskDueDate && taskPriority) {
        taskForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var taskManager = new TaskManager_1.TaskManager((0, exports.getTasks)());
            try {
                taskManager.addTask({
                    title: taskTitle.value,
                    description: taskDescription.value,
                    dueDate: taskDueDate.value,
                    priority: taskPriority.value
                });
                localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
                (0, exports.displayTasks)(taskManager.tasks);
                taskForm.reset();
            }
            catch (e) {
                alert(e);
            }
        });
    }
    // Filter tasks
    var filterForm = document.querySelector('#filterForm');
    var filterPriority = document.querySelector('#filterPriority');
    var filterDate = document.querySelector('#filterDate');
    if (filterForm && filterPriority && filterDate) {
        filterForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var taskManager = new TaskManager_1.TaskManager((0, exports.getTasks)());
            var filteredTasks = taskManager.filterTasks(filterPriority.value, filterDate.value);
            (0, exports.displayTasks)(filteredTasks);
        });
    }
    // Delete task
    var deleteTask = function (index) {
        var taskManager = new TaskManager_1.TaskManager((0, exports.getTasks)());
        taskManager.deleteTask(index);
        localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
        (0, exports.displayTasks)(taskManager.tasks);
    };
    exports.deleteTask = deleteTask;
    // Edit task
    var editTask = function (index) {
        var taskManager = new TaskManager_1.TaskManager((0, exports.getTasks)());
        var task = taskManager.tasks[index];
        var taskDivs = document.querySelectorAll('.task');
        var taskDiv = taskDivs[index];
        taskDiv.innerHTML = "\n    <h2>Modifier une T\u00E2che</h2>\n    <form id=\"editTaskForm\" onsubmit=\"updateTask(event, ".concat(index, ")\">\n      <input type=\"text\" id=\"taskTitle\" placeholder=\"Titre de la t\u00E2che\" value=\"").concat(task.title, "\">\n      <textarea id=\"taskDescription\" placeholder=\"Description de la t\u00E2che\">").concat(task.description, "</textarea>\n      <input type=\"date\" id=\"taskDueDate\" value=\"").concat(task.dueDate, "\">\n      <select id=\"taskPriority\">\n        <option value=\"low\" ").concat(task.priority === 'low' ? 'selected' : '', ">Faible</option>\n        <option value=\"medium\" ").concat(task.priority === 'medium' ? 'selected' : '', ">Moyenne</option>\n        <option value=\"high\" ").concat(task.priority === 'high' ? 'selected' : '', ">Haute</option>\n      </select>\n      <button type=\"button\" onclick=\"cancelEdit()\">Annuler</button>\n      <button type=\"submit\">Modifier T\u00E2che</button>\n    </form>\n  ");
    };
    exports.editTask = editTask;
    var cancelEdit = function () {
        var taskManager = new TaskManager_1.TaskManager((0, exports.getTasks)());
        (0, exports.displayTasks)(taskManager.tasks);
    };
    exports.cancelEdit = cancelEdit;
    var updateTask = function (event, index) {
        event.preventDefault();
        var taskManager = new TaskManager_1.TaskManager((0, exports.getTasks)());
        var task = {
            title: document.querySelector('#editTaskForm #taskTitle').value,
            description: document.querySelector('#editTaskForm #taskDescription').value,
            dueDate: document.querySelector('#editTaskForm #taskDueDate').value,
            priority: document.querySelector('#editTaskForm #taskPriority').value
        };
        taskManager.editTask(index, task);
        localStorage.setItem('tasks', JSON.stringify(taskManager.tasks));
        (0, exports.displayTasks)(taskManager.tasks);
    };
    exports.updateTask = updateTask;
});
define("app", ["require", "exports", "domFunctions"], function (require, exports, domFunctions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.editTask = domFunctions_1.editTask;
    window.deleteTask = domFunctions_1.deleteTask;
    window.updateTask = domFunctions_1.updateTask;
    window.cancelEdit = domFunctions_1.cancelEdit;
    (0, domFunctions_1.displayTasks)((0, domFunctions_1.getTasks)());
});
