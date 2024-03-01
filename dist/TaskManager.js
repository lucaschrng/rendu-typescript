import { CategoryManager } from "./CategoryManager.js";
export class TaskManager {
    _tasks;
    constructor(_tasks) {
        this._tasks = _tasks;
    }
    get tasks() {
        return this._tasks;
    }
    addTask(task) {
        if (task.title === '') {
            throw new Error('Title is required');
        }
        if (task.description === '') {
            throw new Error('Description is required');
        }
        if (task.dueDate === '') {
            throw new Error('Due date is required');
        }
        if (task.category) {
            const categoryManager = new CategoryManager(JSON.parse(localStorage.getItem('categories') || "[]"));
            const categoryId = categoryManager.categories.find((c) => c.name === task.category)?.id;
            if (!categoryId) {
                categoryManager.addCategory({ id: Math.floor(Math.random() * 999999999999999), name: task.category });
            }
            localStorage.setItem('categories', JSON.stringify(categoryManager.categories));
        }
        this._tasks.push(task);
    }
    editTask(id, task) {
        const index = this._tasks.findIndex((t) => t.id === id);
        if (task.category && task.category !== this._tasks[index].category) {
            if (!localStorage.getItem('categories')) {
                localStorage.setItem('categories', '[]');
            }
            const categoryManager = new CategoryManager(JSON.parse(localStorage.getItem('categories') || "[]"));
            const categoryId = categoryManager.categories.find((c) => c.name === task.category)?.id;
            if (!categoryId) {
                categoryManager.addCategory({ id: Math.floor(Math.random() * 999999999999999), name: task.category });
            }
            localStorage.setItem('categories', JSON.stringify(categoryManager.categories));
        }
        this._tasks[index] = task;
    }
    deleteTask(id) {
        const index = this._tasks.findIndex((t) => t.id === id);
        this._tasks.splice(index, 1);
    }
    filterTasks(priority, dueDate, categoryId) {
        let filteredTasks = this._tasks;
        if (categoryId) {
            const categoryManager = new CategoryManager(JSON.parse(localStorage.getItem('categories') || "[]"));
            const categoryName = categoryManager.categories.find((c) => c.id === categoryId)?.name;
            if (categoryName) {
                filteredTasks = filteredTasks.filter((task) => {
                    return task.category === categoryName;
                });
            }
        }
        if (priority !== 'all') {
            filteredTasks = filteredTasks.filter((task) => {
                return task.priority === priority;
            });
        }
        if (dueDate) {
            filteredTasks = filteredTasks.filter((task) => {
                return task.dueDate === dueDate;
            });
        }
        return filteredTasks;
    }
}
