# Task Management Application in TypeScript

## Overview
This is a simple Task Management Application developed using TypeScript. It allows users to create, view, update, delete, and categorize tasks. This application is not a comprehensive system but a small project focusing on the core functionalities needed for managing tasks effectively.

## Features
- **Task Creation and Display:** Users can add tasks with details such as title, description, due date, and priority (Low, Medium, High).
- **Task Categorization:** Enables the creation of custom categories to organize tasks.
- **Data Validation:** Ensures input data is valid and returns errors for invalid information.
- **Task Modification and Deletion:** Allows for the editing and removal of existing tasks.
- **Filtering and Sorting:** Features to filter and sort tasks by due date, priority, or category.
- **Data Persistence:** Utilizes `localStorage` to save and retrieve tasks from the browser.

## Technologies Used
- **TypeScript** for application logic.
- **HTML/CSS** for structure and styling.
- **localStorage** for data persistence.

## How to Recompile TypeScript to JavaScript
To recompile the TypeScript code to JavaScript, you will need to have TypeScript installed in your environment. If you've made changes to the TypeScript (.ts) files and need to update the JavaScript (.js) files, simply run the following command:

```bash
tsc
```