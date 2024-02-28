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
    addTaskToCategory(categoryId, task) {
        const category = this._categories.find((category) => category.id === categoryId);
        console.log(category);
        if (!category) {
            this.addCategory({ id: Math.floor(Math.random() * 999999999999999), name: task.category, tasks: [task] });
        }
        else {
            const categoryIndex = this._categories.findIndex((category) => category.id === categoryId);
            this._categories[categoryIndex].tasks.push(task);
        }
    }
}
