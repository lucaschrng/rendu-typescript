import {Category} from "./Category.js";
import {Task} from "./Task.js";

interface ICategoryManager {
  addCategory(category: Category): void;

  editCategory(id: number, category: Category): void;

  deleteCategory(id: number): void;

  addTaskToCategory(categoryId: number, task: Task): void;
}

export class CategoryManager implements ICategoryManager {
  constructor(private _categories: Category[]) {
  }

  get categories(): Category[] {
    return this._categories;
  }

  addCategory(category: Category): void {
    if (category.name === '') {
      throw new Error('Name is required');
    }
    this._categories.push(category);
  }

  editCategory(id: number, category: Category): void {
    const index = this._categories.findIndex((c) => c.id === id);
    console.log(category)
    this._categories[index] = category;
  }

  deleteCategory(id: number): void {
    const index = this._categories.findIndex((c) => c.id === id);
    this._categories.splice(index, 1);
  }

  addTaskToCategory(categoryId: number | null, task: Task): void {
    const category = this._categories.find((category: Category) => category.id === categoryId);
    console.log(category)
    if (!category) {
      this.addCategory({id: Math.floor(Math.random() * 999999999999999), name: task.category, tasks: [task]})
    } else {
      const categoryIndex = this._categories.findIndex((category: Category) => category.id === categoryId);
      this._categories[categoryIndex].tasks.push(task);
    }
  }
}