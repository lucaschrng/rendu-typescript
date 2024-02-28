import {Task} from './Task.js';
import {CategoryManager} from "./CategoryManager.js";

interface ITaskManager {
  addTask(task: Task): void;

  editTask(id: number, task: Task): void;

  deleteTask(id: number): void;

  filterTasks(priority: "all" | "low" | "medium" | "high", dueDate: string | null, categoryId: number): Task[];
}

export class TaskManager implements ITaskManager {
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

    if (task.category) {
      const categoryManager = new CategoryManager(JSON.parse(localStorage.getItem('categories') || "[]"));
      const categoryId = categoryManager.categories.find((c) => c.name === task.category)?.id;
      categoryManager.addTaskToCategory(categoryId === -1 ? null : categoryId, task);
      localStorage.setItem('categories', JSON.stringify(categoryManager.categories));
    }

    this._tasks.push(task);
  }

  editTask(id: number, task: Task): void {
    const index = this._tasks.findIndex((t) => t.id === id);

    if (task.category && task.category !== this._tasks[index].category) {
      if (!localStorage.getItem('categories')) {
        localStorage.setItem('categories', '[]');
      }
      const categoryManager = new CategoryManager(JSON.parse(localStorage.getItem('categories') || "[]"));
      categoryManager.categories.forEach((category) => {
        category.tasks = category.tasks.filter((t) => t.id !== task.id);
        categoryManager.editCategory(categoryManager.categories.indexOf(category), category);
      });
      categoryManager.addTaskToCategory(task.id, task);
      localStorage.setItem('categories', JSON.stringify(categoryManager.categories));
    }

    this._tasks[index] = task;
  }

  deleteTask(id: number): void {
    const categoryManager = new CategoryManager(JSON.parse(localStorage.getItem('categories') || "[]"));
    categoryManager.categories.forEach((category) => {
      category.tasks = category.tasks.filter((t) => t.id !== id);
      categoryManager.editCategory(category.id, category);
    })
    localStorage.setItem('categories', JSON.stringify(categoryManager.categories));

    const index = this._tasks.findIndex((t) => t.id === id);
    this._tasks.splice(index, 1);
  }

  filterTasks(priority: "all" | "low" | "medium" | "high", dueDate: string | null, categoryId: number): Task[] {
    let filteredTasks: Task[] = this._tasks;

    if (categoryId) {
      const categoryManager = new CategoryManager(JSON.parse(localStorage.getItem('categories') || "[]"));
      const categoryIndex = categoryManager.categories.findIndex((c) => c.id === categoryId);
      if (categoryIndex !== -1) {
        filteredTasks = categoryManager.categories[categoryIndex].tasks;
      }
    }

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