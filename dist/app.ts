import { editTask, deleteTask, updateTask, cancelEdit, displayTasks, getTasks } from './domFunctions';

(window as any).editTask = editTask;
(window as any).deleteTask = deleteTask;
(window as any).updateTask = updateTask;
(window as any).cancelEdit = cancelEdit;

displayTasks(getTasks());