import {
  editTask,
  deleteTask,
  updateTask,
  cancelEdit,
  displayTasks,
  getTasks,
  displayCategories
} from './domFunctions.js';


// Globally attach functions to the window object
(window as any).editTask = editTask;
(window as any).deleteTask = deleteTask;
(window as any).updateTask = updateTask;
(window as any).cancelEdit = cancelEdit;


// Initial display
displayTasks(getTasks());
displayCategories();