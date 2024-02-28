import { Task } from './Task';

interface ITaskManager {
  addTask(task: Task): void;
  editTask(index: number, task: Task): void;
  deleteTask(index: number): void;
  filterTasks(priority: "all" | "low" | "medium" | "high", dueDate?: string): Task[];
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