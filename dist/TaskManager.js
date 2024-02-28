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
        this._tasks.push(task);
    }
    editTask(index, task) {
        this._tasks[index] = task;
    }
    deleteTask(index) {
        this._tasks.splice(index, 1);
    }
    filterTasks(priority, dueDate) {
        let filteredTasks = this._tasks;
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
