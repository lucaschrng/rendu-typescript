import {Category} from "./Category.js";

interface ICategoryManager {
  addCategory(category: Category): void;

  editCategory(id: number, category: Category): void;

  deleteCategory(id: number): void;
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
}