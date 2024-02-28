import {
  editTask,
  deleteTask,
  updateTask,
  cancelEdit,
  displayTasks,
  getTasks,
  displayCategories
} from './domFunctions.js';

(window as any).editTask = editTask;
(window as any).deleteTask = deleteTask;
(window as any).updateTask = updateTask;
(window as any).cancelEdit = cancelEdit;

displayTasks(getTasks());
displayCategories();