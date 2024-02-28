import { editTask, deleteTask, updateTask, cancelEdit, displayTasks, getTasks } from './domFunctions.js';
window.editTask = editTask;
window.deleteTask = deleteTask;
window.updateTask = updateTask;
window.cancelEdit = cancelEdit;
displayTasks(getTasks());
