export class CategoryManager {
    _categories;
    constructor(_categories) {
        this._categories = _categories;
    }
    get categories() {
        return this._categories;
    }
    addCategory(category) {
        if (category.name === '') {
            throw new Error('Name is required');
        }
        this._categories.push(category);
    }
    editCategory(id, category) {
        const index = this._categories.findIndex((c) => c.id === id);
        console.log(category);
        this._categories[index] = category;
    }
    deleteCategory(id) {
        const index = this._categories.findIndex((c) => c.id === id);
        this._categories.splice(index, 1);
    }
}
